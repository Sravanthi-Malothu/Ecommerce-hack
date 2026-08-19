import React from 'react';
import {
  TrendingUp,
  DollarSign,
  ShieldCheck,
  PackageCheck,
  AlertTriangle,
  Download,
  CheckCircle2,
  PieChart as PieIcon,
  BarChart3,
  Sparkles
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

export default function CampaignSummaryDashboard({ summary, onExportCSV }) {
  if (!summary) return null;

  const {
    approvedCount,
    totalRecommendationsCount,
    totalIncrementalRevenue,
    totalMarginDollars,
    avgMarginPct,
    totalUnitsExposed,
    readinessScore,
    riskDistribution = {},
    categoryBreakdown = [],
    regionBreakdown = [],
    approvedItems = []
  } = summary;

  const riskPieData = [
    { name: '🟢 Healthy Stock', value: riskDistribution.healthyCount || 0, color: '#10B981' },
    { name: '🟡 Tight Stock', value: riskDistribution.tightStockCount || 0, color: '#F59E0B' },
    { name: '🔴 Stockout Risk', value: riskDistribution.stockoutRiskCount || 0, color: '#EF4444' },
    { name: '🟠 Margin Risk', value: riskDistribution.marginRiskCount || 0, color: '#F97316' }
  ].filter(d => d.value > 0);

  return (
    <div className="space-y-6">
      
      {/* Top Header & Export Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 saas-card p-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="w-5 h-5 text-indigo-600" />
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight font-sans">
              Campaign Readiness Dashboard
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Shared Alignment View
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Cross-functional operational sign-off combining Marketing KPIs, Merchandising margins, and Store Ops inventory.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <div className="text-xs text-slate-400 font-medium">Plan Status</div>
            <div className="text-sm font-bold text-emerald-600">
              {approvedCount} of {totalRecommendationsCount} Approved
            </div>
          </div>

          <button
            onClick={onExportCSV}
            disabled={approvedCount === 0}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition-all shadow-sm active:scale-95"
          >
            <Download className="w-4 h-4" />
            Export Approved Brief (CSV)
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="saas-card p-5 relative overflow-hidden">
          <div className="absolute right-3 top-3 w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div className="text-xs font-medium text-slate-500 mb-1">Projected Revenue Lift</div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">
            ${totalIncrementalRevenue.toLocaleString()}
          </div>
          <div className="mt-2 text-[11px] text-emerald-600 font-bold flex items-center gap-1">
            <span>+24.8% vs Baseline Unoptimized Plan</span>
          </div>
        </div>

        <div className="saas-card p-5 relative overflow-hidden">
          <div className="absolute right-3 top-3 w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <DollarSign className="w-5 h-5" />
          </div>
          <div className="text-xs font-medium text-slate-500 mb-1">Margin Dollars Preserved</div>
          <div className="text-2xl font-black text-emerald-600 tracking-tight">
            ${totalMarginDollars.toLocaleString()}
          </div>
          <div className="mt-2 text-[11px] text-slate-600 font-semibold">
            Avg Post-Discount Margin: <strong className="text-indigo-700">{avgMarginPct}%</strong>
          </div>
        </div>

        <div className="saas-card p-5 relative overflow-hidden">
          <div className="absolute right-3 top-3 w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <PackageCheck className="w-5 h-5" />
          </div>
          <div className="text-xs font-medium text-slate-500 mb-1">Promotional Inventory Exposure</div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">
            {totalUnitsExposed.toLocaleString()} units
          </div>
          <div className="mt-2 text-[11px] text-slate-500">
            Across {approvedCount} approved store-region campaigns
          </div>
        </div>

        <div className="saas-card p-5 relative overflow-hidden">
          <div className="absolute right-3 top-3 w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="text-xs font-medium text-slate-500 mb-1">Campaign Operational Readiness</div>
          <div className="text-2xl font-black text-emerald-600 tracking-tight">
            {readinessScore}%
          </div>
          <div className="mt-2 text-[11px] text-slate-600 flex items-center gap-1.5">
            {riskDistribution.stockoutRiskCount > 0 ? (
              <span className="text-red-600 font-semibold flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                {riskDistribution.stockoutRiskCount} unresolved stockout risk
              </span>
            ) : (
              <span className="text-emerald-600 font-semibold">100% Risk Filter Cleared</span>
            )}
          </div>
        </div>

      </div>

      {/* Visual Recharts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <div className="saas-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-900">Projected Revenue Lift by Category</h3>
            </div>
            <span className="text-[11px] text-slate-400">Approved Campaigns</span>
          </div>

          <div className="h-64">
            {categoryBreakdown.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-slate-400 italic">
                Approve recommendations to visualize category breakdown
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryBreakdown}>
                  <XAxis dataKey="category" stroke="#94A3B8" fontSize={11} />
                  <YAxis stroke="#94A3B8" fontSize={11} tickFormatter={(v) => `$${v / 1000}k`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', borderRadius: '12px', fontSize: '12px' }}
                    formatter={(val) => [`$${val.toLocaleString()}`, 'Value']}
                  />
                  <Bar dataKey="revenue" name="Revenue Lift" fill="#4F46E5" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="margin" name="Margin $" fill="#10B981" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="saas-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-900">Approved Plan Risk Level Breakdown</h3>
            </div>
            <span className="text-[11px] text-slate-400">Constraint Satisfaction</span>
          </div>

          <div className="h-64 flex items-center justify-center">
            {riskPieData.length === 0 ? (
              <div className="text-xs text-slate-400 italic">No approved recommendations yet</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={riskPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {riskPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', borderRadius: '12px', fontSize: '12px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', color: '#64748B' }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

      </div>

      {/* Approved Promotions Table */}
      <div className="saas-card p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            Approved Promotion Campaign Roster ({approvedItems.length})
          </h3>
          <span className="text-xs text-slate-400">Ready for ERP/POS Campaign Launch</span>
        </div>

        {approvedItems.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400 italic bg-slate-50 rounded-xl border border-slate-200">
            No promotions approved yet. Go to the Dashboard to approve high-performing candidate campaigns.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider bg-slate-50">
                  <th className="py-3 px-3">Product Name</th>
                  <th className="py-3 px-3">Target Segment</th>
                  <th className="py-3 px-3">Region</th>
                  <th className="py-3 px-3">Discount</th>
                  <th className="py-3 px-3">Fit Score</th>
                  <th className="py-3 px-3">Projected Rev</th>
                  <th className="py-3 px-3">Post Margin %</th>
                  <th className="py-3 px-3">Risk Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {approvedItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3 font-bold text-slate-900">{item.product_name}</td>
                    <td className="py-3 px-3 text-slate-600">{item.segment_name}</td>
                    <td className="py-3 px-3 text-indigo-700 font-semibold">{item.region}</td>
                    <td className="py-3 px-3 font-bold text-emerald-600">{item.discount_pct}% OFF</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-bold border border-indigo-100">
                        {item.metrics.fitScore}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-bold text-slate-900">
                      +${item.metrics.projectedRevenue.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-slate-700 font-medium">
                      {(item.metrics.marginPctAfterDiscount * 100).toFixed(1)}%
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                          item.constraintEval.riskLevel === 'STOCKOUT_RISK'
                            ? 'bg-red-50 text-red-700'
                            : item.constraintEval.riskLevel === 'MARGIN_RISK'
                            ? 'bg-orange-50 text-orange-700'
                            : 'bg-emerald-50 text-emerald-700'
                        }`}
                      >
                        {item.constraintEval.riskLevel}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
