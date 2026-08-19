import { generateMonthlyPerformanceData } from '../engine/monthlyPerformanceTracker.js';

console.log('🧪 Testing Monthly Promotion Performance & Profit Tracking Engine...');

const result = generateMonthlyPerformanceData();
const { records, feedbackScores, leaderboards } = result;

console.log(`✅ Generated ${records.length} monthly performance records across ${Object.keys(feedbackScores).length} products.`);

console.log('\n🏆 Top Performance Leaderboards:');
console.log(`  Highest Profit: ${leaderboards.highestProfitPromo.productName} (${leaderboards.highestProfitPromo.month}) — $${leaderboards.highestProfitPromo.profitGenerated.toLocaleString()} Profit (${leaderboards.highestProfitPromo.profitMarginPct}% Margin)`);
console.log(`  Highest ROI: ${leaderboards.highestRoiPromo.productName} (${leaderboards.highestRoiPromo.month}) — ${leaderboards.highestRoiPromo.promotionRoiPct}% ROI`);
console.log(`  Highest Revenue Uplift: ${leaderboards.highestRevenueUpliftPromo.productName} (${leaderboards.highestRevenueUpliftPromo.month}) — +${leaderboards.highestRevenueUpliftPromo.revenueUpliftPct}% Revenue Lift`);
console.log(`  Highest Sales Uplift: ${leaderboards.highestSalesUpliftPromo.productName} (${leaderboards.highestSalesUpliftPromo.month}) — +${leaderboards.highestSalesUpliftPromo.salesUpliftPct}% Sales Lift`);

if (records.length > 100 && leaderboards.highestProfitPromo.profitGenerated > 0) {
  console.log('\n🎉 ALL MONTHLY PERFORMANCE TRACKER TESTS PASSED SUCCESSFULLY!');
} else {
  console.error('\n❌ Failed Monthly Tracker Test!');
  process.exit(1);
}
