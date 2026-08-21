import express from 'express';
import { processChatMessage } from '../engine/chatEngine.js';
import { generateMonthlyPerformanceData } from '../engine/monthlyPerformanceTracker.js';
import { generateDecisionHistoryData } from '../engine/decisionHistoryTracker.js';
import { generateCrossProductBundlesData } from '../engine/crossProductEngine.js';
import { runPredictiveMlAnalysis } from '../engine/predictiveMlEngine.js';
import { runPythonMlPredictiveEngine } from '../engine/pythonMlBridge.js';
import { v4 as uuidv4 } from 'uuid';
import { getDatasetById } from '../engine/datasetParser.js';
import { computePromotionMetrics } from '../engine/scoringEngine.js';
import { evaluateConstraints } from '../engine/constraintEngine.js';
import { generateExplanation } from '../engine/explanationEngine.js';
import { runBacktestEvaluation, printBacktestSummaryTable } from '../engine/backtestEngine.js';
import { MODEL_CARDS } from '../data/modelCards.js';
import { getMetricsSummary } from '../utils/telemetry.js';
import { groqBreaker, geminiBreaker } from '../engine/chatEngine.js';
import { pythonMlBreaker } from '../engine/pythonMlBridge.js';

const router = express.Router();

// In-Memory Database Store
let appState = {
  activeDatasetId: 'SYNTHETIC',
  rawDataset: null,
  recommendations: []
};

export const AVAILABLE_DATASETS = [
  { id: 'SYNTHETIC', name: '⚡ Synthetic Retail Benchmark', description: 'Pre-seeded demo edge cases (Stockout, Margin Risk, High-ROI Winner)', icon: 'Sparkles' },
  { id: 'PIPELINE_8STAGE', name: '🔄 8-Stage End-to-End Pipeline', description: 'Sequential flow (Customer → Purchase History → Product Affinity → Promo Response → Demand Forecast → Inventory → Margin → Recommendation)', icon: 'GitBranch' },
  { id: 'VARSHITHA_ECOMMERCE', name: '🛍️ varshitha1809 Ecommerce Hub', description: 'GitHub varshitha1809/Ecommerce repository dataset & transaction logs', icon: 'ShoppingBag' },
  { id: 'ROSSMANN', name: '🏬 Rossmann Store Sales Dataset', description: 'Real European store sales, store types, competition distance & Promo2 data', icon: 'Store' },
  { id: 'UCI_ONLINE', name: '🌐 Kaggle UCI Online Retail (42.9 MB)', description: 'Real e-commerce transactional invoices, stock codes, UK/EU customer segments', icon: 'Globe' },
  { id: 'DUNNHUMBY', name: '🛒 dunnhumby Complete Journey', description: 'Household grocery panel, basket IDs, retail discounts & coupon markdowns', icon: 'ShoppingBag' }
];

/**
 * Initialize / Select Recommendations Dataset
 */
export function initializeRecommendations(datasetId = 'SYNTHETIC') {
  const dataset = getDatasetById(datasetId);
  appState.activeDatasetId = datasetId;
  appState.rawDataset = dataset;
  appState.recommendations = [];

  const defaultDiscountOpts = [15, 20, 25];

  dataset.customer_segments.forEach((segment) => {
    dataset.products.forEach((product) => {
      dataset.regions.forEach((region) => {
        let discount = defaultDiscountOpts[Math.floor(Math.random() * defaultDiscountOpts.length)];

        // Seed demo edge cases for synthetic dataset
        if (datasetId === 'SYNTHETIC') {
          if (product.product_id === 'prod_running_shoes_apex' && region === 'South Region') {
            discount = 25; // Stockout risk trigger
          }
          if (product.product_id === 'prod_earbuds_wireless' && segment.segment_id === 'seg_bargain_hunters') {
            discount = 30; // Margin risk trigger
          }
          if (product.product_id === 'prod_smartwatch_pro' && region === 'North Region') {
            discount = 15; // High-ROI Winner
          }
        }

        const metrics = computePromotionMetrics(
          segment,
          product,
          region,
          discount,
          dataset.inventory,
          dataset.regional_demand_signals
        );

        const constraintEval = evaluateConstraints(segment, product, metrics);
        const explanation = generateExplanation(segment, product, region, metrics, constraintEval);

        let initialStatus = 'DRAFT';
        if (metrics.fitScore >= 85 && constraintEval.riskLevel === 'HEALTHY') {
          initialStatus = 'APPROVED';
        }

        appState.recommendations.push({
          id: `rec_${uuidv4().slice(0, 8)}`,
          product_id: product.product_id,
          product_name: product.product_name,
          category: product.category,
          subcategory: product.subcategory,
          base_price: product.base_price,
          margin_pct: product.margin_pct,

          segment_id: segment.segment_id,
          segment_name: segment.segment_name,
          segment_size: segment.size,
          last_promo_days_ago: segment.last_promo_days_ago,

          region,
          discount_pct: discount,
          status: initialStatus,
          dataset_source: dataset.dataset_name || 'Synthetic Retail Benchmark',
          notes: [],

          metrics,
          constraintEval,
          explanation
        });
      });
    });
  });

  appState.recommendations.sort((a, b) => b.metrics.fitScore - a.metrics.fitScore);
}

