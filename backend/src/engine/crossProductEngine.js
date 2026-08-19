import { PRODUCTS } from '../data/syntheticGenerator.js';

// Complementary Product Co-Purchase Affinity Map
const COMPLEMENTARY_MAPPING = {
  prod_coffee_roast: [
    { name: 'Milk Frother Wand', category: 'Home Goods', price: 1200, affinityScore: 0.88 },
    { name: 'Artisan Ceramic Mug Set', category: 'Home Goods', price: 950, affinityScore: 0.82 },
    { name: 'Gourmet Vanilla Syrup', category: 'Groceries', price: 450, affinityScore: 0.76 }
  ],
  prod_running_shoes_apex: [
    { name: 'Performance Compression Socks', category: 'Footwear', price: 850, affinityScore: 0.91 },
    { name: 'Hydration Running Belt', category: 'Outdoor Gear', price: 1400, affinityScore: 0.85 },
    { name: 'Shoe Deodorizer Spray', category: 'Footwear', price: 350, affinityScore: 0.72 }
  ],
  prod_hiking_boots: [
    { name: 'Merino Wool Hiking Socks', category: 'Footwear', price: 950, affinityScore: 0.94 },
    { name: 'Waterproofing Wax Spray', category: 'Outdoor Gear', price: 650, affinityScore: 0.89 },
    { name: 'Trekking Pole Pair', category: 'Outdoor Gear', price: 2200, affinityScore: 0.78 }
  ],
  prod_casual_sneakers: [
    { name: 'No-Show Organic Cotton Socks', category: 'Footwear', price: 450, affinityScore: 0.40 },
    { name: 'Sneaker Cleaner Kit', category: 'Footwear', price: 750, affinityScore: 0.35 }
  ],
  prod_winter_parka: [
    { name: 'Thermal Fleece Glove Liners', category: 'Apparel', price: 1100, affinityScore: 0.92 },
    { name: 'Waterproof Beanie Hat', category: 'Apparel', price: 850, affinityScore: 0.88 }
  ],
  prod_leather_jacket: [
    { name: 'Napa Leather Conditioner Spray', category: 'Apparel', price: 950, affinityScore: 0.55 },
    { name: 'Silk Neck Scarf', category: 'Apparel', price: 1500, affinityScore: 0.45 }
  ],
  prod_yoga_activewear_set: [
    { name: 'Non-Slip Eco Yoga Mat', category: 'Apparel', price: 2100, affinityScore: 0.95 },
    { name: 'Microfiber Sweat Towel', category: 'Apparel', price: 650, affinityScore: 0.86 }
  ],
  prod_office_chair: [
    { name: 'Memory Foam Lumbar Support Pillow', category: 'Home Goods', price: 1600, affinityScore: 0.30 },
    { name: 'Ergonomic Footrest Stool', category: 'Home Goods', price: 1900, affinityScore: 0.25 }
  ],
  prod_espresso_maker: [
    { name: 'Stainless Steel Milk Pitcher', category: 'Home Goods', price: 1100, affinityScore: 0.60 },
    { name: 'Precision Espresso Tamper', category: 'Home Goods', price: 1400, affinityScore: 0.52 }
  ],
  prod_dutch_oven: [
    { name: 'Silicone Trivet Mat Pair', category: 'Home Goods', price: 750, affinityScore: 0.87 },
    { name: 'Enamel-Safe Wooden Utensils', category: 'Home Goods', price: 950, affinityScore: 0.83 }
  ],
  prod_robot_vacuum: [
    { name: 'Replacement HEPA Filter 4-Pack', category: 'Home Goods', price: 1200, affinityScore: 0.58 },
    { name: 'Dual Edge Side Brushes', category: 'Home Goods', price: 850, affinityScore: 0.50 }
  ],
  prod_skincare_bundle: [
    { name: 'Hydrating Botanical Facial Serum', category: 'Beauty & Care', price: 1800, affinityScore: 0.96 },
    { name: 'Sonic Facial Cleansing Brush', category: 'Beauty & Care', price: 2400, affinityScore: 0.91 }
  ],
  prod_hair_dryer_styler: [
    { name: 'Heat Protectant Styling Spray', category: 'Beauty & Care', price: 950, affinityScore: 0.89 },
    { name: 'Ceramic Barrel Round Brush', category: 'Beauty & Care', price: 1200, affinityScore: 0.84 }
  ],
  prod_camping_tent: [
    { name: 'Heavy-Duty Ground Tarp', category: 'Outdoor Gear', price: 1400, affinityScore: 0.91 },
    { name: 'LED Camping Lantern', category: 'Outdoor Gear', price: 1100, affinityScore: 0.88 }
  ],
  prod_hydration_flask: [
    { name: 'Protective Silicone Boot Sleeve', category: 'Outdoor Gear', price: 450, affinityScore: 0.90 },
    { name: 'Straw Lid Cap Attachment', category: 'Outdoor Gear', price: 550, affinityScore: 0.86 }
  ],
  prod_smartwatch_pro: [
    { name: 'Magnetic Wireless Charging Pad', category: 'Electronics', price: 1600, affinityScore: 0.95 },
    { name: 'Breathable Sport Wrist Strap', category: 'Electronics', price: 950, affinityScore: 0.91 },
    { name: 'Screen Protector 2-Pack', category: 'Electronics', price: 450, affinityScore: 0.88 }
  ],
  prod_earbuds_wireless: [
    { name: 'Silicone Ear-Tip Replacement Set', category: 'Electronics', price: 550, affinityScore: 0.22 },
    { name: 'Carabiner Protective Charging Case', category: 'Electronics', price: 850, affinityScore: 0.18 }
  ]
};

