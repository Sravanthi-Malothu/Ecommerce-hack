import dotenv from 'dotenv';
dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

/**
 * PromoAlign AI Chatbot Engine
 * Powered by Google Gemini AI with Live Dataset Context & Local Fallback.
 */
export async function processChatMessage(userMessage, persona = 'MARKETING', appState = {}) {
  const msg = (userMessage || '').trim();
  const recommendations = appState.recommendations || [];
  const summary = appState.summary || {};
  const activeDatasetName = appState.datasetName || 'PromoAlign Core Retail Dataset';
  const kaggleStats = appState.kaggleStats || null;

  // Attempt Live Gemini LLM Generation (with 4s timeout)
  try {
    const geminiReply = await queryGeminiAI(msg, persona, {
      activeDatasetName,
      recommendationsCount: recommendations.length,
      stockoutCount: recommendations.filter(r => r.constraintEval.riskLevel === 'STOCKOUT_RISK').length,
      marginRiskCount: recommendations.filter(r => r.constraintEval.riskLevel === 'MARGIN_RISK').length,
      healthyCount: recommendations.filter(r => r.constraintEval.riskLevel === 'HEALTHY' && r.status === 'DRAFT').length,
      totalRevLift: summary.totalIncrementalRevenue || 420000,
      totalMarginPreserved: summary.totalMarginDollars || 175000,
      avgMarginPct: summary.avgMarginPct || 41.5,
      kaggleStats
    });

    if (geminiReply) {
      return geminiReply;
    }
  } catch (err) {
    console.warn('⚠️ Gemini AI network query failed/timed out, executing fallback engine:', err.message);
  }

  // Fallback Engine (Deterministic Analytics)
  return fallbackAnalyticsEngine(msg, recommendations, summary, activeDatasetName, kaggleStats);
}

/**
 * Live Google Gemini AI Call via REST API with Timeout
 */
async function queryGeminiAI(userMsg, persona, context) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${GEMINI_API_KEY}`;
  const fallbackUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

  const systemContext = `
You are the PromoAlign AI Retail Copilot & Promotion Strategy Assistant.
You are helping user Sravanthi (Admin / Category Lead) optimize retail promotion planning, inventory alignment, and profit margins.

CURRENT APP STATE & CONTEXT:
- Active Dataset: "${context.activeDatasetName}"
- User Role / Persona: ${persona} (Category Lead)
- All Prices & Financial Metrics: Indian Rupees (₹ / INR)
- Total Promotional Candidates Analyzed: ${context.recommendationsCount} items
- Flagged Stockout Risks: ${context.stockoutCount} candidates (Demand > Inventory)
- Flagged Margin Floor Breaches: ${context.marginRiskCount} candidates (<15% Post-Discount Margin)
- Healthy Zero-Risk Draft Promos: ${context.healthyCount} items ready for one-click approval
- Projected Campaign Revenue Lift: +₹${context.totalRevLift.toLocaleString('en-IN')}
- Total Margin Preserved: ₹${context.totalMarginPreserved.toLocaleString('en-IN')} (Avg Margin: ${context.avgMarginPct}%)

7-BRANCH BUSINESS ARCHITECTURE PARAMETERS AVAILABLE:
1. Commerce Type: Omnichannel B2C E-Commerce & Regional Store Network (5 Regions: North, South, East, West, Central)
2. Customer Segments: Urban Fitness Enthusiasts, Bargain Hunters, High-Value VIP Loyalists, Tech & Trendsetters, Seasonal Home Organizers
3. Product Specs: SKU, Cost, Price, Margin, Stock, Shelf Life (180/365 Days), Seasonality, Substitutability
4. Customer Behaviour: Purchase Frequency, Avg Basket (₹3,450), Recency, Price Sensitivity (0.25 VIP to 0.92 Bargain)
5. Demand Drivers: Historical Sales, Seasonality, Events (Diwali Festival Sale), Trends (+18.5% Search), Weather Factors
6. Inventory Control: Current Stock, Incoming Stock (+250 units), Safety Stock Floor (80 units), Lead Time (3-7 Days), Expiry, Holding Cost (₹12/mo)
7. Promotions: Discount (10%-25% OFF), Bundle (+68.4% attachment), Coupon Codes (COFFEE20, APEXRUN15, BOTANICAL20), Personalized Perks, Clearance

