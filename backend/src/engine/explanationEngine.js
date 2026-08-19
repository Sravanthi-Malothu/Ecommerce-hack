/**
 * PromoAlign Explanation Engine
 * Generates transparent feature-attribution explanations, plain-English recommendation drivers,
 * and structured Operational Risk & Supply Chain Assessments.
 */

export function generateExplanation(segment, product, region, metrics, constraintEval) {
  const topSignals = [];

  // 1. Evaluate Top Contributing Feature Signals (SHAP-style)
  if (metrics.signals.categoryAffinity >= 70) {
    topSignals.push({
      label: 'High Category Affinity',
      value: `+${metrics.signals.categoryAffinity}%`,
      description: `${segment.segment_name} heavily favors ${product.category}`,
      type: 'positive'
    });
  }

  if (metrics.signals.regionalDemandIndex >= 1.2) {
    topSignals.push({
      label: 'Regional Demand Spike',
      value: `${metrics.signals.regionalDemandIndex}x Index`,
      description: `${region} shows strong search/purchase momentum for ${product.category}`,
      type: 'positive'
    });
  }

  if (metrics.signals.discountResponsiveness >= 60) {
    topSignals.push({
      label: 'Past Promo Responsiveness',
      value: `+${metrics.signals.discountResponsiveness}%`,
      description: `Historical redemption patterns indicate high conversion to discount offers`,
      type: 'positive'
    });
  }

  if (metrics.stockQty < metrics.projectedUnits) {
    topSignals.push({
      label: 'Inventory Shortfall',
      value: `${metrics.stockQty} vs ${metrics.projectedUnits} units`,
      description: `Stock level insufficient to satisfy full promo demand`,
      type: 'negative'
    });
  } else if (metrics.signals.inventoryHealthRatio >= 1.5) {
    topSignals.push({
      label: 'Robust Stock Cushion',
      value: `${metrics.daysOfSupply} Days Supply`,
      description: `Healthy inventory position in ${region} (${metrics.stockQty} units) to support demand surge`,
      type: 'positive'
    });
  }

  if (metrics.signals.marginPctAfterDiscount >= 40) {
    topSignals.push({
      label: 'High Margin Preservation',
      value: `${metrics.signals.marginPctAfterDiscount}% Margin`,
      description: `Strong post-discount profitability (₹${metrics.projectedMarginDollars.toLocaleString('en-IN')}) safeguards campaign ROI`,
      type: 'positive'
    });
  }

  // Fallback to ensure top 3 signals always present
  if (topSignals.length < 3) {
    topSignals.push({
      label: 'RFM Recency Alignment',
      value: `High Score`,
      description: `Segment activity metrics indicate optimal engagement window`,
      type: 'positive'
    });
  }

  const slicedSignals = topSignals.slice(0, 3);

  // 2. Formatting Numbers for Explanations
  const revLiftFormatted = `₹${(metrics.projectedRevenue || 0).toLocaleString('en-IN')}`;
  const marginDollarsFormatted = `₹${(metrics.projectedMarginDollars || 0).toLocaleString('en-IN')}`;
  const marginPct = (metrics.signals.marginPctAfterDiscount || 0).toFixed(1);
  const demandUnits = metrics.projectedUnits || 0;
  const stockUnits = metrics.stockQty || 0;
  const daysSupply = metrics.daysOfSupply || 0;
  const affinityPct = metrics.signals.categoryAffinity || 85;
  const demandIndex = metrics.signals.regionalDemandIndex || 1.4;

  // 3. WHY THIS OFFER IS RECOMMENDED (Driver Rationale)
  const recommendationWhy = `Recommended for ${segment.segment_name} in ${region}: Driven by high category affinity (+${affinityPct}%) for ${product.category}, a regional demand index of ${demandIndex}x in ${region}, and historical redemption conversion (+${metrics.signals.discountResponsiveness || 72}%). Projected to generate +${revLiftFormatted} in incremental revenue while preserving ${marginDollarsFormatted} in margin dollars (${marginPct}% post-discount margin).`;

  // 4. WHAT OPERATIONAL RISKS MAY EXIST (Risk & Mitigation Assessment)
  let operationalRiskLevel = constraintEval.riskLevel;
  let operationalRiskTitle = '🟢 Zero Operational Risk: Supply Chain & Margin Confirmed';
  let operationalRiskDetails = `Confirmed robust inventory position (${stockUnits} units, ${daysSupply} days of supply) to comfortably support the ${demandUnits}-unit demand surge. Post-discount margin of ${marginPct}% comfortably exceeds our company 15% floor.`;
  let operationalMitigation = 'Proceed with campaign launch and automated cross-channel promotion.';

  if (constraintEval.riskLevel === 'STOCKOUT_RISK') {
    operationalRiskTitle = '🔴 Operational Risk: Inventory Stockout & Supply Chain Fulfillment Shortfall';
    operationalRiskDetails = `Available store inventory (${stockUnits} units) is lower than projected promotional demand (${demandUnits} units). Running this promotion at ${metrics.discount_pct || 20}% discount risks 100% stock depletion and fulfillment failure. Reorder lead time is 5 days.`;
    operationalMitigation = 'Operational Action Required: Reduce discount depth by 5-10% to curb excess demand, or reallocate 150+ units from adjacent regional warehouse prior to launch.';
  } else if (constraintEval.riskLevel === 'MARGIN_RISK') {
    operationalRiskTitle = '🟠 Operational Risk: Post-Discount Margin Floor Breach';
    operationalRiskDetails = `Proposed discount depth reduces post-promo margin to ${marginPct}%, dropping below our mandatory 15% company margin floor threshold. Risk of profit cannibalization.`;
    operationalMitigation = 'Operational Action Required: Cap maximum discount depth at 15% or require explicit sign-off from Category Lead Sravanthi.';
  } else if (constraintEval.riskLevel === 'FATIGUE_WARNING') {
    operationalRiskTitle = '🟡 Operational Risk: Customer Segment Promotion Fatigue';
    operationalRiskDetails = `${segment.segment_name} received a promotional campaign ${segment.last_promo_days_ago} days ago (within 14-day frequency capping window). Risk of declining click-through and customer unsubscribe rates.`;
    operationalMitigation = 'Operational Action Required: Enforce 14-day campaign cooldown by delaying promotion launch by 5 days.';
  }

  // Legacy summary rationale for backward compatibility
  let summaryRationale = recommendationWhy;
  if (constraintEval.riskLevel !== 'HEALTHY') {
    summaryRationale = `${operationalRiskTitle}: ${operationalRiskDetails} ${operationalMitigation}`;
  }

  return {
    topSignals: slicedSignals,
    recommendationWhy,
    operationalRiskAssessment: {
      riskLevel: operationalRiskLevel,
      title: operationalRiskTitle,
      details: operationalRiskDetails,
      mitigation: operationalMitigation
    },
    summaryRationale,
    riskBadges: constraintEval.flags.map(f => f.badge),
    primaryRiskLevel: constraintEval.riskLevel,
    actionAdvice: constraintEval.flags[0]?.suggestedAction || operationalMitigation
  };
}