// Initial seed
initializeRecommendations('SYNTHETIC');

/**
 * GET /api/datasets/available
 */
router.get('/datasets/available', (req, res) => {
  res.json({
    activeDatasetId: appState.activeDatasetId,
    datasets: AVAILABLE_DATASETS
  });
});

/**
 * POST /api/datasets/select
 */
router.post('/datasets/select', (req, res) => {
  const { datasetId } = req.body;
  if (!datasetId || !AVAILABLE_DATASETS.some(d => d.id === datasetId)) {
    return res.status(400).json({ error: 'Invalid datasetId' });
  }

  initializeRecommendations(datasetId);
  res.json({
    success: true,
    activeDatasetId: appState.activeDatasetId,
    datasetName: appState.rawDataset.dataset_name || datasetId,
    totalRecommendations: appState.recommendations.length
  });
});

/**
 * GET /api/recommendations
 */
router.get('/recommendations', (req, res) => {
  const { search, region, category, riskLevel, minScore, status } = req.query;

  let results = [...appState.recommendations];

  if (search) {
    const q = search.toLowerCase();
    results = results.filter(
      (r) =>
        r.product_name.toLowerCase().includes(q) ||
        r.segment_name.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q) ||
        r.region.toLowerCase().includes(q) ||
        r.explanation.summaryRationale.toLowerCase().includes(q)
    );
  }

  if (region && region !== 'ALL') {
    results = results.filter((r) => r.region === region);
  }

  if (category && category !== 'ALL') {
    results = results.filter((r) => r.category === category);
  }

  if (riskLevel && riskLevel !== 'ALL') {
    results = results.filter((r) => r.constraintEval.riskLevel === riskLevel);
  }

  if (status && status !== 'ALL') {
    results = results.filter((r) => r.status === status);
  }

  if (minScore) {
    const scoreVal = parseInt(minScore, 10);
    if (!isNaN(scoreVal)) {
      results = results.filter((r) => r.metrics.fitScore >= scoreVal);
    }
  }

  res.json({
    activeDatasetId: appState.activeDatasetId,
    totalCount: results.length,
    recommendations: results
  });
});

/**
 * PATCH /api/recommendations/:id
 */
router.patch('/recommendations/:id', (req, res) => {
  const { id } = req.params;
  const { status, discount_pct, note } = req.body;

  const item = appState.recommendations.find((r) => r.id === id);
  if (!item) {
    return res.status(404).json({ error: 'Recommendation not found' });
  }

  if (status && ['DRAFT', 'APPROVED', 'REJECTED'].includes(status)) {
    item.status = status;
  }

  if (typeof discount_pct === 'number' && discount_pct >= 5 && discount_pct <= 50) {
    item.discount_pct = discount_pct;

    const segment = appState.rawDataset.customer_segments.find((s) => s.segment_id === item.segment_id) || appState.rawDataset.customer_segments[0];
    const product = appState.rawDataset.products.find((p) => p.product_id === item.product_id) || appState.rawDataset.products[0];

    item.metrics = computePromotionMetrics(
      segment,
      product,
      item.region,
      discount_pct,
      appState.rawDataset.inventory,
      appState.rawDataset.regional_demand_signals
    );

    item.constraintEval = evaluateConstraints(segment, product, item.metrics);
    item.explanation = generateExplanation(segment, product, item.region, item.metrics, item.constraintEval);
  }

  if (note && note.trim().length > 0) {
    item.notes.push({
      id: uuidv4(),
      text: note.trim(),
      timestamp: new Date().toISOString()
    });
  }

  res.json({ success: true, recommendation: item });
});

/**
 * POST /api/simulate
 */
