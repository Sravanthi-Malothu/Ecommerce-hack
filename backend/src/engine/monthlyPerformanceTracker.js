import { PRODUCTS } from '../data/syntheticGenerator.js';

const MONTHS = [
  'Jan 2026', 'Feb 2026', 'Mar 2026', 'Apr 2026',
  'May 2026', 'Jun 2026', 'Jul 2026', 'Aug 2026',
  'Sep 2026', 'Oct 2026', 'Nov 2026', 'Dec 2026'
];

/**
 * Monthly Promotion Performance & Profit Tracking Engine
 * Generates 12-month historical performance records, baseline vs. promoted comparisons,
 * top leaderboards, and AI feedback vectors.
 */
export function generateMonthlyPerformanceData() {
  const records = [];
  const feedbackScores = {};

  PRODUCTS.forEach((product) => {
    const basePrice = product.base_price || 150;
    const unitCost = Math.round(basePrice * (1 - (product.margin_pct || 0.40)));
    const normalWeeklyDemand = product.avg_weekly_demand || 150;

    let productTotalProfit = 0;
    let productTotalRoi = 0;
    let productTotalUplift = 0;

    MONTHS.forEach((month, idx) => {
      // Baseline performance (Unpromoted)
      const baselineUnits = Math.round(normalWeeklyDemand * 4.2 * (0.9 + (idx % 3) * 0.08));
      const baselineRevenue = +(baselineUnits * basePrice).toFixed(2);

      // Promoted performance
      const isPromoMonth = idx % 2 === 0 || idx === 11; // Promotions run in bi-monthly cycles + holiday peak
      const discountPct = isPromoMonth ? (idx % 3 === 0 ? 25 : idx % 2 === 0 ? 20 : 15) : 0;
      
      const promoLiftMultiplier = isPromoMonth ? 1.0 + (discountPct * 0.035) + (idx % 4) * 0.05 : 1.0;
      const promotedUnitsSold = Math.round(baselineUnits * promoLiftMultiplier);

      const discountedUnitPrice = +(basePrice * (1 - discountPct / 100)).toFixed(2);
      const promotedRevenueGenerated = +(promotedUnitsSold * discountedUnitPrice).toFixed(2);

      // Cost & Profit Breakdown
      const productCostTotal = +(promotedUnitsSold * unitCost).toFixed(2);
      const marketingSpend = isPromoMonth ? Math.round(promotedRevenueGenerated * 0.06) + 1200 : 0;
      const markdownCost = +(promotedUnitsSold * (basePrice - discountedUnitPrice)).toFixed(2);
      const promotionCostTotal = +(marketingSpend + markdownCost).toFixed(2);

      const profitGenerated = +(promotedRevenueGenerated - (productCostTotal + marketingSpend)).toFixed(2);
      const profitMarginPct = promotedRevenueGenerated > 0 ? +((profitGenerated / promotedRevenueGenerated) * 100).toFixed(1) : 0;
      const promotionRoiPct = promotionCostTotal > 0 ? +((profitGenerated / promotionCostTotal) * 100).toFixed(1) : 0;

      // Uplift Calculations
      const salesUpliftPct = baselineUnits > 0 ? +(((promotedUnitsSold - baselineUnits) / baselineUnits) * 100).toFixed(1) : 0;
      const revenueUpliftPct = baselineRevenue > 0 ? +(((promotedRevenueGenerated - baselineRevenue) / baselineRevenue) * 100).toFixed(1) : 0;

      const rec = {
        id: `mrec_${product.product_id}_m${idx + 1}`,
        productId: product.product_id,
        productName: product.product_name,
        category: product.category,
        month,
        monthIndex: idx + 1,
        isPromoMonth,
        discountOffered: `${discountPct}% OFF`,
        discountPct,

        // Baseline Metrics
        baselineUnits,
        baselineRevenue,

        // Promoted Metrics
        promotedUnitsSold,
        promotedRevenueGenerated,

        // Cost & Profit
        unitCost,
        basePrice,
        discountedUnitPrice,
        productCostTotal,
        marketingSpend,
        markdownCost,
        promotionCostTotal,
        profitGenerated,
        profitMarginPct,
        promotionRoiPct,

        // Uplifts
        salesUpliftPct,
        revenueUpliftPct
      };

      records.push(rec);

      if (isPromoMonth) {
        productTotalProfit += profitGenerated;
        productTotalRoi += promotionRoiPct;
        productTotalUplift += revenueUpliftPct;
      }
    });

    // Feedback score for AI Recommendation Engine
    feedbackScores[product.product_id] = {
      productId: product.product_id,
      productName: product.product_name,
      avgRoi: +(productTotalRoi / 6).toFixed(1),
      avgMarginPct: +(productTotalProfit / 6 / 1500).toFixed(1),
      avgRevenueUplift: +(productTotalUplift / 6).toFixed(1),
      profitabilityScore: Math.min(100, Math.max(50, Math.round((productTotalRoi / 6) * 0.4 + (productTotalProfit / 5000))))
    };
  });

  // Calculate Top Leaderboard Highlights
  const promoRecords = records.filter(r => r.isPromoMonth);

  const highestProfitPromo = [...promoRecords].sort((a, b) => b.profitGenerated - a.profitGenerated)[0];
  const highestRoiPromo = [...promoRecords].sort((a, b) => b.promotionRoiPct - a.promotionRoiPct)[0];
  const highestRevenueUpliftPromo = [...promoRecords].sort((a, b) => b.revenueUpliftPct - a.revenueUpliftPct)[0];
  const highestSalesUpliftPromo = [...promoRecords].sort((a, b) => b.salesUpliftPct - a.salesUpliftPct)[0];

  return {
    records,
    feedbackScores,
    leaderboards: {
      highestProfitPromo,
      highestRoiPromo,
      highestRevenueUpliftPromo,
      highestSalesUpliftPromo
    }
  };
}
