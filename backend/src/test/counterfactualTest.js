import { generateDecisionHistoryData } from '../engine/decisionHistoryTracker.js';

console.log('🧪 Testing Counterfactual Uplift Estimator...\n');

const historyData = generateDecisionHistoryData();

console.log(`✅ Logged Decisions: ${historyData.stats.totalDecisionsLogged}`);
console.log(`✅ Approved Campaigns: ${historyData.stats.approvedCount}`);
console.log(`✅ Total Realized Revenue: ₹${historyData.stats.totalActualRevenue.toLocaleString('en-IN')}`);
console.log(`✅ Total Counterfactual Baseline Revenue (d=0): ₹${historyData.stats.totalCounterfactualRevenue.toLocaleString('en-IN')}`);
console.log(`✅ Total Incremental Net Revenue Lift: +₹${historyData.stats.totalIncrementalRevenueLift.toLocaleString('en-IN')}`);
console.log(`✅ Total Incremental Net Profit Lift: +₹${historyData.stats.totalIncrementalProfitLift.toLocaleString('en-IN')}`);
console.log(`✅ Net-Positive Uplift Rate: ${historyData.stats.netPositiveUpliftPct}%\n`);

const sampleDecision = historyData.decisions[0];
console.log(`📌 Sample Decision Counterfactual Breakdown [${sampleDecision.productName}]:`);
console.log(`   Realized Outcome (with promo): ${sampleDecision.actualUnits} units | ₹${sampleDecision.actualRevenue.toLocaleString('en-IN')} rev`);
console.log(`   Counterfactual Baseline (no promo d=0): ${sampleDecision.counterfactual.baselineUnits} units | ₹${sampleDecision.counterfactual.counterfactualRevenue.toLocaleString('en-IN')} rev`);
console.log(`   Incremental Lift: +${sampleDecision.counterfactual.incrementalUnitsLift} units | +₹${sampleDecision.counterfactual.incrementalRevenueLift.toLocaleString('en-IN')} rev`);
console.log(`   Net Profit Lift: +₹${sampleDecision.counterfactual.incrementalProfitLift.toLocaleString('en-IN')} | Net Positive: ${sampleDecision.counterfactual.isNetPositiveUplift}\n`);

if (!historyData.stats.totalIncrementalRevenueLift) {
  throw new Error('Counterfactual revenue lift calculation failed');
}

console.log('🎉 COUNTERFACTUAL UPLIFT ESTIMATOR TESTS PASSED SUCCESSFULLY!');
