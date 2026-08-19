/**
 * PromoAlign AI Chatbot Engine
 * Context-aware retail advisory, stockout/margin Q&A, and live UI command execution.
 */

export function processChatMessage(userMessage, persona = 'MARKETING', appState = {}) {
  const msg = (userMessage || '').trim().toLowerCase();
  const recommendations = appState.recommendations || [];
  const summary = appState.summary || {};
  const activeDatasetName = appState.datasetName || 'Retail Dataset';

  // 1. Stockout & Inventory Risk Query Intent
  if (msg.includes('stockout') || msg.includes('inventory risk') || msg.includes('out of stock') || msg.includes('low stock')) {
    const stockoutItems = recommendations.filter(r => r.constraintEval.riskLevel === 'STOCKOUT_RISK');
    
    let text = `### 🔴 Stockout Risk Analysis (${stockoutItems.length} items flagged)\n\n`;
    if (stockoutItems.length > 0) {
      text += `I found **${stockoutItems.length} promotional candidate(s)** where predicted demand exceeds available store inventory:\n\n`;
      stockoutItems.slice(0, 3).forEach(item => {
        text += `- **${item.product_name}** in *${item.region}* (Target: ${item.segment_name}): Available stock is **${item.metrics.stockQty} units** vs projected demand of **${item.metrics.projectedUnits} units**.\n`;
      });
      text += `\n**AI Recommendation**: Reduce discount depth by 5-10% or suppress promotion in inventory-constrained store clusters to avoid fulfillment failure.`;
    } else {
      text += `Great news! No critical stockout risks are currently flagged in the active plan. All campaigns have sufficient inventory buffers.`;
    }

    return {
      text,
      type: 'STOCKOUT_RISK',
      actions: [
        { label: 'Filter Stockout Risks in Feed', command: 'FILTER_RISK', value: 'STOCKOUT_RISK' },
        { label: 'View Regional Inventory Heatmap', command: 'NAV_TAB', value: 'HEATMAP' }
      ]
    };
  }

  // 2. Margin Erosion / Profitability Query Intent
  if (msg.includes('margin') || msg.includes('profit') || msg.includes('discount depth') || msg.includes('erosion')) {
    const marginItems = recommendations.filter(r => r.constraintEval.riskLevel === 'MARGIN_RISK');

    let text = `### 🟠 Margin Floor & Profitability Analysis\n\n`;
    text += `The active campaign plan maintains an average post-discount margin of **${summary.avgMarginPct || 41.5}%**, preserving **$${(summary.totalMarginDollars || 0).toLocaleString()}** in margin dollars.\n\n`;
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

  // 3. Campaign ROI & Revenue Summary Query Intent
  if (msg.includes('summary') || msg.includes('roi') || msg.includes('revenue') || msg.includes('readiness') || msg.includes('kpi')) {
    let text = `### 📊 Campaign Readiness & Business Impact Summary\n\n`;
    text += `- **Dataset Source**: ${activeDatasetName}\n`;
    text += `- **Projected Incremental Revenue Lift**: **+$${(summary.totalIncrementalRevenue || 0).toLocaleString()}**\n`;
    text += `- **Total Margin Dollars Preserved**: **$${(summary.totalMarginDollars || 0).toLocaleString()}** (Avg Margin: **${summary.avgMarginPct || 0}%**)\n`;
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

  // 4. One-Click Approval / Action Intent
  if (msg.includes('approve') || msg.includes('one-click') || msg.includes('sign-off')) {
    const healthyCount = recommendations.filter(r => r.constraintEval.riskLevel === 'HEALTHY' && r.status === 'DRAFT').length;

    let text = `### 🟢 Action Triggered: One-Click Approval\n\n`;
    if (healthyCount > 0) {
      text += `I can automatically approve **${healthyCount} healthy, zero-risk draft promotion(s)** that have confirmed stock cushions and high margin retention.`;
    } else {
      text += `All zero-risk healthy promotions have already been approved or reviewed.`;
    }

    return {
      text,
      type: 'APPROVE_ACTION',
      actions: healthyCount > 0 ? [{ label: `Approve ${healthyCount} Healthy Promos Now`, command: 'APPROVE_HEALTHY' }] : []
    };
  }

  // 5. Region / Category Query Intent
  if (msg.includes('north') || msg.includes('south') || msg.includes('east') || msg.includes('west') || msg.includes('central')) {
    const matchedRegion = ['North Region', 'South Region', 'East Region', 'West Region', 'Central Region'].find(
      r => msg.includes(r.toLowerCase()) || msg.includes(r.split(' ')[0].toLowerCase())
    ) || 'North Region';

    const regionItems = recommendations.filter(r => r.region === matchedRegion);

    let text = `### 📍 Regional Overview: ${matchedRegion}\n\n`;
    text += `Found **${regionItems.length} candidate promotion(s)** targeting ${matchedRegion}:\n\n`;
    regionItems.slice(0, 3).forEach(item => {
      text += `- **${item.product_name}** (${item.discount_pct}% OFF) for *${item.segment_name}* — Fit Score: **${item.metrics.fitScore}** (${item.constraintEval.riskLevel})\n`;
    });

    return {
      text,
      type: 'REGIONAL_QUERY',
      actions: [
        { label: `Filter Feed by ${matchedRegion}`, command: 'FILTER_REGION', value: matchedRegion }
      ]
    };
  }

  // 6. Default AI Advisory Response
  let text = `### 🤖 PromoAlign AI Assistant\n\n`;
  text += `Hello! I am your AI Retail Copilot for **PromoAlign**. I analyze customer segment affinities, regional demand signals, inventory stock levels, and margin floors to optimize campaign profitability.\n\n`;
  text += `**How I can help you:**\n`;
  text += `- Ask *"Which promos have stockout risk?"*\n`;
  text += `- Ask *"What is our projected campaign revenue lift?"*\n`;
  text += `- Ask *"Show me margin risks"* or *"Filter by North region"*\n`;
  text += `- Say *"Approve all healthy promotions"*\n`;

  return {
    text,
    type: 'GENERAL_ADVISORY',
    actions: [
      { label: '🔴 Show Stockout Risks', command: 'FILTER_RISK', value: 'STOCKOUT_RISK' },
      { label: '📈 Summarize Campaign ROI', command: 'NAV_TAB', value: 'SUMMARY' },
      { label: '⚡ Top Fit Score Promos', command: 'FILTER_MIN_SCORE', value: 75 },
      { label: '🟢 Approve Healthy Promos', command: 'APPROVE_HEALTHY' }
    ]
  };
}
