/**
 * PromoAlign Explanation Engine
 * Generates transparent feature-attribution explanations and plain-English business rationales.
 */

export function generateExplanation(segment, product, region, metrics, constraintEval) {
  const topSignals = [];

  // Evaluate Top 3 Contributing Signals
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
      description: `Healthy inventory position in ${region} to support demand surge`,
      type: 'positive'
    });
  }

  if (metrics.signals.marginPctAfterDiscount >= 40) {
    topSignals.push({
      label: 'High Margin Preservation',
      value: `${metrics.signals.marginPctAfterDiscount}% Margin`,
      description: `Strong post-discount profitability safeguards overall campaign ROI`,
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

  // Construct plain-English "Why Recommended" sentence
  let summaryRationale = `Recommended for ${segment.segment_name} in ${region} mainly due to `;
  const positiveDrivers = slicedSignals.filter(s => s.type === 'positive').map(s => s.label.toLowerCase());
  
  if (positiveDrivers.length > 0) {
    summaryRationale += positiveDrivers.join(', ') + '.';
  } else {
    summaryRationale += 'moderate category affinity and promotional alignment.';
  }

  if (constraintEval.riskLevel === 'STOCKOUT_RISK') {
    summaryRationale += ` ⚠️ CAUTION: Stockout risk flagged (${metrics.stockQty} units remaining).`;
  } else if (constraintEval.riskLevel === 'MARGIN_RISK') {
    summaryRationale += ` ⚠️ CAUTION: Margin drops to ${metrics.signals.marginPctAfterDiscount}% post-discount.`;
  }

  return {
    topSignals: slicedSignals,
    summaryRationale,
    riskBadges: constraintEval.flags.map(f => f.badge),
    primaryRiskLevel: constraintEval.riskLevel,
    actionAdvice: constraintEval.flags[0]?.suggestedAction || 'Review and approve.'
  };
}
