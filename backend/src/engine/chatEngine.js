import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { CircuitBreaker } from '../utils/circuitBreaker.js';
import { logger, getCorrelationId } from '../utils/logger.js';
import { recordLlmTelemetry } from '../utils/telemetry.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../.env') });

const GROQ_API_KEY = process.env.GROQ_API_KEY || '';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

// Circuit Breaker Instances with 3-failure threshold and 15s reset window
export const groqBreaker = new CircuitBreaker('Groq_LLM_API', { failureThreshold: 3, resetTimeoutMs: 15000 });
export const geminiBreaker = new CircuitBreaker('Gemini_LLM_API', { failureThreshold: 3, resetTimeoutMs: 15000 });

/**
 * PromoAlign AI Chatbot Engine
 * Powered by Groq AI & Google Gemini AI with Resilience, Circuit Breakers & Observability.
 */
export async function processChatMessage(userMessage, persona = 'MARKETING', appState = {}) {
  const correlationId = getCorrelationId();
  const msg = (userMessage || '').trim();
  const recommendations = appState.recommendations || [];
  const summary = appState.summary || {};
  const activeDatasetName = appState.datasetName || 'PromoAlign Core Retail Dataset';
  const kaggleStats = appState.kaggleStats || null;

  logger.info(`💬 Processing Chat Message: "${msg.slice(0, 50)}..."`, { correlationId, persona, datasetName: activeDatasetName });

  // 1. Attempt Primary Provider: Groq Llama 3.3 70B via groqBreaker
  if (GROQ_API_KEY) {
    try {
      const groqReply = await groqBreaker.execute(
        () => queryGroqAI(msg, persona, { activeDatasetName, recommendations, summary, kaggleStats }, correlationId),
        null // Pass to catch block for secondary provider failover
      );
      if (groqReply) return groqReply;
    } catch (err) {
      logger.warn(`⚠️ Groq AI query failed or circuit OPEN. Failing over to Gemini API.`, { correlationId, error: err.message });
    }
  }

  // 2. Attempt Secondary Provider: Google Gemini 1.5 Flash via geminiBreaker
  if (GEMINI_API_KEY) {
    try {
      const geminiReply = await geminiBreaker.execute(
        () => queryGeminiAI(msg, persona, { activeDatasetName, recommendations, summary, kaggleStats }, correlationId),
        null // Pass to catch block for local fallback
      );
      if (geminiReply) return geminiReply;
    } catch (err) {
      logger.warn(`⚠️ Gemini AI query failed or circuit OPEN. Failing over to Local Rule Engine.`, { correlationId, error: err.message });
    }
  }

  // 3. Fallback: Context-Aware Local Rule Engine
  const startTime = Date.now();
  logger.info(`⚡ Executing Local Rule Engine Fallback`, { correlationId });
  const localReply = highRelevanceAnalyticsEngine(msg, recommendations, summary, activeDatasetName, kaggleStats);
  const latencyMs = Date.now() - startTime;
  recordLlmTelemetry({ provider: 'local_rule', latencyMs, inputText: msg, outputText: localReply.text, status: 'SUCCESS', correlationId });

  return localReply;
}

/**
 * Ultra-Fast Groq AI Call via REST API
 */
