import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { CUSTOMER_SEGMENTS, PRODUCTS, REGIONS } from '../data/syntheticGenerator.js';
import { computePromotionMetrics } from './scoringEngine.js';
import { evaluateConstraints } from './constraintEngine.js';
import { generateExplanation } from './explanationEngine.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const RAW_DIR = path.join(__dirname, '../data/raw');

if (!fs.existsSync(RAW_DIR)) {
  fs.mkdirSync(RAW_DIR, { recursive: true });
}

/**
 * 8-Stage End-to-End Retail Data Pipeline Generator:
 * 
 * 1. Customer
 * 2. Purchase History
 * 3. Product Affinity
 * 4. Promotion Response
 * 5. Demand Forecast
 * 6. Inventory Availability
 * 7. Margin Calculation
 * 8. Promotion Recommendation
 */
export function generate8StagePipelineData(recordCount = 100) {
  const records = [];
  const csvFilePath = path.join(RAW_DIR, 'promoalign_end_to_end_pipeline.csv');

  const headers = [
    'Stage1_Customer_ID',
    'Stage1_Customer_Segment',
    'Stage1_Region',
    'Stage1_Avg_Order_Value',

    'Stage2_Total_Orders',
    'Stage2_Last_Purchase_Days_Ago',
    'Stage2_Preferred_Category',
    'Stage2_Past_Spend_Total',

    'Stage3_Product_ID',
    'Stage3_Product_Name',
    'Stage3_Product_Category',
    'Stage3_Category_Affinity_Score',

    'Stage4_Discount_Sensitivity',
    'Stage4_Estimated_Redemption_Rate',
    'Stage4_Proposed_Discount_Pct',

    'Stage5_Regional_Demand_Index',
    'Stage5_Projected_Promo_Demand_Units',

    'Stage6_Store_Stock_Qty',
    'Stage6_Days_Of_Supply',
    'Stage6_Stockout_Risk_Flag',

    'Stage7_Base_Price',
    'Stage7_Post_Discount_Price',
    'Stage7_Margin_Pct_After_Discount',
    'Stage7_Projected_Margin_Dollars',
    'Stage7_Margin_Risk_Flag',

    'Stage8_Promotion_Fit_Score',
    'Stage8_Risk_Level',
    'Stage8_Risk_Badge',
    'Stage8_AI_Why_Rationale'
  ];

  let csvContent = headers.join(',') + '\n';

  for (let i = 1; i <= recordCount; i++) {
    // --- STAGE 1: Customer ---
    const segment = CUSTOMER_SEGMENTS[i % CUSTOMER_SEGMENTS.length];
    const region = REGIONS[i % REGIONS.length];
    const customerId = `CUST_PL_${1000 + i}`;
    const avgOrderValue = +(segment.avg_order_value + (i % 15)).toFixed(2);

    // --- STAGE 2: Purchase History ---
    const totalOrders = Math.floor(5 + (i * 1.5) % 40);
    const lastPurchaseDaysAgo = segment.last_promo_days_ago;
    const preferredCategory = segment.preferred_categories[i % segment.preferred_categories.length] || 'Footwear';
    const pastSpendTotal = +(totalOrders * avgOrderValue).toFixed(2);

    // --- STAGE 3: Product Affinity ---
    const product = PRODUCTS[i % PRODUCTS.length];
    const isCategoryMatch = segment.preferred_categories.includes(product.category);
    const affinityScore = isCategoryMatch ? 0.92 : 0.35;

    // --- STAGE 4: Promotion Response ---
    const discountSensitivity = segment.avg_discount_sensitivity;
    const proposedDiscountPct = (i % 4 === 0) ? 30 : (i % 3 === 0) ? 25 : (i % 2 === 0) ? 20 : 15;

    // --- STAGE 5: Demand Forecast & Metrics ---
    // Compute pipeline metrics
    const dummyDemandSignal = [{ region, product_category: product.category, demand_index: 1.45, trend_direction: 'Spiking' }];
    const dummyInventory = [{ product_id: product.product_id, region, stock_qty: (i % 3 === 0) ? 35 : 450, days_of_supply: (i % 3 === 0) ? 6 : 42 }];

    const metrics = computePromotionMetrics(
      segment,
      product,
      region,
      proposedDiscountPct,
      dummyInventory,
      dummyDemandSignal
    );

    // --- STAGE 6: Inventory Availability ---
    const stockoutRiskFlag = metrics.stockQty < metrics.projectedUnits ? 'TRUE' : 'FALSE';

    // --- STAGE 7: Margin Calculation ---
    const discountedPrice = +(product.base_price * (1 - proposedDiscountPct / 100)).toFixed(2);
    const marginRiskFlag = metrics.marginPctAfterDiscount < 0.15 ? 'TRUE' : 'FALSE';

    // --- STAGE 8: Promotion Recommendation ---
    const constraintEval = evaluateConstraints(segment, product, metrics);
    const explanation = generateExplanation(segment, product, region, metrics, constraintEval);

    const record = {
      // Stage 1
      customerId,
      segmentName: segment.segment_name,
      region,
      avgOrderValue,

      // Stage 2
      totalOrders,
      lastPurchaseDaysAgo,
      preferredCategory,
      pastSpendTotal,

      // Stage 3
      productId: product.product_id,
      productName: product.product_name,
      productCategory: product.category,
      affinityScore: +(affinityScore * 100).toFixed(0),

      // Stage 4
      discountSensitivity: +(discountSensitivity * 100).toFixed(0),
      estimatedRedemptionRate: +(metrics.redemptionRate * 100).toFixed(1),
      proposedDiscountPct,

      // Stage 5
      regionalDemandIndex: metrics.signals.regionalDemandIndex,
      projectedUnits: metrics.projectedUnits,

      // Stage 6
      stockQty: metrics.stockQty,
      daysOfSupply: metrics.daysOfSupply,
      stockoutRiskFlag,

      // Stage 7
      basePrice: product.base_price,
      discountedPrice,
      marginPctAfterDiscount: +(metrics.marginPctAfterDiscount * 100).toFixed(1),
      projectedMarginDollars: metrics.projectedMarginDollars,
      marginRiskFlag,

      // Stage 8
      fitScore: metrics.fitScore,
      riskLevel: constraintEval.riskLevel,
      riskBadge: constraintEval.flags[0]?.badge || '🟢 Healthy Stock',
      aiRationale: explanation.summaryRationale
    };

    records.push(record);

    // Append to CSV
    csvContent += [
      record.customerId,
      `"${record.segmentName}"`,
      `"${record.region}"`,
      record.avgOrderValue,

      record.totalOrders,
      record.lastPurchaseDaysAgo,
      `"${record.preferredCategory}"`,
      record.pastSpendTotal,

      `"${record.productId}"`,
      `"${record.productName}"`,
      `"${record.productCategory}"`,
      `${record.affinityScore}%`,

      `${record.discountSensitivity}%`,
      `${record.estimatedRedemptionRate}%`,
      `${record.proposedDiscountPct}%`,

      record.regionalDemandIndex,
      record.projectedUnits,

      record.stockQty,
      record.daysOfSupply,
      record.stockoutRiskFlag,

      record.basePrice,
      record.discountedPrice,
      `${record.marginPctAfterDiscount}%`,
      record.projectedMarginDollars,
      record.marginRiskFlag,

      record.fitScore,
      `"${record.riskLevel}"`,
      `"${record.riskBadge}"`,
      `"${record.aiRationale.replace(/"/g, '""')}"`
    ].join(',') + '\n';
  }

  fs.writeFileSync(csvFilePath, csvContent);
  console.log(`✅ Generated 8-Stage End-to-End Pipeline CSV (${recordCount} records) at ${csvFilePath}`);

  return records;
}
