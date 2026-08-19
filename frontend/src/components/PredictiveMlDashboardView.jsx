import React, { useState, useEffect } from 'react';
import { 
  Brain, Sliders, TrendingUp, Cpu, PieChart, Layers, 
  Zap, Award, DollarSign, Activity, CheckCircle2, AlertTriangle, ShieldCheck
} from 'lucide-react';
import { 
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, 
  ResponsiveContainer, CartesianGrid, Legend, RadialBarChart, RadialBar
} from 'recharts';

export default function PredictiveMlDashboardView() {
  // Interactive Simulation Controls State
  const [discountPct, setDiscountPct] = useState(20);
  const [sensitivity, setSensitivity] = useState(0.55);
  const [basePrice, setBasePrice] = useState(150);
  const [unitCost, setUnitCost] = useState(75);
  const [recencyDays, setRecencyDays] = useState(12);
  const [frequencyMonthly, setFrequencyMonthly] = useState(2.4);

  // ML Analysis State
  const [mlData, setMlData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch ML Predictions from backend
  const fetchMlPredictions = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5001/api/ml/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          discountPct,
          sensitivity,
          basePrice,
          unitCost,
          recencyDays,
          frequencyMonthly
        })
      });
      const data = await res.json();
      setMlData(data.results);
    } catch (err) {
      console.error('Error fetching ML predictions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMlPredictions();
  }, [discountPct, sensitivity, basePrice, unitCost, recencyDays, frequencyMonthly]);

  if (!mlData) {
    return (
      <div className="p-8 text-center text-slate-500 flex items-center justify-center gap-2">
        <Cpu className="w-5 h-5 animate-spin text-indigo-600" />
        Running Predictive Machine Learning Engine...
      </div>
    );
  }

  const { elasticity, similarity, apriori, shap, rfm } = mlData;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="saas-card bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white p-6 sm:p-8 rounded-2xl relative overflow-hidden shadow-xl border border-indigo-800/40">
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-3">
              <Brain className="w-3.5 h-3.5 text-indigo-400" />
              PromoAlign Machine Learning Engine
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Predictive ML Algorithms &amp; Simulation Playground
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Simulate 6 predictive ML models: Sigmoidal Price Elasticity, Cosine Similarity Vectors, Apriori Market Basket Co-Purchases, SHAP Feature Attribution, RFM Clustering, and Constraint Satisfaction.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/15 shrink-0">
            <Activity className="w-8 h-8 text-emerald-400" />
            <div>
              <span className="text-[11px] text-slate-300 uppercase tracking-wider font-bold">Predicted Lift</span>
              <div className="text-xl font-black text-white">+{elasticity.liftMultiplier}x Lift</div>
              <span className="text-[10px] text-emerald-300 font-semibold">+₹{elasticity.netProfit.toLocaleString('en-IN')} Profit</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Controls & Key Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ML Simulator Control Panel */}
        <div className="saas-card p-5 bg-white space-y-4 border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-600" />
              Predictive ML Model Controls
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-600 border border-indigo-100">Live Simulation</span>
          </div>

          {/* Discount Slider */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
              <span>Promotional Discount Depth</span>
              <span className="text-indigo-600 font-bold">{discountPct}% OFF</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              step="5"
              value={discountPct}
              onChange={(e) => setDiscountPct(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>0% Baseline</span>
              <span>25% Standard</span>
              <span>50% Clearance</span>
            </div>
          </div>

          {/* Price Sensitivity Slider */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
              <span>Customer Price Sensitivity (\(\epsilon\))</span>
              <span className="text-indigo-600 font-bold">{sensitivity}</span>
            </div>
            <input
              type="range"
              min="0.20"
              max="0.95"
              step="0.05"
              value={sensitivity}
              onChange={(e) => setSensitivity(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>0.20 (VIP Premium)</span>
              <span>0.95 (Bargain Hunter)</span>
            </div>
          </div>

          {/* Base Price & Unit Cost */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">Base Price (₹)</label>
              <input
                type="number"
                value={basePrice}
                onChange={(e) => setBasePrice(Number(e.target.value))}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-800"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">Unit Cost (₹)</label>
              <input
                type="number"
                value={unitCost}
                onChange={(e) => setUnitCost(Number(e.target.value))}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-800"
              />
            </div>
          </div>

          {/* Recency & Frequency Controls */}
          <div className="pt-2 border-t border-slate-100 space-y-3">
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>Customer Recency (Days Ago)</span>
                <span className="text-indigo-600 font-bold">{recencyDays} Days</span>
              </div>
              <input
                type="range"
                min="1"
                max="60"
                value={recencyDays}
                onChange={(e) => setRecencyDays(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>Order Frequency (Orders/Mo)</span>
                <span className="text-indigo-600 font-bold">{frequencyMonthly} / mo</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="8.0"
                step="0.5"
                value={frequencyMonthly}
                onChange={(e) => setFrequencyMonthly(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>
          </div>
        </div>

        {/* Algorithm Summary Cards (2 Cols) */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Card 1: Sigmoidal Price Elasticity */}
          <div className="saas-card p-5 bg-white border border-slate-200/80 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" />
                1. Price Elasticity of Demand
              </span>
              <span className="text-xs font-black text-slate-900">{elasticity.marginPct}% Margin</span>
            </div>
            <div className="text-2xl font-black text-slate-900">
              {elasticity.predictedUnits} <span className="text-xs font-normal text-slate-500">Units (+{elasticity.liftMultiplier}x)</span>
            </div>
            <div className="text-xs text-slate-600">
              Post-Discount Price: <strong className="text-slate-900">₹{elasticity.discountedPrice}</strong>
            </div>
            <div className="pt-2 border-t border-slate-100 flex justify-between text-xs">
              <span className="text-slate-500">Gross Revenue: <strong className="text-indigo-950">₹{elasticity.grossRevenue.toLocaleString('en-IN')}</strong></span>
              <span className="text-emerald-600 font-bold">Net Profit: +₹{elasticity.netProfit.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Card 2: Cosine Similarity Vector */}
          <div className="saas-card p-5 bg-white border border-slate-200/80 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5" />
                2. Cosine Vector Similarity
              </span>
              <span className="text-xs font-black text-emerald-600">{similarity.affinityScorePct}% Match</span>
            </div>
            <div className="text-2xl font-black text-slate-900">
              {similarity.cosineSimilarity} <span className="text-xs font-normal text-slate-500">Cos Score</span>
            </div>
            <div className="text-xs text-slate-600">
              Segment Vector Dot Product: <strong className="text-slate-900">{similarity.dotProduct}</strong>
            </div>
            <div className="pt-2 border-t border-slate-100 text-xs text-slate-500 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              Optimal Segment-Product Alignment Confirmed
            </div>
          </div>

          {/* Card 3: Apriori Market Basket */}
          <div className="saas-card p-5 bg-white border border-slate-200/80 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5" />
                3. Apriori Market Basket
              </span>
              <span className="text-xs font-black text-indigo-600">{apriori.liftRatio}x Lift</span>
            </div>
            <div className="text-2xl font-black text-slate-900">
              {apriori.attachmentRatePct}% <span className="text-xs font-normal text-slate-500">Attachment Rate</span>
            </div>
            <div className="text-xs text-slate-600">
              Support: <strong>{apriori.supportPct}%</strong> | Confidence: <strong>{apriori.confidencePct}%</strong>
            </div>
            <div className="pt-2 border-t border-slate-100 flex justify-between text-xs">
              <span className="text-slate-500">Baseline: ₹{apriori.baselineProfit.toLocaleString('en-IN')}</span>
              <span className="text-emerald-600 font-bold">Bundle Boost: +₹{apriori.incrementalProfit.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Card 4: RFM Clustering & LTV */}
          <div className="saas-card p-5 bg-white border border-slate-200/80 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 flex items-center gap-1">
                <Award className="w-3.5 h-3.5" />
                4. RFM Clustering &amp; LTV
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100">
                Score: {rfm.rfmCode}
              </span>
            </div>
            <div className="text-lg font-black text-slate-900 truncate">
              {rfm.segmentCluster}
            </div>
            <div className="text-xs text-slate-600">
              Recency: <strong>R{rfm.rScore}</strong> | Frequency: <strong>F{rfm.fScore}</strong> | Monetary: <strong>M{rfm.mScore}</strong>
            </div>
            <div className="pt-2 border-t border-slate-100 flex justify-between text-xs">
              <span className="text-slate-500">Predicted 3-Yr LTV:</span>
              <strong className="text-indigo-900">₹{rfm.estimatedLtv.toLocaleString('en-IN')}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Recharts Chart 1: Sigmoidal Price Elasticity & Demand Spectrum */}
      <div className="saas-card p-6 bg-white border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
              Sigmoidal Price Elasticity &amp; Demand Spectrum (0% – 50% Discount)
            </h3>
            <p className="text-xs text-slate-500">
              Visualizes predicted sales volume units, gross revenue, and net profit as discount depth varies.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="px-2.5 py-1 rounded-lg font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
              Selected: {discountPct}% OFF
            </span>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={elasticity.curvePoints} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="discountPct" tick={{ fontSize: 11, fill: '#64748b' }} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`} />
              <Tooltip 
                formatter={(val, name) => [typeof val === 'number' ? `₹${val.toLocaleString('en-IN')}` : val, name]}
                contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Area type="monotone" dataKey="GrossRevenue" name="Gross Revenue (₹)" stroke="#6366f1" fillOpacity={1} fill="url(#colorRev)" strokeWidth={2.5} />
              <Area type="monotone" dataKey="NetProfit" name="Net Profit (₹)" stroke="#10b981" fillOpacity={1} fill="url(#colorProfit)" strokeWidth={2.5} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recharts Chart 2 & 3: SHAP Attribution & Apriori Bundle Profit */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SHAP Waterfall Attribution Bar Chart */}
        <div className="saas-card p-6 bg-white border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <PieChart className="w-5 h-5 text-indigo-600" />
              SHAP Feature Attribution Decomposition
            </h3>
            <span className="text-xs font-black text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100">
              Total Fit: {shap.totalFitScore}/100
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={shap.shapWaterfalls} layout="vertical" margin={{ top: 5, right: 20, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis dataKey="feature" type="category" tick={{ fontSize: 10, fill: '#475569' }} width={140} />
                <Tooltip formatter={(val) => [`+${val} Points`, 'SHAP Value']} />
                <Bar dataKey="contribution" name="Shapley Contribution" fill="#6366f1" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Apriori Single vs. Bundled Profit Chart */}
        <div className="saas-card p-6 bg-white border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-600" />
              Apriori Co-Purchase Bundle Profit Lift
            </h3>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
              +₹{apriori.incrementalProfit.toLocaleString('en-IN')} Lift
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { name: 'Standalone Single Product', NetProfit: apriori.baselineProfit },
                { name: 'Apriori Cross-Product Bundle', NetProfit: apriori.bundledProfit }
              ]} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(val) => [`₹${val.toLocaleString('en-IN')}`, 'Net Profit']} />
                <Bar dataKey="NetProfit" name="Net Profit (₹)" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
