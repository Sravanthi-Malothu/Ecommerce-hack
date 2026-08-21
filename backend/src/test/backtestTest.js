import { runBacktestEvaluation } from '../engine/backtestEngine.js';

console.log('🧪 Testing PromoAlign Backtest & Model Evaluation Engine...\n');

const datasets = ['SYNTHETIC', 'PIPELINE_8STAGE', 'VARSHITHA_ECOMMERCE', 'ROSSMANN', 'UCI_ONLINE', 'DUNNHUMBY'];

datasets.forEach((datasetId) => {
  const report = runBacktestEvaluation(datasetId);
  console.log(`✅ [${datasetId}] Benchmark:`);
  console.log(`   Dataset: ${report.datasetName}`);
  console.log(`   Evaluated Records: ${report.evaluatedRecordsCount}`);
  console.log(`   Precision@10: ${report.summaryMetrics.precisionAt10}% | Recall: ${report.summaryMetrics.recall}% | F1: ${report.summaryMetrics.f1Score}%`);
  console.log(`   MAE Redemption: ${report.summaryMetrics.maeRedemptionPct}% | MAE Margin: ${report.summaryMetrics.maeMarginPct}%`);
  console.log(`   Stockout Catch Recall: ${report.summaryMetrics.stockoutRecall}%\n`);

  if (report.summaryMetrics.precisionAt10 < 50 || report.summaryMetrics.precisionAt10 > 100) {
    throw new Error(`Precision@10 out of valid bounds for ${datasetId}`);
  }
});

console.log('🎉 ALL BACKTEST ENGINE TESTS PASSED SUCCESSFULLY!');
