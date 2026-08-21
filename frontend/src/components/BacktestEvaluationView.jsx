import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Award,
  TrendingUp,
  Brain,
  Sparkles,
  PackagePlus,
  Users,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sliders,
  ChevronDown,
  ChevronUp,
  Info,
  Layers,
  Search,
  Activity,
  FileText
} from 'lucide-react';
import { API_BASE } from '../utils/apiConfig';

export default function BacktestEvaluationView() {
  const [activeDatasetId, setActiveDatasetId] = useState('SYNTHETIC');
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSubTab, setActiveSubTab] = useState('EVALUATION'); // 'EVALUATION', 'PER_MODEL', 'MODEL_CARDS', 'BENCHMARKS'
  const [selectedModelCardId, setSelectedModelCardId] = useState('elasticity');
  const [modelSearch, setModelSearch] = useState('');

  const fetchBacktestData = async (datasetId = activeDatasetId) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/analytics/backtest?datasetId=${datasetId}`);
      const data = await res.json();
      setReport(data);
    } catch (err) {
      console.error('Error fetching backtest evaluation:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBacktestData(activeDatasetId);
  }, [activeDatasetId]);

  const handleRunBacktest = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/analytics/run-backtest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ datasetId: activeDatasetId })
      });
      const data = await res.json();
      if (data.report) {
        setReport(data.report);
      }
    } catch (err) {
      console.error('Failed to run on-demand backtest:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!report || loading) {
    return (
      <div className="saas-card p-16 text-center space-y-4 my-8 max-w-5xl mx-auto">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <h3 className="text-base font-bold text-slate-900">Running Backtesting & Evaluation Suite...</h3>
        <p className="text-xs text-slate-500">
          Comparing predicted redemption, post-promo margin, and fit scores against ground-truth outcomes across {activeDatasetId} dataset.
        </p>
      </div>
    );
  }

  const {
    datasetName,
    _evaluatedRecordsCount,
    summaryMetrics,
    confusionMatrix,
    modelAccuracyBreakdown,
    datasetBenchmarks,
    modelCards
  } = report;

  const filteredModelCards = (modelCards || []).filter((card) =>
    card.name.toLowerCase().includes(modelSearch.toLowerCase()) ||
    card.category.toLowerCase().includes(modelSearch.toLowerCase())
  );

  const selectedModelCard = (modelCards || []).find((c) => c.id === selectedModelCardId) || modelCards[0];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-sans">
      
      {/* Top Hero Banner */}
      <div className="saas-card bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl relative overflow-hidden shadow-xl border border-indigo-800/40">
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-3">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              PromoAlign Model Validation & Evaluation Module
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Backtesting & Model Evaluation Suite
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Evaluates promotional predictions against actual ground-truth outcomes using Precision@k ranking metrics, continuous MAE/RMSE error, and standardized Model Cards.
            </p>
          </div>

          {/* Dataset Selector & Backtest Trigger */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <select
              value={activeDatasetId}
              onChange={(e) => setActiveDatasetId(e.target.value)}
              className="bg-white/10 text-white border border-white/20 rounded-xl px-3.5 py-2.5 text-xs font-bold focus:outline-hidden focus:ring-2 focus:ring-indigo-400 cursor-pointer"
            >
              <option value="SYNTHETIC" className="bg-slate-900 text-white">⚡ Synthetic Benchmark</option>
              <option value="PIPELINE_8STAGE" className="bg-slate-900 text-white">🔄 8-Stage Pipeline</option>
              <option value="VARSHITHA_ECOMMERCE" className="bg-slate-900 text-white">🛍️ varshitha1809 Hub</option>
              <option value="ROSSMANN" className="bg-slate-900 text-white">🏬 Rossmann Store Sales</option>
              <option value="UCI_ONLINE" className="bg-slate-900 text-white">🌐 Kaggle UCI Retail</option>
              <option value="DUNNHUMBY" className="bg-slate-900 text-white">🛒 dunnhumby Journey</option>
            </select>

            <button
              onClick={handleRunBacktest}
              disabled={loading}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              Run Backtest
            </button>
          </div>
        </div>
      </div>

      {/* 4 Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="saas-card p-5 bg-white border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Precision @ 10</span>
            <div className="text-2xl font-black text-slate-900 mt-1">{summaryMetrics.precisionAt10}%</div>
            <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
              <CheckCircle2 className="w-3 h-3" /> Top 10 Approval Fit
            </span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">
            @10
          </div>
        </div>

        <div className="saas-card p-5 bg-white border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">F1-Score / Recall</span>
            <div className="text-2xl font-black text-slate-900 mt-1">{summaryMetrics.f1Score}%</div>
            <span className="text-[11px] text-indigo-600 font-semibold mt-0.5">Recall: {summaryMetrics.recall}%</span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
        </div>

        <div className="saas-card p-5 bg-white border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Redemption MAE / RMSE</span>
            <div className="text-2xl font-black text-slate-900 mt-1">{summaryMetrics.maeRedemptionPct}%</div>
            <span className="text-[11px] text-slate-500 font-medium">RMSE: {summaryMetrics.rmseRedemptionPct}%</span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Activity className="w-5 h-5" />
          </div>
        </div>

        <div className="saas-card p-5 bg-white border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Stockout Catch Recall</span>
            <div className="text-2xl font-black text-emerald-600 mt-1">{summaryMetrics.stockoutRecall}%</div>
            <span className="text-[11px] text-emerald-700 font-semibold mt-0.5">Operational Risk Mitigation</span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-slate-200 bg-white p-1 rounded-2xl border">
        <button
          onClick={() => setActiveSubTab('EVALUATION')}
          className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeSubTab === 'EVALUATION' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Award className="w-4 h-4" /> Metric Evaluation &amp; Confusion Matrix
        </button>

        <button
          onClick={() => setActiveSubTab('PER_MODEL')}
          className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeSubTab === 'PER_MODEL' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Brain className="w-4 h-4" /> Per-Model Accuracy Matrix
        </button>

        <button
          onClick={() => setActiveSubTab('MODEL_CARDS')}
          className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeSubTab === 'MODEL_CARDS' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileText className="w-4 h-4" /> Model Cards Explorer
        </button>

        <button
          onClick={() => setActiveSubTab('BENCHMARKS')}
          className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeSubTab === 'BENCHMARKS' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Layers className="w-4 h-4" /> Dataset Benchmarks
        </button>
      </div>

      {/* SUB-TAB 1: EVALUATION & CONFUSION MATRIX */}
      {activeSubTab === 'EVALUATION' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Confusion Matrix Card */}
            <div className="saas-card p-6 bg-white border border-slate-200/80 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                Binary Classification Confusion Matrix
              </h3>
              
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
                  <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">True Positives (TP)</span>
                  <div className="text-2xl font-black text-emerald-700 mt-1">{confusionMatrix.truePositives}</div>
                  <span className="text-[10px] text-emerald-600 font-medium">Approved &amp; High ROI</span>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-center">
                  <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">False Positives (FP)</span>
                  <div className="text-2xl font-black text-amber-700 mt-1">{confusionMatrix.falsePositives}</div>
                  <span className="text-[10px] text-amber-600 font-medium">Approved but Risk/Low ROI</span>
                </div>

                <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-center">
                  <span className="text-[10px] font-bold text-red-800 uppercase tracking-wider">False Negatives (FN)</span>
                  <div className="text-2xl font-black text-red-700 mt-1">{confusionMatrix.falseNegatives}</div>
                  <span className="text-[10px] text-red-600 font-medium">Rejected but Good ROI</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 text-center">
                  <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">True Negatives (TN)</span>
                  <div className="text-2xl font-black text-slate-800 mt-1">{confusionMatrix.trueNegatives}</div>
                  <span className="text-[10px] text-slate-500 font-medium">Rejected &amp; Correct Risk</span>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-600 space-y-1 font-mono">
                <div className="flex justify-between"><span>Precision:</span><strong className="text-slate-900">{summaryMetrics.precision}%</strong></div>
                <div className="flex justify-between"><span>Recall:</span><strong className="text-slate-900">{summaryMetrics.recall}%</strong></div>
                <div className="flex justify-between"><span>F1-Score:</span><strong className="text-indigo-600 font-black">{summaryMetrics.f1Score}%</strong></div>
              </div>
            </div>

            {/* Precision@k Ranking Chart & Errors */}
            <div className="lg:col-span-2 saas-card p-6 bg-white border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Award className="w-4 h-4 text-indigo-600" />
                  Precision @ K Campaign Recommendation Ranking
                </h3>
                <span className="text-xs text-slate-400 font-medium">Dataset: {datasetName}</span>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 text-center">
                  <span className="text-[10px] font-bold text-indigo-800 uppercase tracking-wider">Precision @ 5</span>
                  <div className="text-xl font-black text-indigo-700 mt-0.5">{summaryMetrics.precisionAt5}%</div>
                </div>
                <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 text-center">
                  <span className="text-[10px] font-bold text-indigo-800 uppercase tracking-wider">Precision @ 10</span>
                  <div className="text-xl font-black text-indigo-700 mt-0.5">{summaryMetrics.precisionAt10}%</div>
                </div>
                <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 text-center">
                  <span className="text-[10px] font-bold text-indigo-800 uppercase tracking-wider">Precision @ 20</span>
                  <div className="text-xl font-black text-indigo-700 mt-0.5">{summaryMetrics.precisionAt20}%</div>
                </div>
              </div>

              {/* Continuous Errors Summary */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Continuous Forecast Accuracy (MAE / RMSE)</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                    <span className="text-slate-500 text-[10px]">Redemption Rate Error</span>
                    <div className="font-bold text-slate-900 mt-0.5">MAE: {summaryMetrics.maeRedemptionPct}% | RMSE: {summaryMetrics.rmseRedemptionPct}%</div>
                  </div>
                  <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                    <span className="text-slate-500 text-[10px]">Post-Discount Margin Error</span>
                    <div className="font-bold text-slate-900 mt-0.5">MAE: {summaryMetrics.maeMarginPct}% | RMSE: {summaryMetrics.rmseMarginPct}%</div>
                  </div>
                  <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                    <span className="text-slate-500 text-[10px]">Revenue Lift Error</span>
                    <div className="font-bold text-slate-900 mt-0.5">MAE: ₹{summaryMetrics.maeRevenue.toLocaleString('en-IN')}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tradeoff Explanation Rationale Callout Card */}
          <div className="p-5 bg-gradient-to-r from-indigo-50 via-white to-indigo-50/40 rounded-2xl border border-indigo-200/80 shadow-xs flex items-start gap-4">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md">
              <Info className="w-5 h-5" />
            </div>
            <div className="space-y-1.5 text-xs text-slate-700">
              <h4 className="font-bold text-slate-900 text-sm">💡 Technical Tradeoff Rationale: Precision@k vs. Plain Classification Accuracy</h4>
              <p>
                In retail promotion planning, merchandising teams operate under strict execution constraints (e.g. launching top 10-20 campaigns per week).
                Standard classification accuracy can be misleading due to heavy class imbalance (most candidate product-segment pairs are not promoted).
                <strong>Precision@k</strong> measures the exact proportion of top-ranked recommendations that generate positive net ROI without triggering supply chain stockouts or margin erosion.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: PER-MODEL ACCURACY MATRIX */}
      {activeSubTab === 'PER_MODEL' && (
        <div className="space-y-6">
          <div className="saas-card p-6 bg-white border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Brain className="w-4 h-4 text-indigo-600" />
              Per-Model Accuracy &amp; Benchmark Metrics (6 ML Models)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
              {modelAccuracyBreakdown.map((m) => (
                <div key={m.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800 uppercase tracking-wider">
                      {m.badge}
                    </span>
                    <span className="text-xs font-bold text-emerald-700">{m.accuracyPct}% Score</span>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{m.name}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">{m.metricLabel}: <strong className="text-slate-800">{m.score}</strong></p>
                  </div>

                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, m.accuracyPct)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: MODEL CARDS EXPLORER */}
      {activeSubTab === 'MODEL_CARDS' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search Model Cards by name or category..."
                value={modelSearch}
                onChange={(e) => setModelSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="text-xs font-bold text-slate-500 shrink-0">
              Showing {filteredModelCards.length} of {modelCards.length} Model Cards
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Model List */}
            <div className="space-y-2">
              {filteredModelCards.map((card) => (
                <div
                  key={card.id}
                  onClick={() => setSelectedModelCardId(card.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    selectedModelCard.id === card.id
                      ? 'bg-indigo-900 text-white border-indigo-900 shadow-md'
                      : 'bg-white text-slate-900 border-slate-200 hover:border-indigo-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      selectedModelCard.id === card.id ? 'bg-indigo-700 text-indigo-100' : 'bg-slate-100 text-slate-700'
                    }`}>
                      v{card.version}
                    </span>
                    <span className={`text-[11px] font-bold ${
                      selectedModelCard.id === card.id ? 'text-emerald-300' : 'text-emerald-700'
                    }`}>
                      {card.performanceMetrics.f1Score} F1
                    </span>
                  </div>
                  <h4 className="text-xs font-bold mt-2">{card.name}</h4>
                  <p className={`text-[11px] mt-1 line-clamp-1 ${
                    selectedModelCard.id === card.id ? 'text-indigo-200' : 'text-slate-500'
                  }`}>
                    {card.category}
                  </p>
                </div>
              ))}
            </div>

            {/* Right Active Model Card Details */}
            <div className="lg:col-span-2 saas-card p-6 bg-white border border-slate-200 shadow-sm space-y-6">
              <div className="border-b border-slate-100 pb-4 flex items-start justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-2">
                    {selectedModelCard.badge}
                  </div>
                  <h2 className="text-lg font-black text-slate-900">{selectedModelCard.name}</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Version {selectedModelCard.version} • Category: {selectedModelCard.category}</p>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-2xl font-black text-indigo-600">{selectedModelCard.performanceMetrics.f1Score}</div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">F1 Evaluation Score</span>
                </div>
              </div>

              <div className="space-y-4 text-xs text-slate-700">
                <div>
                  <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] text-indigo-600 mb-1">Model Description</h4>
                  <p className="bg-slate-50 p-3 rounded-xl border border-slate-200">{selectedModelCard.description}</p>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] text-indigo-600 mb-1">What It Predicts</h4>
                  <ul className="list-disc pl-4 space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-200">
                    {selectedModelCard.whatItPredicts.map((pred, i) => (
                      <li key={i}>{pred}</li>
                    ))}
                  </ul>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] text-indigo-600 mb-1">Key Assumptions</h4>
                    <ul className="list-disc pl-4 space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-200">
                      {selectedModelCard.keyAssumptions.map((ass, i) => (
                        <li key={i}>{ass}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] text-red-600 mb-1">Known Failure Modes</h4>
                    <ul className="list-disc pl-4 space-y-1 bg-red-50/50 p-3 rounded-xl border border-red-200 text-red-900">
                      {selectedModelCard.knownFailureModes.map((fail, i) => (
                        <li key={i}>{fail}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] text-indigo-600 mb-1">Ideal Input Ranges</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
                    {Object.entries(selectedModelCard.idealInputRanges).map(([key, val]) => (
                      <div key={key} className="p-2 bg-white rounded-lg border border-slate-200 text-center">
                        <span className="text-[10px] text-slate-400 capitalize">{key}</span>
                        <div className="font-bold text-slate-900 mt-0.5">{val}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: MULTI-DATASET BENCHMARKS */}
      {activeSubTab === 'BENCHMARKS' && (
        <div className="saas-card p-6 bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-600" />
              Multi-Dataset Comparative Benchmark Matrix
            </h3>
            <span className="text-xs text-slate-400">6 Supported Retail Datasets</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                  <th className="p-3">Dataset Benchmark</th>
                  <th className="p-3">Precision @ 10</th>
                  <th className="p-3">MAE Redemption</th>
                  <th className="p-3">F1 Score</th>
                  <th className="p-3">Overall Accuracy</th>
                  <th className="p-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {datasetBenchmarks.map((bm) => (
                  <tr key={bm.id} className={bm.id === activeDatasetId ? 'bg-indigo-50/50 font-bold' : 'hover:bg-slate-50'}>
                    <td className="p-3 text-slate-900 flex items-center gap-2">
                      {bm.name}
                      {bm.id === activeDatasetId && (
                        <span className="text-[10px] px-2 py-0.5 bg-indigo-600 text-white rounded-md uppercase font-bold">Active</span>
                      )}
                    </td>
                    <td className="p-3 text-indigo-700 font-bold">{bm.precisionAt10}%</td>
                    <td className="p-3 text-slate-700">{bm.maeRedemption}</td>
                    <td className="p-3 text-slate-900 font-bold">{bm.f1Score}%</td>
                    <td className="p-3 text-emerald-700 font-bold">{bm.overallAccuracy}%</td>
                    <td className="p-3 text-right">
                      <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                        Validated
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
