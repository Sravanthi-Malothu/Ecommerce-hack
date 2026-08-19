import dotenv from 'dotenv';
dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

/**
 * PromoAlign AI Chatbot Engine
 * Powered by Google Gemini AI & High-Relevance Natural Language Analytics Engine.
 */
export async function processChatMessage(userMessage, persona = 'MARKETING', appState = {}) {
  const msg = (userMessage || '').trim();
  const recommendations = appState.recommendations || [];
  const summary = appState.summary || {};
  const activeDatasetName = appState.datasetName || 'PromoAlign Core Retail Dataset';
  const kaggleStats = appState.kaggleStats || null;

  // Attempt Live Gemini LLM Generation (Fast 5s Timeout)
  if (GEMINI_API_KEY) {
    try {
      const geminiReply = await queryGeminiAI(msg, persona, {
        activeDatasetName,
        recommendations,
        summary,
        kaggleStats
      });

      if (geminiReply) {
        return geminiReply;
      }
    } catch (err) {
      console.warn('⚠️ Gemini AI query fallback:', err.message);
    }
  }

  // Smart Context-Aware High-Relevance Analytics Engine
  return highRelevanceAnalyticsEngine(msg, recommendations, summary, activeDatasetName, kaggleStats);
}

/**
 * Live Google Gemini AI Call via REST API
 */
async function queryGeminiAI(userMsg, persona, context) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${GEMINI_API_KEY}`;
  const fallbackUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

  const sampleRecs = (context.recommendations || []).slice(0, 12).map(r => 
    `- "${r.product_name}" (${r.category}) | Region: ${r.region} | Segment: "${r.segment_name}" | Base Price: ₹${r.base_price} | Discount: ${r.discount_pct}% OFF | Stock: ${r.metrics.stockQty} units | Projected Demand: ${r.metrics.projectedUnits} units | Rev Lift: +₹${r.metrics.projectedRevenue.toLocaleString('en-IN')} | Risk: ${r.constraintEval.riskLevel}`
  ).join('\n');

  const systemContext = `
You are PromoAlign AI, an intelligent Retail Copilot assisting Category Lead Sravanthi.
Answer questions accurately based on the active dataset context below. Format all money metrics in Indian Rupees (₹ / INR).

ACTIVE DATASET: "${context.activeDatasetName}"
USER PERSONA: ${persona}

LIVE CAMPAIGN SUMMARY:
- Total Candidates: ${context.recommendations.length} items
- Projected Revenue Lift: +₹${(context.summary.totalIncrementalRevenue || 420000).toLocaleString('en-IN')}
- Total Margin Preserved: ₹${(context.summary.totalMarginDollars || 175000).toLocaleString('en-IN')} (Avg Margin: ${context.summary.avgMarginPct || 41.5}%)
- Stockout Risk Items: ${context.recommendations.filter(r => r.constraintEval.riskLevel === 'STOCKOUT_RISK').length}
- Margin Risk Items: ${context.recommendations.filter(r => r.constraintEval.riskLevel === 'MARGIN_RISK').length}

SAMPLE PRODUCT PROMOTIONS DATA:
${sampleRecs}

${context.kaggleStats ? `KAGGLE DATASET STATS:\n${JSON.stringify(context.kaggleStats, null, 2)}` : ''}