/**
 * Cross-Product Promotion & Uplift Learning Engine
 * Generates 17 historical co-purchase bundle records, tracks attachment rates, calculates incremental profit,
 * tests for meaningful uplift, and provides AI Future Bundle Verdicts.
 */
export function generateCrossProductBundlesData() {
  const bundles = [];

  PRODUCTS.forEach((product, idx) => {
    const comps = COMPLEMENTARY_MAPPING[product.product_id] || [
      { name: 'Universal Care Kit', category: product.category, price: 800, affinityScore: 0.70 }
    ];

    const bundledItemNames = comps.map(c => c.name);
    const primaryAffinity = comps[0].affinityScore;

    // Classify scenario into HIGH_PERFORMER, MODERATE_MODIFY, or POOR_AVOID
    let scenario = 'HIGH_PERFORMER';
    if (primaryAffinity < 0.40) {
      scenario = 'POOR_AVOID';
    } else if (primaryAffinity < 0.65) {
      scenario = 'MODERATE_MODIFY';
    }

    let bundleDiscountPct = 15;
    let attachmentRatePct = 75.0;
    let baseUnits = 350 + (idx * 15);
    let promoUnits = 0;
    let meaningfulUpliftFlag = true;
    let repeatRecommendation = 'RECOMMENDED_FOR_FUTURE';
    let verdictTitle = '🟢 High-Performance Co-Promote Bundle';
    let verdictExplanation = '';

    const anchorPrice = product.base_price || 2500;
    const compsPriceSum = comps.reduce((sum, c) => sum + c.price, 0);
    const totalBundleListPrice = anchorPrice + compsPriceSum;

    if (scenario === 'HIGH_PERFORMER') {
      bundleDiscountPct = idx % 2 === 0 ? 15 : 10;
      attachmentRatePct = +((primaryAffinity * 85) + (idx % 3) * 2).toFixed(1);
      promoUnits = Math.round(baseUnits * (1 + (attachmentRatePct * 0.011)));
      meaningfulUpliftFlag = true;
      repeatRecommendation = 'RECOMMENDED_FOR_FUTURE';
      verdictTitle = '🟢 High-Performance Co-Promote Bundle';
    } else if (scenario === 'MODERATE_MODIFY') {
      bundleDiscountPct = 25; // Over-discounted
      attachmentRatePct = +((primaryAffinity * 75)).toFixed(1);
      promoUnits = Math.round(baseUnits * (1 + (attachmentRatePct * 0.008)));
      meaningfulUpliftFlag = false;
      repeatRecommendation = 'MODIFY_DISCOUNT';
      verdictTitle = '🟡 Modify Discount Depth Before Repeating';
    } else {
      // POOR_AVOID
      bundleDiscountPct = 20;
      attachmentRatePct = +((primaryAffinity * 60)).toFixed(1);
      promoUnits = Math.round(baseUnits * 1.08); // Very low lift
      meaningfulUpliftFlag = false;
      repeatRecommendation = 'AVOID_IN_FUTURE';
      verdictTitle = '🔴 Avoid Bundling in Future';
    }

    const bundleDiscountedPrice = +(totalBundleListPrice * (1 - bundleDiscountPct / 100)).toFixed(2);
    const salesUpliftPct = +(((promoUnits - baseUnits) / baseUnits) * 100).toFixed(1);

    const baselineRevenue = +(baseUnits * anchorPrice).toFixed(2);
    const promotedRevenue = +(promoUnits * bundleDiscountedPrice).toFixed(2);
    const incrementalRevenue = +(promotedRevenue - baselineRevenue).toFixed(2);

    const unitCost = Math.round(totalBundleListPrice * 0.55);
    const baselineProfit = +(baseUnits * (anchorPrice - Math.round(anchorPrice * 0.50))).toFixed(2);
    const promotedProfit = +(promoUnits * (bundleDiscountedPrice - unitCost)).toFixed(2);
    const incrementalProfit = +(promotedProfit - baselineProfit).toFixed(2);

    const promoCostTotal = Math.round(promotedRevenue * 0.07) + 1200;
    const promotionRoiPct = promoCostTotal > 0 ? +((incrementalProfit / promoCostTotal) * 100).toFixed(1) : 0;

    if (scenario === 'HIGH_PERFORMER') {
      verdictExplanation = `Exceptional cross-product uplift! High ${attachmentRatePct}% attachment rate generated +₹${Math.round(incrementalProfit).toLocaleString('en-IN')} in incremental profit (+${salesUpliftPct}% volume boost). Highly recommended for future campaigns.`;
    } else if (scenario === 'MODERATE_MODIFY') {
      verdictExplanation = `Moderate attachment rate (${attachmentRatePct}%). While sales volume grew by +${salesUpliftPct}%, the ${bundleDiscountPct}% discount reduced margin dollar retention. Reduce bundle discount from ${bundleDiscountPct}% to 10% to protect category profit.`;
    } else {
      verdictExplanation = `Low attachment rate (${attachmentRatePct}%) and poor margin return. Cross-promoting ${bundledItemNames.slice(0, 2).join(', ')} failed to drive meaningful incremental profit. Avoid co-promoting this bundle.`;
    }

    bundles.push({
      bundleId: `bun_${2000 + idx}`,
      anchorProductId: product.product_id,
      anchorProductName: product.product_name,
      category: product.category,
      bundledProducts: bundledItemNames,
      bundledItemsCount: bundledItemNames.length,
      bundleDiscountOffered: `${bundleDiscountPct}% OFF Bundle`,
      bundleDiscountPct,

      anchorPrice,
      totalBundleListPrice,
      bundleDiscountedPrice,

      // Tracked Metrics
      baseUnits,
      promoUnits,
      salesUpliftPct,
      attachmentRatePct,

      baselineRevenue,
      promotedRevenue,
      incrementalRevenue,

      baselineProfit,
      promotedProfit,
      incrementalProfit,

      promoCostTotal,
      promotionRoiPct,

      meaningfulUpliftFlag,

      // AI Verdict for Future
      aiVerdict: {
        repeatRecommendation,
        verdictTitle,
        verdictExplanation
      }
    });
  });

  // Sort: High-Performance Champions first!
  bundles.sort((a, b) => b.incrementalProfit - a.incrementalProfit);

  // Calculate Overall Cross-Product Metrics
  const avgAttachmentRatePct = +(bundles.reduce((sum, b) => sum + b.attachmentRatePct, 0) / bundles.length).toFixed(1);
  const totalIncrementalProfit = bundles.reduce((sum, b) => sum + b.incrementalProfit, 0);
  const avgSalesUpliftPct = +(bundles.reduce((sum, b) => sum + b.salesUpliftPct, 0) / bundles.length).toFixed(1);
  const meaningfulSuccessCount = bundles.filter(b => b.meaningfulUpliftFlag).length;
  const meaningfulSuccessPct = +((meaningfulSuccessCount / bundles.length) * 100).toFixed(1);

  return {
    bundles,
    complementaryMapping: COMPLEMENTARY_MAPPING,
    stats: {
      totalBundlesAnalyzed: bundles.length,
      avgAttachmentRatePct,
      totalIncrementalProfit,
      avgSalesUpliftPct,
      meaningfulSuccessCount,
      meaningfulSuccessPct
    }
  };
}
