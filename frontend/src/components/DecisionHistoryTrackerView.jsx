import React, { useState, useEffect } from 'react';
import {
  History,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  TrendingUp,
  BarChart3,
  Filter,
  DollarSign,
  UserCheck,
  ShieldAlert,
  ArrowRightCircle,
  RotateCcw
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

export default function DecisionHistoryTrackerView() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [outcomeFilter, setOutcomeFilter] = useState('ALL');
  const [verdictFilter, setVerdictFilter] = useState('ALL');

  useEffect(() => {
    const fetchHistoryData = async () => {
      try {
        setLoading(true);
        const res = await fetch('http://localhost:5001/api/analytics/decision-history');
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error('Failed to fetch decision history:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistoryData();
  }, []);

  if (loading || !data) {
    return (
      <div className="saas-card p-16 text-center space-y-4 my-8">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <h3 className="text-base font-bold text-slate-900">Auditing Historical Team Decisions & Post-Launch Outcomes...</h3>
        <p className="text-xs text-slate-500">Comparing Predicted vs. Actual Revenue, Stockout Impacts, and Future AI Verdicts.</p>
      </div>
    );
  }

  const { stats, decisions } = data;

  let filteredDecisions = [...decisions];
  if (outcomeFilter !== 'ALL') {
    filteredDecisions = filteredDecisions.filter(d => d.outcomeStatus === outcomeFilter);
  }
  if (verdictFilter !== 'ALL') {
    filteredDecisions = filteredDecisions.filter(d => d.aiVerdict.repeatRecommendation === verdictFilter);
  }

  // Chart data for Predicted vs Actual Revenue
  const chartData = decisions
    .filter(d => d.decisionTaken !== 'REJECTED')
    .slice(0, 10)
    .map(d => ({
      name: d.productName.length > 18 ? d.productName.slice(0, 18) + '...' : d.productName,
      Predicted: d.predictedRevenue,
      Actual: d.actualRevenue
    }));

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="saas-card p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <History className="w-5 h-5 text-indigo-400" />
            <h2 className="text-xl font-extrabold text-white tracking-tight font-sans">
              Decision Audit & Historical Outcome Tracker
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Predicted vs. Actual Post-Launch Audit
            </span>
          </div>
          <p className="text-xs text-slate-300">
            Review past team decisions (*Approved, Rejected, Modified*), evaluate actual post-launch results, and leverage AI Verdicts to determine whether to repeat decisions in future quarters.
          </p>
        </div>

        <div className="bg-indigo-500/10 border border-indigo-500/30 p-3 rounded-2xl flex items-center gap-3 shrink-0">
          <Sparkles className="w-5 h-5 text-indigo-400" />
          <div>
            <div className="text-xs font-bold text-indigo-200">AI Future Decision Memory</div>
            <div className="text-[10px] text-slate-300">Auto-evaluates repeat vs. modify advice</div>
          </div>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="saas-card p-5 border-emerald-100 bg-gradient-to-br from-emerald-50/50 to-white">
          <div className="flex items-center justify-between text-xs font-bold text-emerald-700 uppercase tracking-wider mb-2">
            <span>Repeatable Success Rate</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-700">
            {stats.repeatableSuccessPct}%
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            High ROI &amp; Stock Cushion confirmed
          </p>
        </div>

        <div className="saas-card p-5 border-rose-100 bg-gradient-to-br from-rose-50/50 to-white">
          <div className="flex items-center justify-between text-xs font-bold text-rose-700 uppercase tracking-wider mb-2">
            <span>Regretted Decisions</span>
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-black text-rose-700">
            {stats.regrettedCount} Decisions
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Caused stockout failure within 4 days
          </p>
        </div>

        <div className="saas-card p-5 border-indigo-100 bg-gradient-to-br from-indigo-50/50 to-white">
          <div className="flex items-center justify-between text-xs font-bold text-indigo-700 uppercase tracking-wider mb-2">
            <span>Prediction Accuracy</span>
            <TrendingUp className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-indigo-700">
            {stats.revenuePredictionAccuracyPct}%
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Predicted vs. Actual Revenue variance
          </p>
        </div>

        <div className="saas-card p-5 border-slate-200">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            <span>Total Actual Revenue</span>
            <DollarSign className="w-4 h-4 text-slate-700" />
          </div>
          <div className="text-2xl font-black text-slate-900">
            ₹{stats.totalActualRevenue.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Across {stats.approvedCount} approved campaigns
          </p>
        </div>

      </div>

      {/* Predicted vs. Actual Revenue Recharts Visualizer */}
      <div className="saas-card p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <BarChart3 className="w-4 h-4 text-indigo-600" />
            Predicted vs. Actual Revenue Audit Comparison (₹)
          </h3>
          <span className="text-xs font-medium text-slate-400">Post-Launch Performance Audit</span>
        </div>

        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748B' }} />
              <YAxis tick={{ fontSize: 11, fill: '#64748B' }} formatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(val) => `₹${Number(val).toLocaleString('en-IN')}`} contentStyle={{ backgroundColor: '#1E293B', color: '#FFF', borderRadius: '12px', fontSize: '12px' }} />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Bar dataKey="Predicted" name="Predicted Revenue Lift" fill="#94A3B8" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Actual" name="Actual Revenue Generated" fill="#4F46E5" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Decision Audit Log Table & Filters */}
      <div className="saas-card p-5 space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <Filter className="w-4 h-4 text-indigo-600" />
            Decision Audit History & AI Future Verdict Log ({filteredDecisions.length} records)
          </h3>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-500 font-medium">Outcome Status:</span>
              <select
                value={outcomeFilter}
                onChange={(e) => setOutcomeFilter(e.target.value)}
                className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
              >
                <option value="ALL">All Outcomes</option>
                <option value="SUCCESS">🟢 Success</option>
                <option value="STOCKOUT_FAILURE">🔴 Stockout Failure</option>
                <option value="MARGIN_BREACH">🟡 Margin Floor Breach</option>
                <option value="REJECTED_CAMPAIGN">⚪ Rejected Campaign</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-500 font-medium">AI Future Verdict:</span>
              <select
                value={verdictFilter}
                onChange={(e) => setVerdictFilter(e.target.value)}
                className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
              >
                <option value="ALL">All Verdicts</option>
                <option value="REPEAT">🟢 Repeat Decision</option>
                <option value="DO_NOT_REPEAT">🔴 Do Not Repeat</option>
                <option value="MODIFY_BEFORE_REPEAT">🟡 Modify Before Repeat</option>
              </select>
            </div>
          </div>
        </div>

        {/* Audit Log Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider bg-slate-50">
                <th className="py-3 px-3">Date &amp; Persona</th>
                <th className="py-3 px-3">Product &amp; Campaign Target</th>
                <th className="py-3 px-3">Decision Taken</th>
                <th className="py-3 px-3">Predicted vs Actual Rev</th>
                <th className="py-3 px-3">Stock Impact</th>
                <th className="py-3 px-3">AI Future Verdict</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDecisions.map((d) => (
                <tr key={d.decisionId} className="hover:bg-slate-50/80 transition-colors">
                  
                  {/* Date & Persona */}
                  <td className="py-3.5 px-3">
                    <div className="font-bold text-slate-900">{d.decisionDate}</div>
                    <div className="text-[11px] font-medium text-slate-500">{d.personaName}</div>
                  </td>

                  {/* Product & Campaign Target */}
                  <td className="py-3.5 px-3">
                    <div className="font-bold text-indigo-950">{d.productName}</div>
                    <div className="text-[11px] text-slate-500">{d.region} • {d.segmentName}</div>
                  </td>

                  {/* Decision Taken */}
                  <td className="py-3.5 px-3">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${
                      d.decisionTaken === 'APPROVED'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : d.decisionTaken === 'DISCOUNT_MODIFIED'
                        ? 'bg-amber-50 text-amber-800 border-amber-200'
                        : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}>
                      {d.decisionTaken} ({d.proposedDiscount})
                    </span>
                  </td>

                  {/* Predicted vs Actual Rev */}
                  <td className="py-3.5 px-3">
                    <div className="font-bold text-slate-900">₹{d.actualRevenue.toLocaleString('en-IN')}</div>
                    <div className="text-[11px] text-slate-500">
                      Pred: ₹{d.predictedRevenue.toLocaleString('en-IN')} (
                      <span className={d.revenueVarianceDollars >= 0 ? 'text-emerald-600 font-bold' : 'text-rose-600 font-bold'}>
                        {d.revenueVarianceDollars >= 0 ? `+${d.revenueVariancePct}%` : `${d.revenueVariancePct}%`}
                      </span>
                      )
                    </div>
                  </td>

                  {/* Stock Impact */}
                  <td className="py-3.5 px-3">
                    <div className={`text-xs font-medium ${
                      d.outcomeStatus === 'STOCKOUT_FAILURE' ? 'text-rose-700 font-bold' : 'text-slate-700'
                    }`}>
                      {d.stockImpact}
                    </div>
                  </td>

                  {/* AI Future Verdict */}
                  <td className="py-3.5 px-3 max-w-sm">
                    <div className="space-y-1">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-bold border ${
                        d.aiVerdict.repeatRecommendation === 'REPEAT'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                          : d.aiVerdict.repeatRecommendation === 'DO_NOT_REPEAT'
                          ? 'bg-rose-100 text-rose-800 border-rose-200'
                          : 'bg-amber-100 text-amber-800 border-amber-200'
                      }`}>
                        {d.aiVerdict.verdictTitle}
                      </span>
                      <p className="text-[11px] text-slate-600 leading-tight">
                        {d.aiVerdict.verdictExplanation}
                      </p>
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