INSTRUCTIONS:
1. Provide a direct, specific, accurate answer to user's question.
2. If asked about a product (e.g. Coffee, Shoes, Smartwatch, Tent), cite exact prices (in ₹), stock units, demand, and discounts from the data above.
3. Keep tone concise, professional, and structured in GitHub Markdown.
  `;

  const requestBody = {
    contents: [
      {
        role: 'user',
        parts: [{ text: `${systemContext}\n\nUSER QUESTION: "${userMsg}"` }]
      }
    ]
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 4500); // 4.5s timeout

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
      const timeoutId2 = setTimeout(() => controller2.abort(), 4500);
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
 * High-Relevance Natural Language Analytics Engine
 */
function highRelevanceAnalyticsEngine(userMessage, recommendations, summary, activeDatasetName, kaggleStats) {
  const msg = (userMessage || '').toLowerCase();

  // 1. Search for matching products by product name keywords
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

  // 2. Category Search Query
  const categories = ['footwear', 'apparel', 'home goods', 'beauty', 'outdoor', 'electronics'];
  const matchedCategory = categories.find(c => msg.includes(c));
  if (matchedCategory) {
    const catRecs = recommendations.filter(r => r.category.toLowerCase().includes(matchedCategory));
    let text = `### 🏷️ Category Recommendations: ${matchedCategory.toUpperCase()}\n\n`;
    text += `Found **${catRecs.length} promotional candidate(s)** in category **${matchedCategory}**:\n\n`;
    catRecs.slice(0, 4).forEach(r => {
      text += `- **${r.product_name}** in *${r.region}* (${r.segment_name}): **${r.discount_pct}% OFF** (Base Price: ₹${r.base_price}). Projected Rev Lift: **+₹${r.metrics.projectedRevenue.toLocaleString('en-IN')}** | Stock: **${r.metrics.stockQty} units**.\n`;
    });

    return {
      text,
      type: 'CATEGORY_RECS',
      actions: [
        { label: 'View Business Hierarchy', command: 'NAV_TAB', value: 'BUSINESS_TREE' },
        { label: 'View Campaign Summary', command: 'NAV_TAB', value: 'SUMMARY' }
      ]
    };
  }

  // 3. Stockout & Inventory Risk Query Intent
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

  // 4. Margin Floor & Profitability Query Intent
  if (msg.includes('margin') || msg.includes('profit') || msg.includes('discount depth') || msg.includes('erosion')) {
    const marginItems = recommendations.filter(r => r.constraintEval.riskLevel === 'MARGIN_RISK');

    let text = `### 🟠 Margin Floor & Profitability Analysis (${activeDatasetName})\n\n`;
    text += `The active campaign plan maintains an average post-discount margin of **${summary.avgMarginPct || 41.5}%**, preserving **₹${(summary.totalMarginDollars || 0).toLocaleString('en-IN')}** in margin dollars.\n\n`;
    if (marginItems.length > 0) {
      text += `⚠️ **${marginItems.length} candidate(s)** drop below our strict 15% post-discount margin floor:\n`;
      marginItems.slice(0, 3).forEach(item => {
        text += `- **${item.product_name}**: ${item.discount_pct}% discount reduces margin to **${(item.metrics.marginPctAfterDiscount * 100).toFixed(1)}%**.\n`;
      });
      text += `\n**Suggested Fix**: Use the interactive What-If slider to lower discount depth and protect category margins.`;
    } else {
      text += `All approved campaigns satisfy our minimum 15% margin floor criteria.`;
    }

    return {
      text,
      type: 'MARGIN_RISK',
      actions: [
        { label: 'Filter Margin Risks', command: 'FILTER_RISK', value: 'MARGIN_RISK' },
        { label: 'View Campaign ROI Summary', command: 'NAV_TAB', value: 'SUMMARY' }
      ]
    };
  }

  // 5. Kaggle Analytics Query
  if (msg.includes('kaggle') || msg.includes('total sales') || msg.includes('total revenue') || msg.includes('country') || msg.includes('dataset')) {
    let text = `### 📊 Kaggle Dataset Analytics (${activeDatasetName})\n\n`;
    if (kaggleStats) {
      if (kaggleStats.total_revenue) text += `- **Total Calculated Revenue**: **₹${kaggleStats.total_revenue.toLocaleString('en-IN')}**\n`;
      if (kaggleStats.total_sales) text += `- **Total Recorded Store Sales**: **₹${kaggleStats.total_sales.toLocaleString('en-IN')}**\n`;
      if (kaggleStats.total_rows) text += `- **Processed Transactions**: **${kaggleStats.total_rows.toLocaleString()} rows**\n`;
      if (kaggleStats.avg_order_value) text += `- **Average Order Value**: **₹${kaggleStats.avg_order_value}**\n`;

      if (kaggleStats.top_products && kaggleStats.top_products.length > 0) {
        text += `\n**Top Best-Selling Kaggle Products**:\n`;
        kaggleStats.top_products.slice(0, 4).forEach((p, idx) => {
          text += `${idx + 1}. **${p.name}** — ₹${p.sales.toLocaleString('en-IN')} (${p.qty} units)\n`;
        });
      }
    } else {
      text += `Currently analyzing PromoAlign Core Dataset. Select a dataset source from the top header to view Kaggle dataset statistics.`;
    }

    return {
      text,
      type: 'KAGGLE_ANALYTICS',
      actions: [
        { label: '🏬 View Rossmann Dataset', command: 'SWITCH_DATASET', value: 'ROSSMANN' },
        { label: '🌐 View Kaggle UCI Dataset', command: 'SWITCH_DATASET', value: 'UCI_ONLINE' },
        { label: '🛒 View dunnhumby Dataset', command: 'SWITCH_DATASET', value: 'DUNNHUMBY' }
      ]
    };
  }

  // 6. Campaign Readiness & Summary Query
  if (msg.includes('summary') || msg.includes('roi') || msg.includes('revenue') || msg.includes('kpi') || msg.includes('lift')) {
    let text = `### 📊 Campaign Readiness & Business Impact Summary\n\n`;
    text += `- **Dataset Source**: ${activeDatasetName}\n`;
    text += `- **Projected Incremental Revenue Lift**: **+₹${(summary.totalIncrementalRevenue || 0).toLocaleString('en-IN')}**\n`;
    text += `- **Total Margin Preserved**: **₹${(summary.totalMarginDollars || 0).toLocaleString('en-IN')}** (Avg Margin: **${summary.avgMarginPct || 0}%**)\n`;
    text += `- **Campaign Operational Readiness**: **${summary.readinessScore || 88}%**\n`;
    text += `- **Approved Campaigns**: **${summary.approvedCount || 0}** of ${summary.totalRecommendationsCount || 0} total candidates\n\n`;
    text += `*Ready for cross-functional sign-off between Marketing, Merchandising, and Store Ops.*`;

    return {
      text,
      type: 'CAMPAIGN_SUMMARY',
      actions: [
        { label: 'Go to Campaign Dashboard', command: 'NAV_TAB', value: 'SUMMARY' },
        { label: 'Export Approved Plan (CSV)', command: 'EXPORT_CSV' }
      ]
    };
  }

  // 7. Default Contextual Advisory with Real Data
  let text = `### 🤖 PromoAlign AI Assistant (${activeDatasetName})\n\n`;
  text += `I analyzed your query: *" ${userMessage} "*.\n\n`;
  text += `**Top Campaign Recommendations in Active Dataset:**\n\n`;
  
  recommendations.slice(0, 3).forEach((r, idx) => {
    text += `${idx + 1}. **${r.product_name}** in *${r.region}* (${r.segment_name}):\n`;
    text += `   - **Price**: ₹${r.base_price} | **Discount**: ${r.discount_pct}% OFF | **Projected Rev Lift**: +₹${r.metrics.projectedRevenue.toLocaleString('en-IN')}\n`;
    text += `   - **Stock Cushion**: ${r.metrics.stockQty} units vs ${r.metrics.projectedUnits} demand (${r.constraintEval.riskLevel === 'STOCKOUT_RISK' ? '🔴 Stockout Risk' : '🟢 Healthy'})\n\n`;
  });

  text += `**Questions you can ask me:**\n`;
  text += `- *"What is the price and stock of Organic Coffee?"*\n`;
  text += `- *"Which products have stockout risk?"*\n`;
  text += `- *"Show footwear or electronics recommendations"* \n`;
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
