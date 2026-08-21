import React, { useState } from 'react';
import {
  X,
  User,
  Mail,
  ShieldCheck,
  Globe,
  DollarSign,
  Bell,
  CheckCircle2,
  Save,
  Download,
  Award,
  Sliders
} from 'lucide-react';

export default function UserProfileModal({
  userProfile,
  onSaveProfile,
  onClose,
  onExportAudit
}) {
  const [name, setName] = useState(userProfile?.name || 'Sravanthi');
  const [email, setEmail] = useState(userProfile?.email || 'sravanthi.malothu@promoalign.ai');
  const [regionFocus, setRegionFocus] = useState(userProfile?.regionFocus || 'ALL');
  const [currency, setCurrency] = useState(userProfile?.currency || 'INR');
  const [stockoutAlert, setStockoutAlert] = useState(userProfile?.alerts?.stockout ?? true);
  const [marginAlert, setMarginAlert] = useState(userProfile?.alerts?.margin ?? true);
  const [fatigueAlert, setFatigueAlert] = useState(userProfile?.alerts?.fatigue ?? true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveProfile({
      name,
      email,
      role: 'Admin / Category Lead',
      regionFocus,
      currency,
      alerts: {
        stockout: stockoutAlert,
        margin: marginAlert,
        fatigue: fatigueAlert
      }
    });

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-400 text-white font-extrabold text-lg flex items-center justify-center shadow-lg shadow-indigo-500/30 ring-2 ring-indigo-400/40">
              {name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-tight">{name}</h2>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
                  <Award className="w-3 h-3 text-indigo-400" />
                  Admin / Category Lead
                </span>
              </div>
              <p className="text-xs text-slate-300 flex items-center gap-1.5 mt-0.5">
                <Mail className="w-3.5 h-3.5 text-indigo-400" />
                {email}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 bg-slate-50/50">
          
          {/* Strategic Authority Badges Grid */}
          <div className="saas-card p-5 bg-white space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              Strategic Lead Authority & Permissions
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-xl flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-emerald-950">Campaign Sign-Off & Approval</div>
                  <div className="text-[11px] text-emerald-700">Full authority to approve or reject promotional briefs</div>
                </div>
              </div>

              <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-xl flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-emerald-950">15% Margin Floor Enforcer</div>
                  <div className="text-[11px] text-emerald-700">Enforces mandatory corporate profitability guardrails</div>
                </div>
              </div>

              <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-xl flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-emerald-950">14-Day Cooldown Fatigue Enforcer</div>
                  <div className="text-[11px] text-emerald-700">Prevents segment over-promoting & brand dilution</div>
                </div>
              </div>

              <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-xl flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-emerald-950">Dataset Source Manager</div>
                  <div className="text-[11px] text-emerald-700">Switch real Kaggle dataset feeds live</div>
                </div>
              </div>
            </div>
          </div>

          {/* User Profile Preferences Form */}
          <div className="saas-card p-5 bg-white space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-indigo-600" />
              Profile Preferences & Regional Focus
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-bold text-slate-900 focus:bg-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-bold text-slate-900 focus:bg-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Preferred Region Focus</label>
                <div className="relative">
                  <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <select
                    value={regionFocus}
                    onChange={(e) => setRegionFocus(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-bold text-slate-900 focus:bg-white focus:border-indigo-500 focus:outline-none cursor-pointer"
                  >
                    <option value="ALL">All Regions (Global View)</option>
                    <option value="North Region">North Region</option>
                    <option value="South Region">South Region (Hyderabad)</option>
                    <option value="East Region">East Region</option>
                    <option value="West Region">West Region</option>
                    <option value="Central Region">Central Region</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Display Currency</label>
                <div className="relative">
                  <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-bold text-slate-900 focus:bg-white focus:border-indigo-500 focus:outline-none cursor-pointer"
                  >
                    <option value="USD">USD ($ - US Dollars)</option>
                    <option value="INR">INR (₹ - Indian Rupees)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Risk Alert Notification Toggles */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Bell className="w-4 h-4 text-indigo-600" />
                Category Lead Risk Notification Alerts
              </span>

              <div className="space-y-2">
                <label className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={stockoutAlert}
                    onChange={(e) => setStockoutAlert(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                  />
                  <span>Show instant notifications for 🔴 <strong>Stockout Risk Warnings</strong></span>
                </label>

                <label className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={marginAlert}
                    onChange={(e) => setMarginAlert(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                  />
                  <span>Show instant notifications for 🟠 <strong>Margin Floor Breach Alerts</strong> (&lt; 15%)</span>
                </label>

                <label className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={fatigueAlert}
                    onChange={(e) => setFatigueAlert(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                  />
                  <span>Show instant notifications for 🟡 <strong>Segment Promo Fatigue Warnings</strong></span>
                </label>
              </div>
            </div>
          </div>

          {savedSuccess && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3.5 rounded-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Profile preferences updated successfully!
            </div>
          )}

        </form>

        {/* Modal Footer */}
        <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between gap-2">
          {onExportAudit && (
            <button
              type="button"
              onClick={onExportAudit}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-indigo-600" />
              Export Decision Audit Log (CSV)
            </button>
          )}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-all active:scale-95"
            >
              <Save className="w-3.5 h-3.5" />
              Save Profile Preferences
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
