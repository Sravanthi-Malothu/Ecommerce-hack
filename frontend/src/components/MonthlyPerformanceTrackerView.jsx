import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Trophy,
  Zap,
  Calendar,
  Filter,
  BarChart3,
  Sparkles,
  Package
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from 'recharts';

export default function MonthlyPerformanceTrackerView() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  useEffect(() => {
    const fetchMonthlyData = async () => {
      try {
        setLoading(true);
        const res = await fetch('http://localhost:5001/api/analytics/monthly-performance');
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error('Failed to fetch monthly performance data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMonthlyData();
  }, []);

  if (loading || !data) {
    return (
      <div className="saas-card p-16 text-center space-y-4 my-8">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <h3 className="text-base font-bold text-slate-900">Calculating Monthly Promotion Performance & Profit...</h3>
        <p className="text-xs text-slate-500">Analyzing 12-month baseline vs. promoted sales, profit margins, and AI feedback vectors.</p>
      </div>
    );
  }

  const { leaderboards, records } = data;
  const { highestProfitPromo, highestRoiPromo, highestRevenueUpliftPromo, highestSalesUpliftPromo } = leaderboards;

  // Extract unique products and categories
  const productsList = Array.from(new Set(records.map(r => r.productName)));
  const categoriesList = Array.from(new Set(records.map(r => r.category)));

  // Filter records
  let filteredRecords = [...records];
  if (selectedProduct !== 'ALL') {
    filteredRecords = filteredRecords.filter(r => r.productName === selectedProduct);
  }
  if (selectedCategory !== 'ALL') {
    filteredRecords = filteredRecords.filter(r => r.category === selectedCategory);
  }

  // Aggregate monthly timeline chart data (12 months)
  const monthlyChartMap = {};
  filteredRecords.forEach(r => {
    if (!monthlyChartMap[r.month]) {
      monthlyChartMap[r.month] = {
        month: r.month,
        baselineRevenue: 0,
        promotedRevenue: 0,
        netProfit: 0
      };
    }
    monthlyChartMap[r.month].baselineRevenue += r.baselineRevenue;
    monthlyChartMap[r.month].promotedRevenue += r.promotedRevenueGenerated;
    monthlyChartMap[r.month].netProfit += r.profitGenerated;
  });

  const chartData = Object.values(monthlyChartMap);

  return (
    <div className="space-y-6">
      
      {/* Top Banner & AI Feedback Loop Status */}
      <div className="saas-card p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="w-5 h-5 text-indigo-400" />
            <h2 className="text-xl font-extrabold text-white tracking-tight font-sans">
              Monthly Promotion Performance & Profit Tracker
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              12-Month Historical Analytics
            </span>
          </div>
          <p className="text-xs text-slate-300">
            Analyze product-wise monthly promotion performance, compare baseline vs. promoted sales uplift, and track net profit generated.
          </p>
        </div>

        {/* AI Feedback Loop Active Badge */}
        <div className="bg-emerald-500/10 border border-emerald-500/30 p-3 rounded-2xl flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <div className="text-xs font-bold text-emerald-300">AI Feedback Loop Active</div>
            <div className="text-[10px] text-slate-300">Optimizing Fit Scores via historical ROI</div>
          </div>
        </div>
      </div>

      {/* Top Performance Leaderboards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Highest Profit Leader */}
        <div className="saas-card p-5 relative overflow-hidden bg-gradient-to-br from-emerald-50/60 to-white border-emerald-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1">
              <Trophy className="w-3.5 h-3.5 text-emerald-600" />
              Highest Profit Leader
            </span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
              {highestProfitPromo?.month}
            </span>
          </div>
          <h4 className="text-sm font-bold text-slate-900 truncate">
            {highestProfitPromo?.productName}
          </h4>
          <div className="text-2xl font-black text-emerald-700 mt-1">
            +₹{highestProfitPromo?.profitGenerated.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Profit Margin: <strong className="text-slate-900">{highestProfitPromo?.profitMarginPct}%</strong> ({highestProfitPromo?.discountOffered})
          </p>
        </div>

        {/* Highest ROI Leader */}
        <div className="saas-card p-5 relative overflow-hidden bg-gradient-to-br from-indigo-50/60 to-white border-indigo-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-indigo-600" />
              Highest ROI Leader
            </span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-indigo-100 text-indigo-800">
              {highestRoiPromo?.month}
            </span>
          </div>
          <h4 className="text-sm font-bold text-slate-900 truncate">
            {highestRoiPromo?.productName}
          </h4>
          <div className="text-2xl font-black text-indigo-700 mt-1">
            {highestRoiPromo?.promotionRoiPct}% ROI
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Profit Generated: <strong className="text-slate-900">₹{highestRoiPromo?.profitGenerated.toLocaleString('en-IN')}</strong>
          </p>
        </div>

        {/* Highest Revenue Uplift Leader */}
        <div className="saas-card p-5 relative overflow-hidden bg-gradient-to-br from-blue-50/60 to-white border-blue-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
              Highest Revenue Uplift
            </span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
              {highestRevenueUpliftPromo?.month}
            </span>
          </div>
          <h4 className="text-sm font-bold text-slate-900 truncate">
            {highestRevenueUpliftPromo?.productName}
          </h4>
          <div className="text-2xl font-black text-blue-700 mt-1">
            +{highestRevenueUpliftPromo?.revenueUpliftPct}% Rev Lift
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Promoted Rev: <strong className="text-slate-900">₹{highestRevenueUpliftPromo?.promotedRevenueGenerated.toLocaleString('en-IN')}</strong>
          </p>
        </div>

        {/* Highest Sales Uplift Leader */}
        <div className="saas-card p-5 relative overflow-hidden bg-gradient-to-br from-purple-50/60 to-white border-purple-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-purple-700 flex items-center gap-1">
              <Package className="w-3.5 h-3.5 text-purple-600" />
              Highest Sales Volume Uplift
            </span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-purple-100 text-purple-800">
              {highestSalesUpliftPromo?.month}
            </span>
          </div>
          <h4 className="text-sm font-bold text-slate-900 truncate">
            {highestSalesUpliftPromo?.productName}
          </h4>
          <div className="text-2xl font-black text-purple-700 mt-1">
            +{highestSalesUpliftPromo?.salesUpliftPct}% Units Lift
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Units Sold: <strong className="text-slate-900">{highestSalesUpliftPromo?.promotedUnitsSold.toLocaleString()} units</strong>
          </p>
        </div>

      </div>

      {/* Recharts 12-Month Promoted vs Baseline Performance Comparison Chart */}
      <div className="saas-card p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <BarChart3 className="w-4 h-4 text-indigo-600" />
            12-Month Baseline vs. Promoted Revenue & Profit Trajectory
          </h3>
          <span className="text-xs font-semibold text-slate-400">
            {selectedProduct === 'ALL' ? 'All Products Aggregated' : selectedProduct}
          </span>
        </div>

        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748B' }} />
              <YAxis tick={{ fontSize: 11, fill: '#64748B' }} formatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(val) => `₹${Number(val).toLocaleString('en-IN')}`} contentStyle={{ backgroundColor: '#1E293B', color: '#FFF', borderRadius: '12px', fontSize: '12px' }} />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Bar dataKey="baselineRevenue" name="Baseline Revenue (Unpromoted)" fill="#94A3B8" radius={[4, 4, 0, 0]} />
              <Bar dataKey="promotedRevenue" name="Promoted Revenue Generated" fill="#4F46E5" radius={[4, 4, 0, 0]} />
              <Bar dataKey="netProfit" name="Net Profit Generated" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Month-Wise Performance Report Table & Filters */}
      <div className="saas-card p-5 space-y-4">
        
        {/* Table Filters Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <Filter className="w-4 h-4 text-indigo-600" />
            Month-Wise Product Performance Report ({filteredRecords.length} records)
          </h3>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-500 font-medium">Product:</span>
              <select
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
              >
                <option value="ALL">All Products ({productsList.length})</option>
                {productsList.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-500 font-medium">Category:</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
              >
                <option value="ALL">All Categories</option>
                {categoriesList.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider bg-slate-50">
                <th className="py-3 px-3">Month</th>
                <th className="py-3 px-3">Product Name</th>
                <th className="py-3 px-3">Discount</th>
                <th className="py-3 px-3">Units (Promoted vs Base)</th>
                <th className="py-3 px-3">Revenue Generated</th>
                <th className="py-3 px-3">Total Costs</th>
                <th className="py-3 px-3">Net Profit</th>
                <th className="py-3 px-3">Margin %</th>
                <th className="py-3 px-3">Promo ROI %</th>
                <th className="py-3 px-3">Rev Lift</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.slice(0, 40).map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-3 font-bold text-indigo-900 whitespace-nowrap">{r.month}</td>
                  <td className="py-3 px-3 font-bold text-slate-900">{r.productName}</td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      r.discountPct > 0 ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {r.discountOffered}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-700 font-medium">
                    <span className="font-bold text-slate-900">{r.promotedUnitsSold.toLocaleString()}</span>
                    <span className="text-slate-400 text-[11px] ml-1">({r.baselineUnits})</span>
                  </td>
                  <td className="py-3 px-3 font-bold text-slate-900">₹{r.promotedRevenueGenerated.toLocaleString('en-IN')}</td>
                  <td className="py-3 px-3 text-slate-600">₹{r.promotionCostTotal.toLocaleString('en-IN')}</td>
                  <td className="py-3 px-3 font-black text-emerald-600">+₹{r.profitGenerated.toLocaleString('en-IN')}</td>
                  <td className="py-3 px-3 font-bold text-slate-800">{r.profitMarginPct}%</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold border border-emerald-100">
                      {r.promotionRoiPct}%
                    </span>
                  </td>
                  <td className="py-3 px-3 font-bold text-indigo-600">+{r.revenueUpliftPct}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
}
