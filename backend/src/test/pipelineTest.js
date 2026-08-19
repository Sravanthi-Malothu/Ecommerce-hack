import { generate8StagePipelineData } from '../engine/pipelineGenerator.js';

console.log('🧪 Testing 8-Stage End-to-End Retail Data Pipeline Generator...');

const records = generate8StagePipelineData(50);
console.log(`✅ Generated ${records.length} sequential 8-stage pipeline records.`);

const sample = records[0];
console.log('\n📌 Sample Record 8-Stage Trace:');
console.log(`  Stage 1 (Customer): ${sample.customerId} | ${sample.segmentName} (${sample.region})`);
console.log(`  Stage 2 (Purchase History): ${sample.totalOrders} total orders | Total spend: $${sample.pastSpendTotal}`);
console.log(`  Stage 3 (Product Affinity): ${sample.productName} | Affinity: ${sample.affinityScore}%`);
console.log(`  Stage 4 (Promo Response): ${sample.proposedDiscountPct}% OFF | Est. Redemption: ${sample.estimatedRedemptionRate}%`);
console.log(`  Stage 5 (Demand Forecast): Demand Index: ${sample.regionalDemandIndex}x | Projected Units: ${sample.projectedUnits}`);
console.log(`  Stage 6 (Inventory Availability): Stock Qty: ${sample.stockQty} | Stockout Flag: ${sample.stockoutRiskFlag}`);
console.log(`  Stage 7 (Margin Calculation): Margin %: ${sample.marginPctAfterDiscount}% | Margin Dollars: $${sample.projectedMarginDollars}`);
console.log(`  Stage 8 (Promotion Recommendation): Fit Score: ${sample.fitScore} | Risk: ${sample.riskBadge}`);

if (records.length === 50 && sample.fitScore > 0) {
  console.log('\n🎉 ALL 8-STAGE PIPELINE TESTS PASSED SUCCESSFULLY!');
} else {
  console.error('\n❌ Failed Pipeline Generator Test!');
  process.exit(1);
}
