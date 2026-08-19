/**
 * PromoAlign Scoring Engine
 * Computes feature attribution scores, Promotion Fit Score, and financial projections.
 */

export function calculateCategoryAffinity(segment, product) {
  if (segment.preferred_categories.includes(product.category)) {
    return 0.95;
  }
  if (segment.preferred_categories.includes(product.subcategory)) {
    return 0.70;
  }
  return 0.25;
}

export function getRegionalDemandIndex(demandSignals, region, category) {
  const signal = demandSignals.find(
    (s) => s.region === region && s.product_category === category
  );
  return signal ? signal.demand_index : 1.0;
}

export function getInventoryRecord(inventory, productId, region) {
  return inventory.find((i) => i.product_id === productId && i.region === region) || {
    stock_qty: 100,
    days_of_supply: 20
  };
}

export function computePromotionMetrics(segment, product, region, discountPct, inventoryData, demandSignals) {
  const categoryAffinity = calculateCategoryAffinity(segment, product);
  const demandIndex = getRegionalDemandIndex(demandSignals, region, product.category);
  const invRecord = getInventoryRecord(inventoryData, product.product_id, region);

  // Discount responsiveness factor
  const discountDecimal = discountPct / 100;
  const discountResponsiveness = Math.min(
    1.0,
    (segment.avg_discount_sensitivity * 0.5) + (discountDecimal * 1.2)
  );

  // Predicted redemption rate (e.g. 0.05 to 0.45)
  const redemptionRate = +(
    (segment.avg_discount_sensitivity * 0.18) +
    (discountDecimal * 0.45) +
    (categoryAffinity * 0.15) +
    ((demandIndex - 1.0) * 0.10)
  ).toFixed(3);

  const boundedRedemption = Math.min(0.48, Math.max(0.04, redemptionRate));

  // Projected incremental sales volume per regional campaign
  const targetReach = Math.min(1200, Math.round(segment.size * 0.025)); // Target batch size per store cluster
  const projectedUnits = Math.round(targetReach * boundedRedemption);

  const discountedPrice = product.base_price * (1 - discountDecimal);
  const projectedRevenue = Math.round(projectedUnits * discountedPrice);
  
  // Margin calculation
  const unitCost = product.base_price * (1 - product.margin_pct);
  const marginPerUnit = discountedPrice - unitCost;
  const marginPctAfterDiscount = +(marginPerUnit / discountedPrice).toFixed(3);
  const projectedMarginDollars = Math.round(projectedUnits * marginPerUnit);

  // Inventory Health Ratio (stock vs projected promotional demand)
  const inventoryHealthRatio = +(invRecord.stock_qty / Math.max(1, projectedUnits)).toFixed(2);

  // Feature Attribution Scores (0 - 1 scale)
  const affinityScore = categoryAffinity;
  const demandScore = Math.min(1.0, demandIndex / 1.8);
  const responsivenessScore = discountResponsiveness;
  
  // Inventory penalty: Penalize low stock heavily
  let inventoryScore = 1.0;
  if (inventoryHealthRatio < 0.5) {
    inventoryScore = 0.15; // Critical penalty for severe stockout risk
  } else if (inventoryHealthRatio < 1.0) {
    inventoryScore = 0.45;
  } else if (inventoryHealthRatio < 1.5) {
    inventoryScore = 0.75;
  }

  // Margin retention score
  const marginScore = Math.max(0, Math.min(1.0, marginPctAfterDiscount / 0.50));

  // Weighted Promotion Fit Score (0 to 100)
  const rawFitScore = (
    (affinityScore * 0.25) +
    (demandScore * 0.25) +
    (responsivenessScore * 0.20) +
    (inventoryScore * 0.20) +
    (marginScore * 0.10)
  ) * 100;

  const fitScore = Math.round(Math.min(99, Math.max(10, rawFitScore)));

  return {
    fitScore,
    projectedUnits,
    projectedRevenue,
    projectedMarginDollars,
    marginPctAfterDiscount,
    redemptionRate: boundedRedemption,
    inventoryHealthRatio,
    stockQty: invRecord.stock_qty,
    daysOfSupply: invRecord.days_of_supply,
    signals: {
      categoryAffinity: +(affinityScore * 100).toFixed(0),
      regionalDemandIndex: demandIndex,
      discountResponsiveness: +(responsivenessScore * 100).toFixed(0),
      inventoryHealthRatio,
      marginPctAfterDiscount: +(marginPctAfterDiscount * 100).toFixed(1)
    }
  };
}
