/**
 * PromoAlign Constraint Engine
 * Evaluates business constraints: stock thresholds, margin floors, and promo fatigue.
 */

export const MARGIN_FLOOR_PCT = 0.15; // 15% minimum margin required
export const PROMO_COOLDOWN_DAYS = 14;  // 14 days segment promo fatigue cooldown

export function evaluateConstraints(segment, product, metrics) {
  const flags = [];
  let riskLevel = 'HEALTHY'; // 'HEALTHY', 'TIGHT_STOCK', 'STOCKOUT_RISK', 'MARGIN_RISK', 'FATIGUE_WARNING'

  // 1. Stockout Risk Check
  if (metrics.stockQty < metrics.projectedUnits) {
    riskLevel = 'STOCKOUT_RISK';
    flags.push({
      type: 'STOCKOUT_RISK',
      badge: '🔴 Stockout Risk',
      severity: 'HIGH',
      message: `Critical stockout risk: Available inventory (${metrics.stockQty} units) is less than projected promotional demand (${metrics.projectedUnits} units).`,
      suggestedAction: `Reduce discount depth or suppress campaign in ${metrics.signals ? 'this region' : 'region'}.`
    });
  } else if (metrics.inventoryHealthRatio < 1.25) {
    if (riskLevel === 'HEALTHY') riskLevel = 'TIGHT_STOCK';
    flags.push({
      type: 'TIGHT_STOCK',
      badge: '🟡 Tight Stock',
      severity: 'MEDIUM',
      message: `Tight inventory buffers: ${metrics.daysOfSupply} days of supply remaining after campaign launch.`,
      suggestedAction: 'Monitor store replenishments closely.'
    });
  }

  // 2. Margin Floor Check
  if (metrics.marginPctAfterDiscount < MARGIN_FLOOR_PCT) {
    riskLevel = 'MARGIN_RISK';
    flags.push({
      type: 'MARGIN_RISK',
      badge: '🟠 Margin Risk',
      severity: 'HIGH',
      message: `Margin erosion warning: Post-discount margin (${(metrics.marginPctAfterDiscount * 100).toFixed(1)}%) drops below the ${MARGIN_FLOOR_PCT * 100}% threshold.`,
      suggestedAction: 'Lower discount % by 5-10% to protect category profitability.'
    });
  }

  // 3. Promo Fatigue Check
  if (segment.last_promo_days_ago < PROMO_COOLDOWN_DAYS) {
    if (riskLevel === 'HEALTHY') riskLevel = 'FATIGUE_WARNING';
    flags.push({
      type: 'FATIGUE_WARNING',
      badge: '🟡 Promo Fatigue',
      severity: 'MEDIUM',
      message: `Audience fatigue alert: Segment '${segment.segment_name}' was promoted ${segment.last_promo_days_ago} days ago (recommended cooldown: ${PROMO_COOLDOWN_DAYS} days).`,
      suggestedAction: 'Target an alternative segment or extend launch date by 7 days.'
    });
  }

  // If no negative flags, assign Healthy
  if (flags.length === 0) {
    flags.push({
      type: 'HEALTHY',
      badge: '🟢 Healthy Stock',
      severity: 'LOW',
      message: 'Optimal inventory health and strong margin retention confirmed.',
      suggestedAction: 'Ready for one-click approval.'
    });
  }

  return {
    riskLevel,
    flags,
    isApprovedFeasible: riskLevel === 'HEALTHY' || riskLevel === 'TIGHT_STOCK'
  };
}
