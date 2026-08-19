import { generateFullDataset, CUSTOMER_SEGMENTS, PRODUCTS } from '../data/syntheticGenerator.js';
import { computePromotionMetrics } from '../engine/scoringEngine.js';
import { evaluateConstraints } from '../engine/constraintEngine.js';
import { generateExplanation } from '../engine/explanationEngine.js';

console.log('🧪 Running PromoAlign Engine Tests...');

// Test 1: Synthetic Dataset Generation
const dataset = generateFullDataset();
console.log(`✅ Synthetic dataset generated:
  - Customer Segments: ${dataset.customer_segments.length}
  - Products: ${dataset.products.length}
  - Inventory Records: ${dataset.inventory.length}
  - Regional Demand Signals: ${dataset.regional_demand_signals.length}
`);

// Test 2: Stockout Risk Case Verification
const runningShoes = PRODUCTS.find((p) => p.product_id === 'prod_running_shoes_apex');
const fitnessSegment = CUSTOMER_SEGMENTS.find((s) => s.segment_id === 'seg_urban_fitness');

const stockoutMetrics = computePromotionMetrics(
  fitnessSegment,
  runningShoes,
  'South Region',
  25, // 25% discount
  dataset.inventory,
  dataset.regional_demand_signals
);

const stockoutConstraints = evaluateConstraints(fitnessSegment, runningShoes, stockoutMetrics);
const stockoutExplanation = generateExplanation(fitnessSegment, runningShoes, 'South Region', stockoutMetrics, stockoutConstraints);

console.log('🔴 Demo Case 1 (Stockout Risk Catch):', {
  product: runningShoes.product_name,
  region: 'South Region',
  stockQty: stockoutMetrics.stockQty,
  projectedDemandUnits: stockoutMetrics.projectedUnits,
  fitScore: stockoutMetrics.fitScore,
  riskLevel: stockoutConstraints.riskLevel,
  badge: stockoutConstraints.flags[0].badge,
  rationale: stockoutExplanation.summaryRationale
});

if (stockoutConstraints.riskLevel !== 'STOCKOUT_RISK') {
  console.error('❌ Failed Stockout Risk Catch Test!');
  process.exit(1);
} else {
  console.log('✅ Stockout Risk Catch Test Passed!');
}

// Test 3: Margin Erosion Case Verification
const earbuds = PRODUCTS.find((p) => p.product_id === 'prod_earbuds_wireless');
const bargainSegment = CUSTOMER_SEGMENTS.find((s) => s.segment_id === 'seg_bargain_hunters');

const marginMetrics = computePromotionMetrics(
  bargainSegment,
  earbuds,
  'Central Region',
  30, // 30% discount on 18% margin product
  dataset.inventory,
  dataset.regional_demand_signals
);

const marginConstraints = evaluateConstraints(bargainSegment, earbuds, marginMetrics);
console.log('\n🟠 Demo Case 2 (Margin Risk Catch):', {
  product: earbuds.product_name,
  discount: '30%',
  marginPctAfterDiscount: `${(marginMetrics.marginPctAfterDiscount * 100).toFixed(1)}%`,
  riskLevel: marginConstraints.riskLevel,
  badge: marginConstraints.flags[0].badge
});

if (marginConstraints.riskLevel !== 'MARGIN_RISK') {
  console.error('❌ Failed Margin Risk Catch Test!');
  process.exit(1);
} else {
  console.log('✅ Margin Risk Catch Test Passed!');
}

// Test 4: Winner Case Verification
const smartwatch = PRODUCTS.find((p) => p.product_id === 'prod_smartwatch_pro');
const winnerMetrics = computePromotionMetrics(
  fitnessSegment,
  smartwatch,
  'North Region',
  15,
  dataset.inventory,
  dataset.regional_demand_signals
);

const winnerConstraints = evaluateConstraints(fitnessSegment, smartwatch, winnerMetrics);
console.log('\n🟢 Demo Case 3 (High-ROI Winner):', {
  product: smartwatch.product_name,
  fitScore: winnerMetrics.fitScore,
  incrementalRev: `$${winnerMetrics.projectedRevenue.toLocaleString()}`,
  marginPct: `${(winnerMetrics.marginPctAfterDiscount * 100).toFixed(1)}%`,
  riskLevel: winnerConstraints.riskLevel
});

if (winnerMetrics.fitScore < 80 || winnerConstraints.riskLevel !== 'HEALTHY') {
  console.error('❌ Failed Winner Test!');
  process.exit(1);
} else {
  console.log('✅ High-ROI Winner Test Passed!');
}

console.log('\n🎉 ALL BACKEND ENGINE TESTS PASSED SUCCESSFULLY!');
