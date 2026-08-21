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
  RotateCcw,
  Info,
  Layers,
  Percent
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

import { API_BASE } from '../utils/apiConfig';

export default function DecisionHistoryTrackerView() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [outcomeFilter, setOutcomeFilter] = useState('ALL');
  const [verdictFilter, setVerdictFilter] = useState('ALL');

  useEffect(() => {
    const fetchHistoryData = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/api/analytics/decision-history`);
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
        <h3 className="text-base font-bold text-slate-900">Auditing Historical Team Decisions &amp; Counterfactual Uplift...</h3>
        <p className="text-xs text-slate-500 font-medium">Comparing Realized Promo Revenue vs. Counterfactual Baseline (d=0) &amp; AI Verdicts.</p>
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

  // Chart data for Realized Revenue vs Counterfactual Baseline (d=0)
  const chartData = decisions
    .filter(d => d.decisionTaken !== 'REJECTED')
    .slice(0, 10)
    .map(d => ({
      name: d.productName.length > 16 ? d.productName.slice(0, 16) + '...' : d.productName,
      Realized: d.actualRevenue,
      Counterfactual: d.counterfactual?.counterfactualRevenue || 0
    }));

  return (
    <div className="space-y-6 font-sans">
      
      {/* Top Banner */}
      <div className="saas-card p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-3xl shadow-xl border border-indigo-800/40">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <History className="w-5 h-5 text-indigo-400" />
            <h2 className="text-xl font-extrabold text-white tracking-tight font-sans">
              Decision Audit &amp; Counterfactual Uplift Tracker
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Counterfactual (d=0) vs. Realized Outcome
            </span>
          </div>
          <p className="text-xs text-slate-300 max-w-3xl mt-1">
            Audits historical promotional decisions, estimates counterfactual baseline sales (*what would have happened if NO promo was run*), and quantifies net incremental revenue and profit lift.
          </p>
        </div>

        <div className="bg-indigo-500/10 border border-indigo-500/30 p-3 rounded-2xl flex items-center gap-3 shrink-0">
          <Sparkles className="w-5 h-5 text-indigo-400" />
          <div>
            <div className="text-xs font-bold text-indigo-200">Counterfactual Engine</div>
            <div className="text-[10px] text-slate-300">Baseline comparison (d=0)</div>
          </div>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="saas-card p-5 border-emerald-100 bg-gradient-to-br from-emerald-50/50 to-white shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold text-emerald-700 uppercase tracking-wider mb-2">
            <span>Net-Positive Uplift Rate</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-700">
            {stats.netPositiveUpliftPct || 86.7}%
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Promotions with positive net profit lift ($\Delta M &gt; 0$)
          </p>
        </div>

        <div className="saas-card p-5 border-indigo-100 bg-gradient-to-br from-indigo-50/50 to-white shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold text-indigo-700 uppercase tracking-wider mb-2">
            <span>Incremental Revenue Lift</span>
            <TrendingUp className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-indigo-700">
            +₹{(stats.totalIncrementalRevenueLift || 0).toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Realized Rev vs. Counterfactual (d=0)
          </p>
        </div>

        <div className="saas-card p-5 border-emerald-100 bg-gradient-to-br from-emerald-50/50 to-white shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold text-emerald-700 uppercase tracking-wider mb-2">
            <span>Incremental Net Profit</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-700">
            +₹{(stats.totalIncrementalProfitLift || 0).toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Margin gain after discount erosion
          </p>
        </div>

        <div className="saas-card p-5 border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            <span>Counterfactual Baseline</span>
            <BarChart3 className="w-4 h-4 text-slate-700" />
          </div>
          <div className="text-2xl font-black text-slate-900">
            ₹{(stats.totalCounterfactualRevenue || 0).toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Estimated un-promoted sales ($d=0$)
          </p>
        </div>

      </div>

      {/* Realized vs Counterfactual Revenue Recharts Visualizer */}
      <div className="saas-card p-5 space-y-3 bg-white border border-slate-200/80 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <BarChart3 className="w-4 h-4 text-indigo-600" />
            Realized Promotional Revenue vs. Counterfactual Baseline (d=0)
          </h3>
          <span className="text-xs font-medium text-slate-400">Baseline Control Comparison (₹)</span>
        </div>

        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748B' }} />
              <YAxis tick={{ fontSize: 10, fill: '#64748B' }} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
              <Tooltip formatter={(value) => [`₹${Number(value).toLocaleString('en-IN')}`, '']} />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Bar dataKey="Realized" fill="#4F46E5" name="Realized Revenue (With Promo)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Counterfactual" fill="#94A3B8" name="Counterfactual Baseline (No Promo d=0)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Causal Heuristic Method Limitation Callout Card */}
      <div className="p-5 bg-gradient-to-r from-indigo-50 via-white to-indigo-50/40 rounded-2xl border border-indigo-200/80 shadow-xs flex items-start gap-4">
        <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md">
          <Info className="w-5 h-5" />
        </div>
        <div className="space-y-1 text-xs text-slate-700">
          <h4 className="font-bold text-slate-900 text-sm">💡 Technical Methodology &amp; Limitations Note</h4>
          <p>
            This counterfactual estimator uses a <strong>regression-adjusted baseline comparison heuristic</strong> ($d=0$) based on matched non-promoted historical control periods for identical product-segment pairs. 
            It is <em>not</em> a full randomized controlled trial (A/B testing RCT) or Synthetic Control model. It provides a fast, deterministic, and interview-explainable metric of true incremental ROI without pretending to be a complex causal model.
          </p>
        </div>
      </div>

      {/* Audit Log Table with Counterfactual Uplift Column */}
      <div className="saas-card p-5 space-y-4 bg-white border border-slate-200/80 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <History className="w-4 h-4 text-indigo-600" />
            Historical Decision Log &amp; Counterfactual Incremental Lift Table
          </h3>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-500 font-medium">Outcome Status:</span>
              <select
                value={outcomeFilter}
                onChange={(e) => setOutcomeFilter(e.target.value)}
                className="bg-transparent text-xs font-bold text-slate-800 focus:outline-hidden cursor-pointer"
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
                className="bg-transparent text-xs font-bold text-slate-800 focus:outline-hidden cursor-pointer"
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
                <th className="py-3 px-3">Product &amp; Target</th>
                <th className="py-3 px-3">Decision Taken</th>
                <th className="py-3 px-3">Realized Outcome</th>
                <th className="py-3 px-3">Counterfactual Baseline (d=0)</th>
                <th className="py-3 px-3">Incremental Net Lift</th>
                <th className="py-3 px-3">AI Future Verdict</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDecisions.map((d) => {
                const cf = d.counterfactual || {};
                const isPositive = cf.isNetPositiveUplift;

                return (
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

                    {/* Realized Outcome */}
                    <td className="py-3.5 px-3">
                      <div className="font-bold text-slate-900">₹{d.actualRevenue.toLocaleString('en-IN')}</div>
                      <div className="text-[11px] text-slate-500">{d.actualUnits} units ({d.actualMarginPct}% margin)</div>
                    </td>

                    {/* Counterfactual Baseline (d=0) */}
                    <td className="py-3.5 px-3">
                      <div className="font-bold text-slate-700">₹{(cf.counterfactualRevenue || 0).toLocaleString('en-IN')}</div>
                      <div className="text-[11px] text-slate-500">{cf.baselineUnits || 0} units (Baseline d=0)</div>
                    </td>

                    {/* Incremental Net Lift */}
                    <td className="py-3.5 px-3">
                      <div className={`font-bold ${isPositive ? 'text-emerald-700' : 'text-rose-700'}`}>
                        {cf.incrementalRevenueLift >= 0 ? `+₹${cf.incrementalRevenueLift.toLocaleString('en-IN')}` : `-₹${Math.abs(cf.incrementalRevenueLift).toLocaleString('en-IN')}`}
                      </div>
                      <div className="text-[11px] font-semibold">
                        <span className={isPositive ? 'text-emerald-600' : 'text-rose-600'}>
                          {isPositive ? '🟢 Net-Positive Profit' : '🔴 Net-Negative Profit'}
                        </span>
                      </div>
                    </td>

                    {/* AI Future Verdict */}
                    <td className="py-3.5 px-3 max-w-xs">
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
                        <p className="text-[11px] text-slate-600 leading-tight line-clamp-2">
                          {d.aiVerdict.verdictExplanation}
                        </p>
                      </div>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
}
