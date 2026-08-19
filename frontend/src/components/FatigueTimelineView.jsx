import React from 'react';
import { Clock, AlertTriangle, CheckCircle2, Users } from 'lucide-react';

export default function FatigueTimelineView({ fatigueData }) {
  if (!fatigueData || fatigueData.length === 0) {
    return (
      <div className="saas-card p-8 text-center text-xs text-slate-400">
        Loading Promo Fatigue Timeline...
      </div>
    );
  }

  const COOLDOWN_DAYS = 14;

  return (
    <div className="space-y-6">
      
      <div className="saas-card p-5">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-600" />
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight font-sans">
              Customer Segment Promo Fatigue Timeline
            </h2>
          </div>
          <span className="px-3 py-1 rounded-xl text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            14-Day Cooldown Protection
          </span>
        </div>
        <p className="text-xs text-slate-500">
          Prevents marketing fatigue and un-subscribes by enforcing mandatory cooldown periods between targeted campaigns per audience segment.
        </p>
      </div>

      {/* Segments Timeline List */}
      <div className="grid grid-cols-1 gap-4">
        {fatigueData.map((seg) => {
          const progressPct = Math.min(100, (seg.last_promo_days_ago / COOLDOWN_DAYS) * 100);
          const isFatigued = seg.last_promo_days_ago < COOLDOWN_DAYS;

          return (
            <div
              key={seg.segment_id}
              className={`saas-card p-5 transition-all ${
                isFatigued ? 'border-amber-300 bg-amber-50/30' : ''
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-indigo-600" />
                  <h3 className="text-base font-bold text-slate-900">{seg.segment_name}</h3>
                  <span className="text-xs text-slate-500">({seg.size.toLocaleString()} members)</span>
                </div>

                <div className="flex items-center gap-2">
                  {isFatigued ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Promo Fatigue Warning ({seg.last_promo_days_ago} days ago)
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Ready for Promo ({seg.last_promo_days_ago} days elapsed)
                    </span>
                  )}
                </div>
              </div>

              {/* Progress Bar Timeline */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-medium text-slate-500">
                  <span>Last campaign launch: {seg.last_promo_days_ago} days ago</span>
                  <span>Required Cooldown: 14 Days</span>
                </div>

                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200 p-0.5">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isFatigued ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${progressPct}%` }}
                  />
                </div>

                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>Day 0 (Campaign Launch)</span>
                  <span>Day 7</span>
                  <span className="text-slate-700 font-semibold">Day 14 (Cooldown Safe Window)</span>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
