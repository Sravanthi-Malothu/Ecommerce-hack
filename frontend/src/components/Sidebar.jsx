import React from 'react';
import {
  LayoutDashboard,
  BarChart3,
  MapPin,
  Clock,
  Users,
  Sparkles,
  Sliders,
  Settings,
  HelpCircle,
  TrendingUp,
  FolderTree,
  Tag,
  History
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const navItems = [
    { id: 'FEED', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'DECISION_HISTORY', label: 'Decision History', icon: History },
    { id: 'MONTHLY_PERFORMANCE', label: 'Monthly Profit Tracker', icon: BarChart3 },
    { id: 'SUMMARY', label: 'Campaign Summary', icon: TrendingUp },
    { id: 'HEATMAP', label: 'Regional Matrix', icon: MapPin },
    { id: 'FATIGUE', label: 'Promo Fatigue', icon: Clock }
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 min-h-screen flex flex-col justify-between p-5 shrink-0 hidden lg:flex">
      
      <div>
        {/* Brand Logo */}
        <div className="flex items-center gap-3 px-2 mb-8">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold text-slate-900 tracking-tight font-sans">
              PromoAlign
            </h1>
            <span className="text-[10px] font-semibold text-indigo-600 uppercase tracking-wider">
              AI Planner
            </span>
          </div>
        </div>

        {/* Main Navigation Menu */}
        <nav className="space-y-1.5">
          <div className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            Main Menu
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer / System Info */}
      <div className="pt-4 border-t border-slate-100">
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs">
            PA
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900">PromoAlign v1.0</div>
            <div className="text-[10px] text-slate-500">Retail AI Optimizer</div>
          </div>
        </div>
      </div>

    </aside>
  );
}
