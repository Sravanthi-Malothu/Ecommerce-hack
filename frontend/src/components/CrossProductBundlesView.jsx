import React, { useState, useEffect } from 'react';
import {
  PackagePlus,
  Sparkles,
  TrendingUp,
  Percent,
  Filter,
  DollarSign,
  ShieldCheck,
  ShoppingBag,
  Award
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';

export default function CrossProductBundlesView() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [selectedAnchorId, setSelectedAnchorId] = useState('prod_smartwatch_pro');
  const [verdictFilter, setVerdictFilter] = useState('ALL');
  const [onlyChampions, setOnlyChampions] = useState(false);

  useEffect(() => {
    const fetchBundlesData = async () => {
      try {
        setLoading(true);
        const res = await fetch('http://localhost:5001/api/analytics/cross-product-bundles');
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error('Failed to fetch cross product bundles data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBundlesData();
  }, []);

  if (loading || !data) {
    return (
      <div className="saas-card p-16 text-center space-y-4 my-8">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <h3 className="text-base font-bold text-slate-900">Calculating Cross-Product Promotion &amp; Uplift Learning Engine...</h3>
        <p className="text-xs text-slate-500">Mapping complementary co-purchase affinities, attachment rates, and incremental profit vectors.</p>
      </div>
    );
  }

  const { stats, bundles } = data;

  // Selected Anchor Product Bundle details
  const activeBundle = bundles.find(b => b.anchorProductId === selectedAnchorId) || bundles[0];

  let filteredBundles = [...bundles];
  if (onlyChampions) {
    filteredBundles = filteredBundles.filter(b => b.aiVerdict.repeatRecommendation === 'RECOMMENDED_FOR_FUTURE');
  }
  if (verdictFilter !== 'ALL') {
    filteredBundles = filteredBundles.filter(b => b.aiVerdict.repeatRecommendation === verdictFilter);
  }

  // Chart data comparing Baseline Profit vs Bundled Profit
  const chartData = bundles.slice(0, 8).map(b => ({
    name: b.anchorProductName.length > 18 ? b.anchorProductName.slice(0, 18) + '...' : b.anchorProductName,
    BaselineProfit: b.baselineProfit,
    BundledProfit: b.promotedProfit
  }));

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="saas-card p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <PackagePlus className="w-5 h-5 text-indigo-400" />
            <h2 className="text-xl font-extrabold text-white tracking-tight font-sans">
              Cross-Product Promotion &amp; Uplift Learning Engine
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              17 Historical Product Learning Records
            </span>
          </div>
          <p className="text-xs text-slate-300">
            Identifies complementary co-purchased products (e.g. *Smartwatch + Charger + Case*), measures attachment rates and incremental profit boost, and recommends high-productivity product combinations to repeat in future promotions.
          </p>
        </div>

        {/* Action Button: Filter High-Productivity Champions */}
        <button
          onClick={() => setOnlyChampions(!onlyChampions)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all shadow-md active:scale-95 border shrink-0 ${
            onlyChampions
              ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-extrabold'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white border-indigo-500'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>{onlyChampions ? 'Showing ⚡ High-Productivity Champions Only' : 'Filter ⚡ High-Productivity Champions'}</span>
        </button>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="saas-card p-5 border-emerald-100 bg-gradient-to-br from-emerald-50/50 to-white">
          <div className="flex items-center justify-between text-xs font-bold text-emerald-700 uppercase tracking-wider mb-2">
            <span>Avg Attachment Rate</span>
            <Percent className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-700">
            {stats.avgAttachmentRatePct}%
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Customers co-purchasing complementary items
          </p>
        </div>

        <div className="saas-card p-5 border-indigo-100 bg-gradient-to-br from-indigo-50/50 to-white">
          <div className="flex items-center justify-between text-xs font-bold text-indigo-700 uppercase tracking-wider mb-2">
            <span>Total Incremental Profit</span>
            <DollarSign className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-indigo-700">
            +₹{stats.totalIncrementalProfit.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Net profit boost generated over baseline
          </p>
        </div>

        <div className="saas-card p-5 border-blue-100 bg-gradient-to-br from-blue-50/50 to-white">
          <div className="flex items-center justify-between text-xs font-bold text-blue-700 uppercase tracking-wider mb-2">
            <span>Avg Sales Volume Uplift</span>
            <TrendingUp className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-blue-700">
            +{stats.avgSalesUpliftPct}%
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Promoted bundle units vs. unpromoted baseline
          </p>
        </div>

        <div className="saas-card p-5 border-purple-100 bg-gradient-to-br from-purple-50/50 to-white">
          <div className="flex items-center justify-between text-xs font-bold text-purple-700 uppercase tracking-wider mb-2">
            <span>Meaningful Uplift Rate</span>
            <ShieldCheck className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-black text-purple-700">
            {stats.meaningfulSuccessPct}%
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {stats.meaningfulSuccessCount} of 17 product bundles boosted profit
          </p>
        </div>

      </div>

      {/* Interactive Anchor Product Selector & AI Bundle Recommender Tool */}
      <div className="saas-card p-6 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              Interactive Co-Promote Bundle Advisor
            </span>
            <h3 className="text-base font-extrabold text-white mt-0.5">
              Select Anchor Product to Discover Co-Promoted Accessories
            </h3>
          </div>

          {/* Anchor Product Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Anchor Product:</span>
            <select
              value={selectedAnchorId}
              onChange={(e) => setSelectedAnchorId(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-indigo-400 cursor-pointer"
            >
              {bundles.map(b => (
                <option key={b.anchorProductId} value={b.anchorProductId}>
                  {b.anchorProductName} ({b.category})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Selected Bundle Impact Breakdown */}
        {activeBundle && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            
            {/* Left: Anchor & Bundled Accessories list */}
            <div className="md:col-span-2 bg-slate-800/80 p-4 rounded-2xl border border-slate-700/80 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">Anchor Base Product</span>
                  <h4 className="text-sm font-bold text-white">{activeBundle.anchorProductName}</h4>
                </div>
                <span className="px-3 py-1 rounded-xl text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Recommended Bundle: {activeBundle.bundleDiscountOffered}
                </span>
              </div>

              <div>
                <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5 mb-2">
                  <ShoppingBag className="w-3.5 h-3.5 text-indigo-400" />
                  Frequently Co-Purchased Accessories:
                </span>
                <div className="flex flex-wrap gap-2">
                  {activeBundle.bundledProducts.map((acc, idx) => (
                    <span key={idx} className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-700 text-indigo-200 border border-slate-600">
                      + {acc}
                    </span>
                  ))}
                </div>
              </div>

              {/* Rationale */}
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-700 text-xs text-indigo-200">
                <strong>AI Verdict:</strong> {activeBundle.aiVerdict.verdictExplanation}
              </div>
            </div>

            {/* Right: Key Bundle Impact Metrics */}
            <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/80 flex flex-col justify-between space-y-2">
              <div>
                <span className="text-[11px] font-semibold text-slate-400">Attachment Rate</span>
                <div className="text-xl font-black text-emerald-400">{activeBundle.attachmentRatePct}%</div>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-slate-400">Net Profit Boost</span>
                <div className="text-xl font-black text-emerald-400">+₹{activeBundle.incrementalProfit.toLocaleString('en-IN')}</div>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-slate-400">Sales Volume Boost</span>
                <div className="text-base font-bold text-indigo-300">
                  {activeBundle.baseUnits} units → {activeBundle.promoUnits} units (+{activeBundle.salesUpliftPct}%)
                </div>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* Visual Profit Comparison Chart (Recharts) */}
      <div className="saas-card p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-indigo-600" />
            Baseline Single Product Profit vs. Cross-Product Bundle Profit (₹)
          </h3>
          <span className="text-xs font-medium text-slate-400 font-bold text-emerald-600">
            Incremental Profit Boost Analysis
          </span>
        </div>

        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748B' }} />
              <YAxis tick={{ fontSize: 11, fill: '#64748B' }} formatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(val) => `₹${Number(val).toLocaleString('en-IN')}`} contentStyle={{ backgroundColor: '#1E293B', color: '#FFF', borderRadius: '12px', fontSize: '12px' }} />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Bar dataKey="BaselineProfit" name="Baseline Single Product Profit" fill="#94A3B8" radius={[4, 4, 0, 0]} />
              <Bar dataKey="BundledProfit" name="Cross-Product Bundled Profit" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Historical Bundle Learning Audit Table */}
      <div className="saas-card p-5 space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Filter className="w-4 h-4 text-indigo-600" />
              Historical Cross-Product Bundle Uplift Learning Table (17 Product Records)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Evaluates actual productivity boost &amp; net profit impact to determine which product combinations to repeat or avoid.
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
            <span className="text-xs text-slate-500 font-medium">AI Future Verdict:</span>
            <select
              value={verdictFilter}
              onChange={(e) => setVerdictFilter(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Verdicts (17 Records)</option>
              <option value="RECOMMENDED_FOR_FUTURE">🟢 Recommended for Future</option>
              <option value="MODIFY_DISCOUNT">🟡 Modify Discount Depth</option>
              <option value="AVOID_IN_FUTURE">🔴 Avoid Bundling</option>
            </select>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider bg-slate-50">
                <th className="py-3 px-3">Anchor Product</th>
                <th className="py-3 px-3">Bundled Accessories</th>
                <th className="py-3 px-3">Bundle Discount</th>
                <th className="py-3 px-3">Attachment Rate</th>
                <th className="py-3 px-3">Units (Base vs Promo)</th>
                <th className="py-3 px-3">Productivity Net Profit Boost</th>
                <th className="py-3 px-3">Meaningful Uplift?</th>
                <th className="py-3 px-3">AI Future Verdict</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBundles.map((b) => (
                <tr key={b.bundleId} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-3 font-bold text-slate-900">{b.anchorProductName}</td>
                  <td className="py-3.5 px-3 font-medium text-slate-600 max-w-xs truncate">
                    {b.bundledProducts.join(', ')}
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                      {b.bundleDiscountOffered}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 font-black text-indigo-900">{b.attachmentRatePct}%</td>
                  <td className="py-3.5 px-3 text-slate-700">
                    <span className="font-bold text-slate-900">{b.promoUnits.toLocaleString()}</span>
                    <span className="text-slate-400 text-[11px] ml-1">({b.baseUnits})</span>
                  </td>
                  <td className="py-3.5 px-3 font-black text-emerald-600">
                    +₹{b.incrementalProfit.toLocaleString('en-IN')}
                    <span className="block text-[10px] text-slate-500 font-medium">(+{b.salesUpliftPct}% Vol)</span>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      b.meaningfulUpliftFlag ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}>
                      {b.meaningfulUpliftFlag ? '⚡ High Boost' : '⚠️ Moderate'}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 max-w-xs">
                    <div className="space-y-0.5">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold border ${
                        b.aiVerdict.repeatRecommendation === 'RECOMMENDED_FOR_FUTURE'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                          : b.aiVerdict.repeatRecommendation === 'MODIFY_DISCOUNT'
                          ? 'bg-amber-100 text-amber-800 border-amber-200'
                          : 'bg-rose-100 text-rose-800 border-rose-200'
                      }`}>
                        {b.aiVerdict.verdictTitle}
                      </span>
                      <p className="text-[10px] text-slate-500 truncate">{b.aiVerdict.verdictExplanation}</p>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
}
