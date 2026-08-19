import { generateDecisionHistoryData } from '../engine/decisionHistoryTracker.js';

console.log('🧪 Testing Decision History & Historical Outcome Tracking Engine...');

const result = generateDecisionHistoryData();
const { decisions, stats } = result;

console.log(`✅ Logged ${decisions.length} historical decision audit records.`);
console.log(`  Repeatable Success Decisions: ${stats.repeatableSuccessPct}%`);
console.log(`  Total Actual Revenue Generated: $${stats.totalActualRevenue.toLocaleString()}`);
console.log(`  Revenue Prediction Accuracy: ${stats.revenuePredictionAccuracyPct}%`);

const sample = decisions[0];
console.log('\n📌 Sample Decision Audit Record:');
console.log(`  Decision Date & Persona: ${sample.decisionDate} (${sample.personaName})`);
console.log(`  Product & Target: ${sample.productName} in ${sample.region} (${sample.segmentName})`);
console.log(`  Decision Taken: ${sample.decisionTaken} (${sample.proposedDiscount})`);
console.log(`  Predicted vs Actual Revenue: $${sample.predictedRevenue.toLocaleString()} vs $${sample.actualRevenue.toLocaleString()} (${sample.revenueVariancePct}%)`);
console.log(`  Stock Impact: ${sample.stockImpact}`);
console.log(`  AI Verdict for Future: ${sample.aiVerdict.verdictTitle}`);
console.log(`  Verdict Rationale: ${sample.aiVerdict.verdictExplanation}`);

if (decisions.length > 10 && stats.totalActualRevenue > 0) {
  console.log('\n🎉 ALL DECISION HISTORY TRACKER TESTS PASSED SUCCESSFULLY!');
} else {
  console.error('\n❌ Failed Decision Tracker Test!');
  process.exit(1);
}
