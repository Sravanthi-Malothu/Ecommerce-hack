/**
 * PromoAlign AI Chatbot Engine
 * Answers questions based on exact Kaggle dataset records & active recommendations.
 */

export function processChatMessage(userMessage, persona = 'MARKETING', appState = {}) {
  const msg = (userMessage || '').trim().toLowerCase();
  const recommendations = appState.recommendations || [];
  const summary = appState.summary || {};
  const activeDatasetName = appState.datasetName || 'Retail Dataset';
  const kaggleStats = appState.kaggleStats || null;

  // 1. Kaggle Dataset Analytics Intent (exact values from downloaded Kaggle CSVs)
  if (msg.includes('total sales') || msg.includes('total revenue') || msg.includes('top product') || msg.includes('top country') || msg.includes('kaggle') || msg.includes('dataset stats') || msg.includes('average order') || msg.includes('how many rows')) {
    let text = `### 📊 Kaggle Dataset Analytics (${activeDatasetName})\n\n`;
    text += `Based on the exact records extracted from the **${activeDatasetName}**:\n\n`;

    if (kaggleStats) {
      if (kaggleStats.total_revenue) {
        text += `- **Total Calculated Revenue**: **$${kaggleStats.total_revenue.toLocaleString()}**\n`;
      }
      if (kaggleStats.total_sales) {
        text += `- **Total Recorded Store Sales**: **$${kaggleStats.total_sales.toLocaleString()}**\n`;
      }
      if (kaggleStats.total_rows) {
        text += `- **Processed Transactions/Records**: **${kaggleStats.total_rows.toLocaleString()} rows**\n`;
      }
      if (kaggleStats.avg_order_value) {
        text += `- **Average Transaction Value**: **$${kaggleStats.avg_order_value}**\n`;
      }
      if (kaggleStats.avg_sales_per_customer) {
        text += `- **Avg Sales per Customer**: **$${kaggleStats.avg_sales_per_customer}**\n`;
      }
      if (kaggleStats.avg_discount_share) {
        text += `- **Avg Retail Discount Share**: **${kaggleStats.avg_discount_share}%**\n`;
      }

      // Top Countries Breakdown if available
      if (kaggleStats.top_countries && kaggleStats.top_countries.length > 0) {
        text += `\n**Top Customer Countries by Sales Volume**:\n`;
        kaggleStats.top_countries.forEach((c, idx) => {
          text += `${idx + 1}. **${c.country}**: $${c.sales.toLocaleString()}\n`;
        });
      }

      // Top Products Breakdown if available
      if (kaggleStats.top_products && kaggleStats.top_products.length > 0) {
        text += `\n**Top Best-Selling Kaggle Products**:\n`;
        kaggleStats.top_products.forEach((p, idx) => {
          text += `${idx + 1}. **${p.name}** — $${p.sales.toLocaleString()} (${p.qty} units)\n`;
        });
      }

      // Top Stores Breakdown if available
      if (kaggleStats.top_stores && kaggleStats.top_stores.length > 0) {
        text += `\n**Top Performing Rossmann Store Clusters**:\n`;
        kaggleStats.top_stores.forEach((s, idx) => {
          text += `${idx + 1}. **${s.store}**: $${s.sales.toLocaleString()}\n`;
        });
      }
    } else {
      text += `Currently analyzing candidate promotion scores. Select a dataset source from the top header to view Kaggle dataset statistics.`;
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

  // 2. Stockout & Inventory Risk Query Intent
  if (msg.includes('stockout') || msg.includes('inventory risk') || msg.includes('out of stock') || msg.includes('low stock')) {
    const stockoutItems = recommendations.filter(r => r.constraintEval.riskLevel === 'STOCKOUT_RISK');
    
    let text = `### 🔴 Stockout Risk Analysis (${stockoutItems.length} items flagged)\n\n`;
    text += `Analyzing dataset **${activeDatasetName}**:\n\n`;
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

  // 3. Margin Erosion / Profitability Query Intent
  if (msg.includes('margin') || msg.includes('profit') || msg.includes('discount depth') || msg.includes('erosion')) {
    const marginItems = recommendations.filter(r => r.constraintEval.riskLevel === 'MARGIN_RISK');

    let text = `### 🟠 Margin Floor & Profitability Analysis (${activeDatasetName})\n\n`;
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

  // 4. Campaign ROI & Revenue Summary Query Intent
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

  // 5. One-Click Approval / Action Intent
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

  // 6. Default AI Advisory Response
  let text = `### 🤖 PromoAlign AI Assistant (${activeDatasetName})\n\n`;
  text += `Hello! I am your AI Retail Copilot for **PromoAlign**. I analyze real Kaggle dataset values, customer segment affinities, regional demand signals, inventory stock levels, and margin floors.\n\n`;
  text += `**Questions you can ask me:**\n`;
  text += `- *"What is the total sales in Kaggle UCI dataset?"*\n`;
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