INSTRUCTIONS FOR AI RESPONSE:
1. Answer the user's question directly using clear, articulate business markdown.
2. Render all prices and monetary values in Indian Rupees (₹ / INR).
3. Be professional, concise, and highlight actionable insights for Marketing, Merchandising, and Store Ops.
  `;

  const requestBody = {
    contents: [
      {
        role: 'user',
        parts: [
          { text: `${systemContext}\n\nUSER QUESTION: "${userMsg}"` }
        ]
      }
    ]
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 3500);

  try {
    let res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      const controller2 = new AbortController();
      const timeoutId2 = setTimeout(() => controller2.abort(), 3500);
      res = await fetch(fallbackUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
        signal: controller2.signal
      });
      clearTimeout(timeoutId2);
    }

    if (res.ok) {
      const data = await res.json();
      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        const replyText = data.candidates[0].content.parts[0].text.trim();

        const lower = userMsg.toLowerCase();
        let actions = [
          { label: '📊 Kaggle Dataset Analytics', command: 'ASK_QUERY', value: 'What is the total sales and top products in the dataset?' },
          { label: '🔴 Show Stockout Risks', command: 'FILTER_RISK', value: 'STOCKOUT_RISK' },
          { label: '📈 Summarize Campaign ROI', command: 'NAV_TAB', value: 'SUMMARY' },
          { label: '🟢 Approve Healthy Promos', command: 'APPROVE_HEALTHY' }
        ];

        if (lower.includes('stockout') || lower.includes('inventory')) {
          actions = [
            { label: 'Filter Stockout Risks in Feed', command: 'FILTER_RISK', value: 'STOCKOUT_RISK' },
            { label: 'View Business Hierarchy', command: 'NAV_TAB', value: 'BUSINESS_TREE' }
          ];
        } else if (lower.includes('approve') || lower.includes('healthy')) {
          actions = [
            { label: `Approve ${context.healthyCount} Healthy Promos Now`, command: 'APPROVE_HEALTHY' }
          ];
        }

        return {
          text: replyText,
          type: 'GEMINI_AI_RESPONSE',
          actions
        };
      }
    }
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }

  return null;
}

/**
 * Fallback Analytics Engine
 */
function fallbackAnalyticsEngine(userMessage, recommendations, summary, activeDatasetName, kaggleStats) {
  const msg = (userMessage || '').toLowerCase();

  // Stockout Risk Intent
  if (msg.includes('stockout') || msg.includes('inventory risk') || msg.includes('out of stock') || msg.includes('low stock')) {
    const stockoutItems = recommendations.filter(r => r.constraintEval.riskLevel === 'STOCKOUT_RISK');
    let text = `### 🔴 Stockout Risk Analysis (${stockoutItems.length} items flagged)\n\n`;
    text += `Analyzing dataset **${activeDatasetName}**:\n\n`;
    if (stockoutItems.length > 0) {
      text += `I found **${stockoutItems.length} promotional candidate(s)** where predicted demand exceeds available store inventory:\n\n`;
      stockoutItems.slice(0, 3).forEach(item => {
        text += `- **${item.product_name}** in *${item.region}* (Target: ${item.segment_name}): Available stock is **${item.metrics.stockQty} units** vs projected demand of **${item.metrics.projectedUnits} units**.\n`;
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

  // General Advisory
  let text = `### 🤖 PromoAlign AI Assistant (${activeDatasetName})\n\n`;
  text += `Hello Sravanthi! I am your Gemini-powered AI Retail Copilot for **PromoAlign**. I analyze real Kaggle dataset values, customer segment affinities, regional demand signals, inventory stock levels, and margin floors.\n\n`;
  text += `**Questions you can ask me:**\n`;
  text += `- *"What is the total sales in Kaggle dataset?"*\n`;
  text += `- *"Show top products in the dataset"* or *"Which country has top sales?"*\n`;
  text += `- *"Which promos have stockout risk?"*\n`;
  text += `- *"What is our projected campaign revenue lift?"*\n`;
  text += `- *"Approve all healthy promotions"*\n`;

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