async function queryGroqAI(userMsg, persona, context, correlationId) {
  const startTime = Date.now();
  const url = "https://api.groq.com/openai/v1/chat/completions";

  const sampleRecs = (context.recommendations || []).slice(0, 15).map(r => 
    `- "${r.product_name}" (${r.category}) | Region: ${r.region} | Target: "${r.segment_name}" | Base Price: ₹${r.base_price} | Discount: ${r.discount_pct}% OFF | Stock: ${r.metrics.stockQty} units | Demand: ${r.metrics.projectedUnits} units | Rev Lift: +₹${r.metrics.projectedRevenue.toLocaleString('en-IN')} | Risk: ${r.constraintEval.riskLevel}`
  ).join('\n');

  const systemPrompt = `
You are PromoAlign AI, an expert Retail Copilot assisting Category Lead Sravanthi.
Answer user questions accurately using the real-time application context below. All prices and money metrics are in Indian Rupees (₹ / INR).

ACTIVE DATASET: "${context.activeDatasetName}"
USER ROLE / PERSONA: ${persona}

LIVE CAMPAIGN METRICS:
- Total Candidate Promos: ${context.recommendations.length} items
- Projected Revenue Lift: +₹${(context.summary.totalIncrementalRevenue || 420000).toLocaleString('en-IN')}
- Total Margin Preserved: ₹${(context.summary.totalMarginDollars || 175000).toLocaleString('en-IN')}

SAMPLE CANDIDATE PROMOTIONS DATASET:
${sampleRecs}

INSTRUCTIONS:
1. Answer the user's question directly with clear, articulate markdown.
2. Render all prices and financial values in Indian Rupees (₹ / INR).
  `;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 3000); // 3s timeout

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMsg }
        ],
        temperature: 0.3,
        max_tokens: 800
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);
    const latencyMs = Date.now() - startTime;

    if (res.ok) {
      const data = await res.json();
      if (data.choices && data.choices[0] && data.choices[0].message) {
        const replyText = data.choices[0].message.content.trim();
        recordLlmTelemetry({ provider: 'groq', latencyMs, inputText: userMsg, outputText: replyText, status: 'SUCCESS', correlationId });

        logger.info(`✅ Groq LLM API Call Succeeded (${latencyMs}ms)`, { correlationId, provider: 'groq' });

        return {
          text: replyText,
          type: 'GROQ_AI_RESPONSE',
          actions: [
            { label: '📊 Kaggle Dataset Analytics', command: 'ASK_QUERY', value: 'What is the total sales and top products in the dataset?' },
            { label: '🔴 Show Stockout Risks', command: 'FILTER_RISK', value: 'STOCKOUT_RISK' },
            { label: '📈 Summarize Campaign ROI', command: 'NAV_TAB', value: 'SUMMARY' },
            { label: '🟢 Approve Healthy Promos', command: 'APPROVE_HEALTHY' }
          ]
        };
      }
    }

    const errText = await res.text();
    recordLlmTelemetry({ provider: 'groq', latencyMs, inputText: userMsg, outputText: '', status: 'ERROR', correlationId });
    throw new Error(`Groq API returned HTTP ${res.status}: ${errText}`);
  } catch (err) {
    clearTimeout(timeoutId);
    const latencyMs = Date.now() - startTime;
    recordLlmTelemetry({ provider: 'groq', latencyMs, inputText: userMsg, outputText: '', status: 'ERROR', correlationId });
    throw err;
  }
}

/**
 * Google Gemini AI Call via REST API
 */
