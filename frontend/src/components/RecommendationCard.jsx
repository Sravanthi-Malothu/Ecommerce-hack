import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Sliders,
  TrendingUp,
  PackageCheck,
  DollarSign,
  Info,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Sparkles,
  RefreshCw,
  Zap
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function RecommendationCard({
  item,
  onStatusChange,
  onDiscountChange,
  onAddNote,
  onInspectAssessment
}) {
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [localDiscount, setLocalDiscount] = useState(item.discount_pct);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [newNoteText, setNewNoteText] = useState('');

  const {
    id,
    product_name,
    category,
    base_price,
    segment_name,
    region,
    status,
    metrics,
    constraintEval,
    explanation,
    notes = []
  } = item;

  const handleApprove = () => {
    onStatusChange(id, 'APPROVED');
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#10B981', '#6366F1', '#3B82F6']
    });
  };

  const handleReject = () => {
    onStatusChange(id, 'REJECTED');
  };

  const handleResetStatus = () => {
    onStatusChange(id, 'DRAFT');
  };

  const handleApplyDiscount = () => {
    setIsUpdating(true);
    onDiscountChange(id, localDiscount);
    setTimeout(() => setIsUpdating(false), 300);
  };

  const handleAddNoteSubmit = (e) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    onAddNote(id, newNoteText.trim());
    setNewNoteText('');
  };

  const getRiskBadgeStyle = (riskLevel) => {
    switch (riskLevel) {
      case 'STOCKOUT_RISK':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'MARGIN_RISK':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'TIGHT_STOCK':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'FATIGUE_WARNING':
        return 'bg-yellow-50 text-yellow-800 border-yellow-200';
      default:
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
  };

  const getFitScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    if (score >= 60) return 'text-indigo-700 bg-indigo-50 border-indigo-200';
    return 'text-amber-700 bg-amber-50 border-amber-200';
  };

  return (
    <div
      className={`saas-card p-5 transition-all ${
        status === 'APPROVED'
          ? 'ring-2 ring-emerald-500/30 bg-emerald-50/20'
          : status === 'REJECTED'
          ? 'opacity-60 bg-slate-50'
          : ''
      }`}
    >
      {/* Card Header: Product & Segment Tags + Fit Score */}
      <div className="flex flex-wrap items-start justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
              {region}
            </span>
            <span className="px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700">
              {category}
            </span>
            <span className="px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-600">
              Segment: <strong className="text-slate-900">{segment_name}</strong>
            </span>
          </div>

          <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            {product_name}
            <span className="text-xs font-normal text-slate-500">(₹{base_price})</span>
          </h3>
        </div>

        {/* Fit Score & Status */}
        <div className="flex items-center gap-2">
          {onInspectAssessment && (
            <button
              onClick={() => onInspectAssessment(item)}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-xs hover:from-indigo-700 hover:to-indigo-800 transition-all active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Inspect AI Assessment
            </button>
          )}

          {status === 'APPROVED' && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-bold bg-emerald-600 text-white shadow-sm">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Approved
            </span>
          )}

          {status === 'REJECTED' && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-semibold bg-slate-100 text-slate-500 border border-slate-200">
              <XCircle className="w-3.5 h-3.5 text-slate-400" />
              Rejected
            </span>
          )}

          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-xl border text-xs font-bold ${getFitScoreColor(
              metrics.fitScore
            )}`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{metrics.fitScore} Fit Score</span>
          </div>
        </div>
      </div>

      {/* Operational Risk Badge Row */}
      <div className="my-3 flex flex-wrap items-center justify-between gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-150">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Risk Status:</span>
          {constraintEval.flags.map((flag, idx) => (
            <span
              key={idx}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border ${getRiskBadgeStyle(
                flag.type
              )}`}
            >
              {flag.badge}
            </span>
          ))}
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Stock Cushion: <strong className="text-slate-900">{metrics.stockQty} units</strong> ({metrics.daysOfSupply} days supply)
        </div>
      </div>

      {/* Feature Attribution Signals (SHAP style) */}
      <div className="mb-4">
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1">
          <Zap className="w-3 h-3 text-indigo-600" />
          AI Feature Attribution Signals
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2.5">
          {explanation.topSignals.map((signal, idx) => (
            <div
              key={idx}
              className="bg-slate-50/80 p-2.5 rounded-xl border border-slate-200/80 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold text-slate-800">{signal.label}</span>
                <span
                  className={`text-[11px] font-bold ${
                    signal.type === 'negative' ? 'text-red-600' : 'text-emerald-600'
                  }`}
                >
                  {signal.value}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 leading-tight">{signal.description}</p>
            </div>
          ))}
        </div>

        {/* AI Rationale Sentence */}
        <div className="bg-indigo-50/60 border border-indigo-100 p-2.5 rounded-xl text-xs text-indigo-900 flex items-start gap-2">
          <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
          <p>{explanation.summaryRationale}</p>
        </div>

        {/* Recommended Co-Promote Bundle Pill */}
        <div className="mt-2 p-2.5 rounded-xl bg-slate-900 text-white flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              🛍️ Co-Promote Bundle
            </span>
            <span className="font-semibold text-slate-200">
              Co-promote with complementary accessories (+68.4% attachment rate)
            </span>
          </div>
          <span className="text-[11px] font-bold text-emerald-400 shrink-0">
            +₹18,500 Profit Lift
          </span>
        </div>
      </div>

      {/* Financial Projections Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4 bg-slate-50 p-3 rounded-xl border border-slate-200">
        <div>
          <div className="text-[11px] font-medium text-slate-500">Discount Depth</div>
          <div className="text-sm font-bold text-slate-900 flex items-center gap-1">
            {localDiscount}% OFF
            <span className="text-[11px] font-normal text-slate-500">
              (₹{(base_price * (1 - localDiscount / 100)).toFixed(2)})
            </span>
          </div>
        </div>

        <div>
          <div className="text-[11px] font-medium text-slate-500">Projected Rev Lift</div>
          <div className="text-sm font-bold text-emerald-600">
            +₹{metrics.projectedRevenue.toLocaleString('en-IN')}
          </div>
        </div>

        <div>
          <div className="text-[11px] font-medium text-slate-500">Post-Promo Margin</div>
          <div
            className={`text-sm font-bold ${
              metrics.marginPctAfterDiscount < 0.15 ? 'text-orange-600' : 'text-indigo-700'
            }`}
          >
            {(metrics.marginPctAfterDiscount * 100).toFixed(1)}%
            <span className="text-[10px] text-slate-500 ml-1">
              (₹{metrics.projectedMarginDollars.toLocaleString('en-IN')})
            </span>
          </div>
        </div>

        <div>
          <div className="text-[11px] font-medium text-slate-500">Est. Promo Demand</div>
          <div
            className={`text-sm font-bold ${
              metrics.stockQty < metrics.projectedUnits ? 'text-red-600' : 'text-slate-900'
            }`}
          >
            {metrics.projectedUnits} units
            <span className="text-[10px] text-slate-500 ml-1">
              ({(metrics.redemptionRate * 100).toFixed(1)}% Conv)
            </span>
          </div>
        </div>
      </div>

      {/* Interactive What-If Slider */}
      <div className="mb-4">
        <button
          onClick={() => setIsSliderOpen(!isSliderOpen)}
          className="w-full flex items-center justify-between text-xs font-semibold text-slate-700 bg-slate-100/80 hover:bg-slate-200/80 p-2.5 rounded-xl border border-slate-200 transition-all"
        >
          <div className="flex items-center gap-2">
            <Sliders className="w-3.5 h-3.5 text-indigo-600" />
            <span>Interactive "What-If" Discount Simulation</span>
          </div>
          {isSliderOpen ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </button>

        {isSliderOpen && (
          <div className="mt-2 bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between text-xs font-medium">
              <span className="text-slate-700">Adjust Proposed Discount %</span>
              <span className="text-indigo-600 font-bold">{localDiscount}% Discount</span>
            </div>

            <input
              type="range"
              min="5"
              max="45"
              step="5"
              value={localDiscount}
              onChange={(e) => setLocalDiscount(parseInt(e.target.value, 10))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />

            <div className="flex items-center justify-between text-[11px] text-slate-500">
              <span>5% (Conservative)</span>
              <span>25% (Standard)</span>
              <span>45% (Aggressive)</span>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
              <button
                onClick={handleApplyDiscount}
                disabled={isUpdating}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition-all active:scale-95 shadow-sm"
              >
                {isUpdating ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5" />
                )}
                Recalculate Impact Live
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={() => setIsNotesOpen(!isNotesOpen)}
          className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors"
        >
          <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
          <span>Team Discussion ({notes.length})</span>
        </button>

        <div className="flex items-center gap-2">
          {status === 'APPROVED' || status === 'REJECTED' ? (
            <button
              onClick={handleResetStatus}
              className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
            >
              Reset to Draft
            </button>
          ) : (
            <>
              <button
                onClick={handleReject}
                className="flex items-center gap-1 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-red-700 bg-slate-100 hover:bg-red-50 border border-slate-200 hover:border-red-200 transition-all active:scale-95"
              >
                <XCircle className="w-3.5 h-3.5" />
                Reject
              </button>

              <button
                onClick={handleApprove}
                className="flex items-center gap-1 px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 transition-all active:scale-95"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Approve Promotion
              </button>
            </>
          )}
        </div>
      </div>

      {/* Notes Drawer */}
      {isNotesOpen && (
        <div className="mt-3 pt-3 border-t border-slate-100 space-y-2">
          {notes.length === 0 ? (
            <p className="text-xs text-slate-500 italic">No notes added yet. Add a note for team collaboration.</p>
          ) : (
            notes.map((n) => (
              <div key={n.id} className="bg-slate-50 p-2 rounded-lg border border-slate-200 text-xs">
                <p className="text-slate-800">{n.text}</p>
                <span className="text-[10px] text-slate-400">{new Date(n.timestamp).toLocaleTimeString()}</span>
              </div>
            ))
          )}

          <form onSubmit={handleAddNoteSubmit} className="flex items-center gap-2 pt-1">
            <input
              type="text"
              placeholder="Add comment..."
              value={newNoteText}
              onChange={(e) => setNewNoteText(e.target.value)}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-medium"
            >
              Post
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
