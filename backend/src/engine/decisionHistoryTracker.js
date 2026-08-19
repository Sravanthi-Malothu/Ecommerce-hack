import { PRODUCTS, CUSTOMER_SEGMENTS, REGIONS } from '../data/syntheticGenerator.js';

/**
 * PromoAlign Decision History & Post-Launch Outcome Tracking Engine
 * Logs team promotional decisions (Approved, Rejected, Modified), tracks actual post-launch outcomes,
 * compares Predicted vs. Actual performance, and provides AI Verdicts for Future Decisions.
 */
export function generateDecisionHistoryData() {
  const decisions = [];

  const personas = ['Marketing Lead', 'Merchandiser Lead', 'Store Ops Lead', 'Category Lead (Sravanthi)'];
  const dates = [
    '2026-07-02', '2026-07-15', '2026-07-28', '2026-08-04',
    '2026-08-10', '2026-08-14', '2026-08-18'
  ];

  PRODUCTS.forEach((product, idx) => {
    const segment = CUSTOMER_SEGMENTS[idx % CUSTOMER_SEGMENTS.length];
    const region = REGIONS[idx % REGIONS.length];
    const date = dates[idx % dates.length];
    const persona = personas[idx % personas.length];

    // Determine decision scenario type (70% Approved Success, 15% Stockout Failure, 15% Margin Breach/Modified)
    const scenarioType = idx % 5 === 0 ? 'STOCKOUT_FAILURE' : idx % 7 === 0 ? 'MARGIN_BREACH' : idx % 6 === 0 ? 'REJECTED' : 'SUCCESS';

    const basePrice = product.base_price || 150;
    const proposedDiscount = scenarioType === 'MARGIN_BREACH' ? 35 : (idx % 3 === 0 ? 25 : 15);
    const discountedPrice = +(basePrice * (1 - proposedDiscount / 100)).toFixed(2);

    const predictedUnits = 450 + (idx * 25);
    const predictedRevenue = Math.round(predictedUnits * discountedPrice);

    let actualUnits = 0;
    let actualRevenue = 0;
    let actualMargin = 0;
    let stockImpact = '';
    let decisionTaken = 'APPROVED';
    let outcomeStatus = 'SUCCESS';
    let repeatRecommendation = 'REPEAT';
    let verdictTitle = '🟢 Repeat Decision in Future';
    let verdictExplanation = '';

    if (scenarioType === 'SUCCESS') {
      decisionTaken = 'APPROVED';
      actualUnits = Math.round(predictedUnits * (0.98 + (idx % 4) * 0.03));
      actualRevenue = Math.round(actualUnits * discountedPrice);
      actualMargin = +((product.margin_pct - proposedDiscount / 100 + 0.05) * 100).toFixed(1);
      stockImpact = 'Healthy Stock Cushion Confirmed (28 Days Supply)';
      outcomeStatus = 'SUCCESS';
      repeatRecommendation = 'REPEAT';
      verdictTitle = '🟢 Repeat Decision in Future';
      verdictExplanation = `Extremely effective campaign decision. Exceeded predicted revenue by +$${(actualRevenue - predictedRevenue).toLocaleString()} while retaining a strong ${actualMargin}% post-promo margin with zero stockout risk. Recommend repeating for ${segment.segment_name} in ${region}.`;
    } else if (scenarioType === 'STOCKOUT_FAILURE') {
      decisionTaken = 'APPROVED';
      actualUnits = Math.round(predictedUnits * 0.65); // Demand cut short by stockout
      actualRevenue = Math.round(actualUnits * discountedPrice);
      actualMargin = +((product.margin_pct - proposedDiscount / 100) * 100).toFixed(1);
      stockImpact = '🔴 Stockout Occurred in 4 Days (Lost 210 units in sales)';
      outcomeStatus = 'STOCKOUT_FAILURE';
      repeatRecommendation = 'DO_NOT_REPEAT';
      verdictTitle = '🔴 Do Not Repeat (Stockout Failure)';
      verdictExplanation = `Regretted decision: Stock depletion occurred within 4 days of launch, causing $${Math.round((predictedUnits - actualUnits) * discountedPrice).toLocaleString()} in unfulfilled demand. Avoid repeating without adding 300+ units in store safety stock.`;
    } else if (scenarioType === 'MARGIN_BREACH') {
      decisionTaken = 'DISCOUNT_MODIFIED';
      actualUnits = Math.round(predictedUnits * 1.15);
      actualRevenue = Math.round(actualUnits * discountedPrice);
      actualMargin = 11.2; // Dropped below 15% floor
      stockImpact = 'Stock Buffer Adequate (18 Days Supply)';
      outcomeStatus = 'MARGIN_BREACH';
      repeatRecommendation = 'MODIFY_BEFORE_REPEAT';
      verdictTitle = '🟡 Modify Before Repeat (Margin Floor Breach)';
      verdictExplanation = `Partial success: High sales volume (+15%), but the ${proposedDiscount}% discount eroded category margin to ${actualMargin}%, breaching our 15% floor. Lower discount depth from ${proposedDiscount}% to 15% before repeating.`;
    } else {
      decisionTaken = 'REJECTED';
      actualUnits = 0;
      actualRevenue = 0;
      actualMargin = 0;
      stockImpact = 'No Promotion Launched (Baseline Sales Maintained)';
      outcomeStatus = 'REJECTED_CAMPAIGN';
      repeatRecommendation = 'DO_NOT_REPEAT';
      verdictTitle = '⚪ Campaign Rejected by Team';
      verdictExplanation = `Campaign rejected during sign-off due to poor customer segment affinity. Baseline sales generated un-discounted margin.`;
    }

    decisions.push({
      decisionId: `dec_${1000 + idx}`,
      decisionDate: date,
      personaName: persona,
      productId: product.product_id,
      productName: product.product_name,
      category: product.category,
      region,
      segmentName: segment.segment_name,
      decisionTaken,
      proposedDiscount: `${proposedDiscount}% OFF`,

      // Performance Comparison
      predictedUnits,
      actualUnits,
      unitVariancePct: predictedUnits > 0 ? +(((actualUnits - predictedUnits) / predictedUnits) * 100).toFixed(1) : 0,

      predictedRevenue,
      actualRevenue,
      revenueVarianceDollars: actualRevenue - predictedRevenue,
      revenueVariancePct: predictedRevenue > 0 ? +(((actualRevenue - predictedRevenue) / predictedRevenue) * 100).toFixed(1) : 0,

      targetMarginPct: 15.0,
      actualMarginPct: actualMargin,
      stockImpact,
      outcomeStatus,

      // AI Verdict for Future Decisions
      aiVerdict: {
        repeatRecommendation,
        verdictTitle,
        verdictExplanation
      }
    });
  });

  // Calculate Overall Decision Accuracy Stats
  const approvedDecisions = decisions.filter(d => d.decisionTaken !== 'REJECTED');
  const repeatCount = approvedDecisions.filter(d => d.aiVerdict.repeatRecommendation === 'REPEAT').length;
  const doNotRepeatCount = approvedDecisions.filter(d => d.aiVerdict.repeatRecommendation === 'DO_NOT_REPEAT').length;
  const modifyCount = approvedDecisions.filter(d => d.aiVerdict.repeatRecommendation === 'MODIFY_BEFORE_REPEAT').length;

  const totalActualRevenue = approvedDecisions.reduce((sum, d) => sum + d.actualRevenue, 0);
  const totalPredictedRevenue = approvedDecisions.reduce((sum, d) => sum + d.predictedRevenue, 0);

  return {
    decisions,
    stats: {
      totalDecisionsLogged: decisions.length,
      approvedCount: approvedDecisions.length,
      repeatableSuccessPct: approvedDecisions.length > 0 ? +((repeatCount / approvedDecisions.length) * 100).toFixed(1) : 0,
      regrettedCount: doNotRepeatCount,
      modifyCount,
      totalActualRevenue,
      revenuePredictionAccuracyPct: totalPredictedRevenue > 0 ? +(100 - Math.abs((totalActualRevenue - totalPredictedRevenue) / totalPredictedRevenue) * 100).toFixed(1) : 95.0
    }
  };
}
