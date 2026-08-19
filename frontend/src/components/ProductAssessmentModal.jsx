import React, { useState } from 'react';
import {
  X,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Package,
  TrendingUp,
  Tag,
  DollarSign,
  UserCheck,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

export default function ProductAssessmentModal({ item, onClose }) {
  if (!item) return null;

  // Scenario state: 'SUFFICIENT' (e.g. 1000 units) vs 'INSUFFICIENT' (e.g. 400 units)
  const [stockScenario, setStockScenario] = useState('SUFFICIENT');

  const basePrice = item.base_price || 150;
  const costPrice = Math.round(basePrice * (1 - (item.margin_pct || 0.333)));
  const discountPct = item.discount_pct || 10;
  const priceAfterDiscount = +(basePrice * (1 - discountPct / 100)).toFixed(2);
  const normalDemand = item.avg_weekly_demand || 500;
  const promoDemand = item.metrics?.projectedUnits || 850;

  // Calculated scenario values
  const isSufficient = stockScenario === 'SUFFICIENT';
  const currentStock = isSufficient ? 1000 : 400;

  // AI Determinations
  const customerFit = 'High';
  const demandLevel = 'High';
  const inventoryStatus = currentStock >= promoDemand ? 'Sufficient' : 'Insufficient';
  const marginStatus = (priceAfterDiscount - costPrice) / priceAfterDiscount >= 0.15 ? 'Acceptable' : 'Eroded';
  const stockoutRisk = currentStock >= promoDemand ? 'Low' : 'Very High';
  const recommendation = currentStock >= promoDemand ? 'Promote' : 'Do not promote';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  AI Decision Matrix
                </span>
                <span className="text-[11px] text-slate-400 font-medium">{item.category}</span>
              </div>
              <h2 className="text-lg font-bold text-white tracking-tight mt-0.5">
                {item.product_name}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6 bg-slate-50/50">
          
          {/* Key Parameters Grid */}
          <div className="saas-card p-5 bg-white space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Package className="w-4 h-4 text-indigo-600" />
              Promotion & Stock Parameters
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 font-medium">Customer segment</span>
                <p className="text-xs font-bold text-slate-900 truncate mt-0.5">{item.segment_name || 'Frequent buyers'}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 font-medium">Product</span>
                <p className="text-xs font-bold text-slate-900 truncate mt-0.5">{item.product_name || 'Coffee'}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 font-medium">Region</span>
                <p className="text-xs font-bold text-slate-900 truncate mt-0.5">{item.region || 'Hyderabad'}</p>
              </div>

              <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100">
                <span className="text-[10px] text-indigo-600 font-medium">Current stock</span>
                <p className="text-xs font-black text-indigo-900 mt-0.5">{currentStock.toLocaleString()} units</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 font-medium">Expected normal demand</span>
                <p className="text-xs font-bold text-slate-900 mt-0.5">{normalDemand.toLocaleString()} units</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 font-medium">Expected promo demand</span>
                <p className="text-xs font-bold text-slate-900 mt-0.5">{promoDemand.toLocaleString()} units</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 font-medium">Cost</span>
                <p className="text-xs font-bold text-slate-900 mt-0.5">₹{costPrice.toLocaleString('en-IN')}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 font-medium">Price</span>
                <p className="text-xs font-bold text-slate-900 mt-0.5">₹{basePrice.toLocaleString('en-IN')}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 font-medium">Discount &amp; Coupon</span>
                <p className="text-xs font-bold text-indigo-600 mt-0.5">{discountPct}% OFF ({item.coupon_code || 'PROMO20'})</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 font-medium">Incoming Stock</span>
                <p className="text-xs font-bold text-slate-900 mt-0.5">+{item.incoming_stock || 250} units</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 font-medium">Safety Stock Floor</span>
                <p className="text-xs font-bold text-slate-900 mt-0.5">{item.safety_stock || 80} units</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 font-medium">Shelf Life &amp; Expiry</span>
                <p className="text-xs font-bold text-slate-900 mt-0.5">{item.shelf_life || '180 Days'} ({item.expiry || 'Dec 2026'})</p>
              </div>
            </div>
          </div>

          {/* Interactive Stock Scenario Switcher */}
          <div className="saas-card p-4 bg-gradient-to-r from-slate-900 to-indigo-950 text-white space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider">
                🧪 Interactive Stock Simulation Scenario
              </span>
              <span className="text-[11px] text-slate-400">Select stock condition to test AI response</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setStockScenario('SUFFICIENT')}
                className={`p-3 rounded-2xl text-left border transition-all ${
                  isSufficient
                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200 ring-2 ring-emerald-500/30'
                    : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold">Scenario A: Sufficient Stock</span>
                  {isSufficient && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                </div>
                <p className="text-[11px] text-slate-300 mt-1">Stock = 1,000 units (&gt; 850 promo demand)</p>
              </button>

              <button
                onClick={() => setStockScenario('INSUFFICIENT')}
                className={`p-3 rounded-2xl text-left border transition-all ${
                  !isSufficient
                    ? 'bg-rose-500/20 border-rose-400 text-rose-200 ring-2 ring-rose-500/30'
                    : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold">Scenario B: Insufficient Stock</span>
                  {!isSufficient && <AlertTriangle className="w-4 h-4 text-rose-400" />}
                </div>
                <p className="text-[11px] text-slate-300 mt-1">Stock = 400 units (&lt; 850 promo demand)</p>
              </button>
            </div>
          </div>

          {/* AI Multi-Factor Decision Matrix Panel */}
          <div className="saas-card p-5 bg-white space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              The AI Decision Assessment
            </h3>

            <div className="space-y-2.5">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-xs font-medium text-slate-700">Customer fit</span>
                <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                  {customerFit}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-xs font-medium text-slate-700">Demand</span>
                <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-100 text-indigo-700 border border-indigo-200">
                  {demandLevel}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-xs font-medium text-slate-700">Inventory</span>
                <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${
                  isSufficient
                    ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                    : 'bg-rose-100 text-rose-700 border-rose-200'
                }`}>
                  {inventoryStatus}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-xs font-medium text-slate-700">Margin</span>
                <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                  {marginStatus}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-xs font-medium text-slate-700">Stockout risk</span>
                <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${
                  isSufficient
                    ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                    : 'bg-rose-100 text-rose-700 border-rose-200 animate-pulse'
                }`}>
                  {stockoutRisk}
                </span>
              </div>

              {/* Final AI Recommendation Banner */}
              <div className={`p-4 rounded-2xl border flex items-center justify-between ${
                isSufficient
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-900'
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-900'
              }`}>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Final AI Recommendation</span>
                  <p className="text-base font-black mt-0.5">{recommendationText}</p>
                </div>
                <div className={`px-3 py-1.5 rounded-xl text-xs font-extrabold border ${
                  isSufficient
                    ? 'bg-emerald-600 text-white border-emerald-500'
                    : 'bg-rose-600 text-white border-rose-500'
                }`}>
                  {isSufficient ? '🟢 PROMOTE' : '🔴 DO NOT PROMOTE'}
                </div>
              </div>

              {/* Explicit Why Recommended Panel */}
              <div className="p-3.5 rounded-xl bg-emerald-50/80 border border-emerald-200 text-xs text-emerald-950 space-y-1">
                <div className="font-bold text-emerald-800 flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Why This Offer Is Recommended
                </div>
                <p className="leading-relaxed text-[11px] text-emerald-900">
                  {item.explanation?.recommendationWhy || `High customer fit (${customerFit}) and strong regional demand (${demandLevel}) projecting healthy revenue lift.`}
                </p>
              </div>

              {/* Explicit Operational Risk Assessment & Mitigation Panel */}
              <div className={`p-3.5 rounded-xl border text-xs space-y-1.5 ${
                isSufficient ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-rose-50 border-rose-200 text-rose-950'
              }`}>
                <div className="font-bold flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
                  <AlertTriangle className={`w-3.5 h-3.5 ${isSufficient ? 'text-slate-500' : 'text-rose-600 animate-pulse'}`} />
                  Operational Risk &amp; Fulfillment Assessment
                </div>
                <p className="font-semibold text-[11px]">
                  {isSufficient
                    ? '🟢 Zero Operational Risk: Stock Buffer Confirmed (1,000 units > 850 demand)'
                    : '🔴 Critical Operational Risk: 100% Stock Depletion & Fulfillment Shortfall'}
                </p>
                <p className="text-[11px] text-slate-700 leading-tight">
                  {isSufficient
                    ? 'Sufficient inventory buffer is confirmed. Lead time and holding cost constraints are satisfied.'
                    : 'Available stock (400 units) covers less than 50% of projected promo demand (850 units). Out-of-stock failure imminent if promoted at 10% OFF.'}
                </p>
                <div className="pt-1 text-[11px] font-bold text-indigo-700 flex items-start gap-1">
                  <span className="shrink-0">⚙️ Mitigation Plan:</span>
                  <span>{isSufficient ? 'Proceed with campaign launch and automated cross-channel promotion.' : 'Operational Action Required: Suppress campaign in this store region or reallocate 450+ units from central warehouse before launch.'}</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
          >
            Close Assessment
          </button>
        </div>

      </div>
    </div>
  );
}