router.post('/simulate', (req, res) => {
  const { product_id, segment_id, region, discount_pct } = req.body;

  const segment = appState.rawDataset.customer_segments.find((s) => s.segment_id === segment_id) || appState.rawDataset.customer_segments[0];
  const product = appState.rawDataset.products.find((p) => p.product_id === product_id) || appState.rawDataset.products[0];
  const targetRegion = region || 'North Region';
  const discount = typeof discount_pct === 'number' ? discount_pct : 20;

  const metrics = computePromotionMetrics(
    segment,
    product,
    targetRegion,
    discount,
    appState.rawDataset.inventory,
    appState.rawDataset.regional_demand_signals
  );

  const constraintEval = evaluateConstraints(segment, product, metrics);
  const explanation = generateExplanation(segment, product, targetRegion, metrics, constraintEval);

  res.json({
    product_name: product.product_name,
    segment_name: segment.segment_name,
    region: targetRegion,
    discount_pct: discount,
    metrics,
    constraintEval,
    explanation
  });
});

/**
 * GET /api/campaign/summary
 */
router.get('/campaign/summary', (req, res) => {
  const approved = appState.recommendations.filter((r) => r.status === 'APPROVED');
  const all = appState.recommendations;

  const totalIncrementalRevenue = approved.reduce((sum, r) => sum + r.metrics.projectedRevenue, 0);
  const totalMarginDollars = approved.reduce((sum, r) => sum + r.metrics.projectedMarginDollars, 0);
  const totalUnitsExposed = approved.reduce((sum, r) => sum + r.metrics.projectedUnits, 0);

  const avgMarginPct = approved.length > 0
    ? +(approved.reduce((sum, r) => sum + r.metrics.marginPctAfterDiscount, 0) / approved.length * 100).toFixed(1)
    : 0;

  const stockoutRiskCount = approved.filter((r) => r.constraintEval.riskLevel === 'STOCKOUT_RISK').length;
  const marginRiskCount = approved.filter((r) => r.constraintEval.riskLevel === 'MARGIN_RISK').length;
  const tightStockCount = approved.filter((r) => r.constraintEval.riskLevel === 'TIGHT_STOCK').length;
  const healthyCount = approved.filter((r) => r.constraintEval.riskLevel === 'HEALTHY').length;

  let penalty = (stockoutRiskCount * 25) + (marginRiskCount * 20) + (tightStockCount * 8);
  const readinessScore = Math.max(0, Math.min(100, 100 - penalty));

  const categoryBreakdownMap = {};
  approved.forEach((r) => {
    if (!categoryBreakdownMap[r.category]) {
      categoryBreakdownMap[r.category] = { category: r.category, revenue: 0, margin: 0, count: 0 };
    }
    categoryBreakdownMap[r.category].revenue += r.metrics.projectedRevenue;
    categoryBreakdownMap[r.category].margin += r.metrics.projectedMarginDollars;
    categoryBreakdownMap[r.category].count += 1;
  });

  const categoryBreakdown = Object.values(categoryBreakdownMap);

  res.json({
    activeDatasetId: appState.activeDatasetId,
    datasetName: appState.rawDataset.dataset_name || 'Synthetic Retail Benchmark',
    approvedCount: approved.length,
    totalRecommendationsCount: all.length,
    totalIncrementalRevenue,
    totalMarginDollars,
    avgMarginPct,
    totalUnitsExposed,
    readinessScore,
    riskDistribution: {
      stockoutRiskCount,
      marginRiskCount,
      tightStockCount,
      healthyCount
    },
    categoryBreakdown,
    approvedItems: approved
  });
});

/**
 * GET /api/analytics/heatmap
 */
router.get('/analytics/heatmap', (req, res) => {
  const dataset = appState.rawDataset;
  const heatmapData = [];

  const regions = dataset.regions || ['North Region', 'South Region', 'East Region', 'West Region', 'Central Region'];
  const products = dataset.products || [];

  regions.forEach((region) => {
    products.forEach((product) => {
      const invRecord = dataset.inventory.find(
        (i) => i.product_id === product.product_id && i.region === region
      );
      const demandSignal = dataset.regional_demand_signals.find(
        (s) => s.region === region && s.product_category === product.category
      );

      const demandIndex = demandSignal ? demandSignal.demand_index : 1.0;
      const stockQty = invRecord ? invRecord.stock_qty : 0;
      const daysOfSupply = invRecord ? invRecord.days_of_supply : 0;

      let status = 'HEALTHY';
      if (stockQty < product.avg_weekly_demand) {
        status = 'CRITICAL_LOW';
      } else if (stockQty > product.avg_weekly_demand * 4) {
        status = 'OVERSTOCK';
      }

      heatmapData.push({
        region,
        product_id: product.product_id,
        product_name: product.product_name,
        category: product.category,
        demandIndex,
        trendDirection: demandSignal ? demandSignal.trend_direction : 'Steady',
        stockQty,
        daysOfSupply,
        status
      });
    });
  });

  res.json({ activeDatasetId: appState.activeDatasetId, heatmap: heatmapData });
});