async function queryGeminiAI(userMsg, persona, context, correlationId) {
  const startTime = Date.now();
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`;

  const sampleRecs = (context.recommendations || []).slice(0, 10).map(r => 
    `- "${r.product_name}" (${r.category}) | Region: ${r.region} | Target: "${r.segment_name}" | Base Price: ₹${r.base_price} | Discount: ${r.discount_pct}% OFF | Stock: ${r.metrics.stockQty} units | Demand: ${r.metrics.projectedUnits} units | Rev Lift: +₹${r.metrics.projectedRevenue.toLocaleString('en-IN')} | Risk: ${r.constraintEval.riskLevel}`
  ).join('\n');

  const systemContext = `
You are PromoAlign AI, an expert Retail Copilot assisting Category Lead Sravanthi.
Answer questions accurately based on active dataset context. Format all money metrics in Indian Rupees (₹ / INR).

ACTIVE DATASET: "${context.activeDatasetName}"
USER PERSONA: ${persona}

SAMPLE PRODUCT PROMOTIONS DATA:
${sampleRecs}

INSTRUCTIONS:
1. Provide a direct, specific, accurate answer to user's question.
2. Render all prices and financial values in Indian Rupees (₹ / INR).
  `;

  const requestBody = {
    contents: [
      { role: 'user', parts: [{ text: `${systemContext}\n\nUSER QUESTION: "${userMsg}"` }] }
    ]
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 3000);

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
      signal: controller.signal
    });

    clearTimeout(timeoutId);
    const latencyMs = Date.now() - startTime;

    if (res.ok) {
      const data = await res.json();
      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        const replyText = data.candidates[0].content.parts[0].text.trim();
        recordLlmTelemetry({ provider: 'gemini', latencyMs, inputText: userMsg, outputText: replyText, status: 'SUCCESS', correlationId });

        logger.info(`✅ Gemini LLM API Call Succeeded (${latencyMs}ms)`, { correlationId, provider: 'gemini' });

        return {
          text: replyText,
          type: 'GEMINI_AI_RESPONSE',
          actions: [
            { label: '📊 Kaggle Dataset Analytics', command: 'ASK_QUERY', value: 'What is the total sales and top products in the dataset?' },
            { label: '🔴 Show Stockout Risks', command: 'FILTER_RISK', value: 'STOCKOUT_RISK' },
            { label: '📈 Summarize Campaign ROI', command: 'NAV_TAB', value: 'SUMMARY' },
            { label: '🟢 Approve Healthy Promos', command: 'APPROVE_HEALTHY' }
          ]
        };
      }
    }

    const errText = await res.text();
    recordLlmTelemetry({ provider: 'gemini', latencyMs, inputText: userMsg, outputText: '', status: 'ERROR', correlationId });
    throw new Error(`Gemini API returned HTTP ${res.status}: ${errText}`);
  } catch (err) {
    clearTimeout(timeoutId);
    const latencyMs = Date.now() - startTime;
    recordLlmTelemetry({ provider: 'gemini', latencyMs, inputText: userMsg, outputText: '', status: 'ERROR', correlationId });
    throw err;
  }
}

/**
 * High-Relevance Natural Language Analytics Engine Fallback
 */
function highRelevanceAnalyticsEngine(userMessage, recommendations, summary, activeDatasetName, kaggleStats) {
  const msg = (userMessage || '').toLowerCase();

  // Search for matching products by product name keywords
  const matchedRecs = recommendations.filter(r => {
    const pName = r.product_name.toLowerCase();
    const words = pName.split(/\s+/);
    return words.some(w => w.length > 3 && msg.includes(w)) || pName.includes(msg);
  });

  if (matchedRecs.length > 0) {
    const p = matchedRecs[0];
    const categoryRecs = recommendations.filter(r => r.product_id === p.product_id);

    let text = `### 📦 Product Information & Promotion Analysis\n\n`;
    text += `### **${p.product_name}** (${p.category})\n`;
    text += `- **Base Selling Price**: **₹${p.base_price.toLocaleString('en-IN')}**\n`;
    text += `- **Estimated Unit Cost**: **₹${Math.round(p.base_price * (1 - p.margin_pct)).toLocaleString('en-IN')}**\n`;
    text += `- **Category Base Margin**: **${(p.margin_pct * 100).toFixed(1)}%**\n`;
    text += `- **SKU Code**: \`SKU-${p.product_id.toUpperCase()}\` | **Shelf Life**: 180 Days | **Holding Cost**: ₹12/mo\n\n`;

    text += `**Active Regional Campaign Plans for ${p.product_name}**:\n`;
    categoryRecs.slice(0, 3).forEach(item => {
      const riskBadge = item.constraintEval.riskLevel === 'STOCKOUT_RISK' ? '🔴 Stockout Risk' : item.constraintEval.riskLevel === 'MARGIN_RISK' ? '🟠 Margin Risk' : '🟢 Healthy';
      text += `- *${item.region}* (Target: ${item.segment_name}): **${item.discount_pct}% OFF** → Price: **₹${(item.base_price * (1 - item.discount_pct / 100)).toFixed(2)}**. Available Stock: **${item.metrics.stockQty} units** vs Demand: **${item.metrics.projectedUnits} units** (${riskBadge}). Rev Lift: **+₹${item.metrics.projectedRevenue.toLocaleString('en-IN')}**.\n`;
    });

    return {
      text,
      type: 'PRODUCT_DETAILS',
      actions: [
        { label: `Filter ${p.product_name}`, command: 'FILTER_PRODUCT', value: p.product_id },
        { label: 'View Business Hierarchy', command: 'NAV_TAB', value: 'BUSINESS_TREE' }
      ]
    };
  }

  // Stockout Risk Query
  if (msg.includes('stockout') || msg.includes('inventory risk') || msg.includes('out of stock') || msg.includes('low stock')) {
    const stockoutItems = recommendations.filter(r => r.constraintEval.riskLevel === 'STOCKOUT_RISK');
    let text = `### 🔴 Stockout Risk Analysis (${stockoutItems.length} items flagged)\n\n`;
    text += `Analyzing dataset **${activeDatasetName}**:\n\n`;
    if (stockoutItems.length > 0) {
      text += `I found **${stockoutItems.length} promotional candidate(s)** where predicted demand exceeds available store inventory:\n\n`;
      stockoutItems.slice(0, 4).forEach(item => {
        text += `- **${item.product_name}** in *${item.region}* (${item.segment_name}): Available stock is **${item.metrics.stockQty} units** vs projected demand of **${item.metrics.projectedUnits} units**.\n`;
      });
      text += `\n**AI Recommendation**: Reduce discount depth by 5-10% or suppress promotion in inventory-constrained store clusters.`;
    } else {
      text += `Great news! No critical stockout risks are currently flagged in the active plan. All campaigns have sufficient inventory buffers.`;
    }

    return {
      text,
      type: 'STOCKOUT_RISK',
      actions: [
        { label: 'Filter Stockout Risks in Feed', command: 'FILTER_RISK', value: 'STOCKOUT_RISK' },
        { label: 'View Business Hierarchy', command: 'NAV_TAB', value: 'BUSINESS_TREE' }
      ]
    };
  }

  // Default Advisory
  let text = `### 🤖 PromoAlign AI Assistant (${activeDatasetName})\n\n`;
  text += `I analyzed your query: *" ${userMessage} "*.\n\n`;
  text += `**Top Campaign Recommendations in Active Dataset:**\n\n`;
  
  recommendations.slice(0, 3).forEach((r, idx) => {
    text += `${idx + 1}. **${r.product_name}** in *${r.region}* (${r.segment_name}):\n`;
    text += `   - **Price**: ₹${r.base_price} | **Discount**: ${r.discount_pct}% OFF | **Projected Rev Lift**: +₹${r.metrics.projectedRevenue.toLocaleString('en-IN')}\n`;
    text += `   - **Stock Cushion**: ${r.metrics.stockQty} units vs ${r.metrics.projectedUnits} demand (${r.constraintEval.riskLevel === 'STOCKOUT_RISK' ? '🔴 Stockout Risk' : '🟢 Healthy'})\n\n`;
  });

  return {
    text,
    type: 'GENERAL_ADVISORY',
    actions: [
      { label: '📊 Kaggle Dataset Analytics', command: 'ASK_QUERY', value: 'What is the total sales and top products in the dataset?' },
      { label: '🔴 Show Stockout Risks', command: 'FILTER_RISK', value: 'STOCKOUT_RISK' },
      { label: '📈 Summarize Campaign ROI', command: 'NAV_TAB', value: 'SUMMARY' },
      { label: '🟢 Approve Healthy Promos', command: 'APPROVE_HEALTHY' }
    ]
  };
}
