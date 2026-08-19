import { generateCrossProductBundlesData } from '../engine/crossProductEngine.js';

console.log('🧪 Testing Cross-Product Promotion & Uplift Learning Engine...');

const result = generateCrossProductBundlesData();
const { bundles, stats } = result;

console.log(`✅ Generated ${bundles.length} cross-product bundle recommendations.`);
console.log(`  Avg Attachment Rate: ${stats.avgAttachmentRatePct}%`);
console.log(`  Total Incremental Profit: ₹${stats.totalIncrementalProfit.toLocaleString('en-IN')}`);
console.log(`  Meaningful Uplift Success Rate: ${stats.meaningfulSuccessPct}%`);

const sample = bundles[0];
console.log('\n📌 Sample Co-Promote Bundle Record:');
console.log(`  Anchor Product: ${sample.anchorProductName} (${sample.category})`);
console.log(`  Bundled Accessories: ${sample.bundledProducts.join(', ')}`);
console.log(`  Bundle Discount: ${sample.bundleDiscountOffered}`);
console.log(`  Attachment Rate: ${sample.attachmentRatePct}%`);
console.log(`  Before vs During Units: ${sample.baseUnits} vs ${sample.promoUnits} units (+${sample.salesUpliftPct}%)`);
console.log(`  Incremental Revenue & Profit: +₹${sample.incrementalRevenue.toLocaleString('en-IN')} rev / +₹${sample.incrementalProfit.toLocaleString('en-IN')} profit`);
console.log(`  Meaningful Uplift?: ${sample.meaningfulUpliftFlag ? '✅ YES' : '❌ NO'}`);
console.log(`  AI Verdict: ${sample.aiVerdict.verdictTitle}`);
console.log(`  Rationale: ${sample.aiVerdict.verdictExplanation}`);

if (bundles.length > 10 && stats.totalIncrementalProfit > 0) {
  console.log('\n🎉 ALL CROSS-PRODUCT BUNDLE ENGINE TESTS PASSED SUCCESSFULLY!');
} else {
  console.error('\n❌ Failed Cross-Product Bundle Test!');
  process.exit(1);
}