/**
 * GET /api/analytics/fatigue
 */
router.get('/analytics/fatigue', (req, res) => {
  const data = appState.rawDataset.customer_segments.map((s) => ({
    segment_id: s.segment_id,
    segment_name: s.segment_name,
    last_promo_days_ago: s.last_promo_days_ago,
    isFatigued: s.last_promo_days_ago < 14,
    size: s.size,
    preferred_categories: s.preferred_categories
  }));

  res.json({ activeDatasetId: appState.activeDatasetId, segmentFatigue: data });
});

/**
 * POST /api/nl-search
 */
router.post('/nl-search', (req, res) => {
  const { query } = req.body;
  if (!query) {
    return res.json({ filters: {} });
  }

  const q = query.toLowerCase();
  const filters = {};

  ['North Region', 'South Region', 'East Region', 'West Region', 'Central Region'].forEach((r) => {
    if (q.includes(r.toLowerCase()) || q.includes(r.split(' ')[0].toLowerCase())) {
      filters.region = r;
    }
  });

  ['Electronics', 'Footwear', 'Apparel', 'Home Goods', 'Beauty & Care', 'Outdoor Gear'].forEach((cat) => {
    if (q.includes(cat.toLowerCase())) {
      filters.category = cat;
    }
  });

  if (q.includes('stockout') || q.includes('out of stock') || q.includes('low stock')) {
    filters.riskLevel = 'STOCKOUT_RISK';
  } else if (q.includes('margin') || q.includes('profit')) {
    filters.riskLevel = 'MARGIN_RISK';
  } else if (q.includes('healthy') || q.includes('safe')) {
    filters.riskLevel = 'HEALTHY';
  }

  if (q.includes('high score') || q.includes('top fit') || q.includes('best')) {
    filters.minScore = 75;
  }

  res.json({ parsedQuery: query, filters });
});

/**
 * POST /api/dataset/reset
 */
router.post('/dataset/reset', (req, res) => {
  initializeRecommendations('SYNTHETIC');
  res.json({ message: 'Dataset re-seeded successfully', activeDatasetId: 'SYNTHETIC', totalCount: appState.recommendations.length });
});

/**
 * GET /api/analytics/cross-product-bundles
 * Returns cross-product bundle recommendations, attachment rates, incremental profit,
 * and AI Future Bundle Verdicts.
 */
router.get('/analytics/cross-product-bundles', (req, res) => {
  const bundlesData = generateCrossProductBundlesData();
  res.json({
    datasetName: appState.rawDataset.dataset_name,
    stats: bundlesData.stats,
    bundles: bundlesData.bundles,
    complementaryMapping: bundlesData.complementaryMapping
  });
});

/**
 * GET /api/analytics/decision-history
 * Returns historical decision logs, predicted vs. actual performance vectors, and AI future verdicts
 */
router.get('/analytics/decision-history', (req, res) => {
  const historyData = generateDecisionHistoryData();
  res.json({
    datasetName: appState.rawDataset.dataset_name,
    stats: historyData.stats,
    decisions: historyData.decisions
  });
});

/**
 * GET /api/analytics/monthly-performance
 * Returns 12-month promotion performance records, baseline vs. promoted comparisons,
 * top leaderboards, and AI feedback vectors.
 */
router.get('/analytics/monthly-performance', (req, res) => {
  const monthlyData = generateMonthlyPerformanceData();
  res.json({
    datasetName: appState.rawDataset.dataset_name,
    totalRecordsCount: monthlyData.records.length,
    leaderboards: monthlyData.leaderboards,
    records: monthlyData.records,
    feedbackScores: monthlyData.feedbackScores
  });
});

/**
 * GET /api/analytics/backtest
 * Returns comprehensive backtest & model evaluation results for active or specified dataset benchmark
 */
router.get('/analytics/backtest', (req, res) => {
  const datasetId = req.query.datasetId || appState.activeDatasetId;
  const report = runBacktestEvaluation(datasetId);
  printBacktestSummaryTable(report);
  res.json(report);
});

/**
 * GET /api/analytics/model-cards
 * Returns detailed Model Cards documentation for all 6 ML algorithms
 */
router.get('/analytics/model-cards', (req, res) => {
  res.json({ modelCards: MODEL_CARDS });
});

/**
 * GET /api/metrics
 * Returns real-time LLM telemetry metrics, latency breakdowns, estimated costs, and circuit breaker statuses
 */
router.get('/metrics', (req, res) => {
  const metrics = getMetricsSummary({
    groqBreaker,
    geminiBreaker,
    pythonMlBreaker
  });
  res.json(metrics);
});

/**
 * POST /api/analytics/run-backtest
 * Triggers an on-demand backtest evaluation run against any specified dataset
 */
router.post('/analytics/run-backtest', (req, res) => {
  const { datasetId } = req.body;
  const targetDatasetId = datasetId || appState.activeDatasetId;
  const report = runBacktestEvaluation(targetDatasetId);
  printBacktestSummaryTable(report);
  res.json({
    success: true,
    message: `Backtest evaluation executed successfully for dataset ${targetDatasetId}`,
    report
  });
});

/**
 * GET /api/pipeline
 * Returns 8-stage pipeline records and flowchart structure
 */
router.get('/pipeline', (req, res) => {
  const records = appState.rawDataset.pipeline_records || [];
  const pipelineStages = [
    { stage: 1, title: 'Customer', desc: 'Customer segment identification & persona profiling' },
    { stage: 2, title: 'Purchase History', desc: 'Recency, frequency, monetary value & historical category preferences' },
    { stage: 3, title: 'Product Affinity', desc: 'Cosine similarity & brand affinity score matching' },
    { stage: 4, title: 'Promotion Response', desc: 'Discount elasticity & estimated redemption rate modeling' },
    { stage: 5, title: 'Demand Forecast', desc: 'Regional demand index & promotional lift multiplier' },
    { stage: 6, title: 'Inventory Availability', desc: 'Store stock level checking & stockout risk evaluation' },
    { stage: 7, title: 'Margin Calculation', desc: 'Unit price markdown, post-discount margin % & margin risk floor' },
    { stage: 8, title: 'Promotion Recommendation', desc: 'Weighted fit score computation & AI plain-language rationale' }
  ];

  res.json({
    datasetName: appState.rawDataset.dataset_name,
    pipelineStages,
    totalRecords: records.length,
    sampleRecords: records.slice(0, 10)
  });
});

/**
 * POST /api/chat
 * AI Chatbot assistant query endpoint powered by Google Gemini AI
 */
router.post('/chat', async (req, res) => {
  const { message, persona } = req.body;
  
  // Calculate summary metrics on the fly for chatbot state
  const approved = appState.recommendations.filter((r) => r.status === 'APPROVED');
  const totalIncrementalRevenue = approved.reduce((sum, r) => sum + r.metrics.projectedRevenue, 0);
  const totalMarginDollars = approved.reduce((sum, r) => sum + r.metrics.projectedMarginDollars, 0);
  const avgMarginPct = approved.length > 0
    ? +(approved.reduce((sum, r) => sum + r.metrics.marginPctAfterDiscount, 0) / approved.length * 100).toFixed(1)
    : 0;

  const stockoutRiskCount = approved.filter((r) => r.constraintEval.riskLevel === 'STOCKOUT_RISK').length;
  const marginRiskCount = approved.filter((r) => r.constraintEval.riskLevel === 'MARGIN_RISK').length;
  const tightStockCount = approved.filter((r) => r.constraintEval.riskLevel === 'TIGHT_STOCK').length;
  let penalty = (stockoutRiskCount * 25) + (marginRiskCount * 20) + (tightStockCount * 8);
  const readinessScore = Math.max(0, Math.min(100, 100 - penalty));

  const summary = {
    totalIncrementalRevenue,
    totalMarginDollars,
    avgMarginPct,
    approvedCount: approved.length,
    totalRecommendationsCount: appState.recommendations.length,
    readinessScore
  };

  const response = await processChatMessage(message, persona, {
    recommendations: appState.recommendations,
    summary,
    datasetName: appState.rawDataset.dataset_name,
    kaggleStats: appState.rawDataset.kaggle_stats || null
  });

  res.json({
    id: uuidv4(),
    timestamp: new Date().toISOString(),
    response
  });
});

/**
 * POST /api/ml/predict
 * Executes 6 Predictive ML Algorithms in Python via Python ML Bridge
 */
router.post('/ml/predict', async (req, res) => {
  const inputs = req.body || {};
  const mlResults = await runPythonMlPredictiveEngine(inputs);
  res.json({
    timestamp: new Date().toISOString(),
    datasetName: appState.rawDataset.dataset_name,
    results: mlResults
  });
});

export default router;
