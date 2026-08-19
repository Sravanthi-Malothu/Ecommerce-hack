import React from 'react';
import {
  Search,
  Bell,
  Settings,
  RotateCcw,
  Users,
  TrendingUp,
  Store,
  ShoppingBag,
  ShieldCheck,
  Database,
  Globe,
  Sparkles
} from 'lucide-react';

export default function Navbar({
  persona,
  setPersona,
  activeDatasetId,
  onSelectDataset,
  summary,
  onResetDataset,
  onGlobalSearch
}) {
  const personaOptions = [
    { id: 'MARKETING', label: 'Marketing Manager', icon: TrendingUp },
    { id: 'MERCHANDISING', label: 'Merchandiser', icon: ShoppingBag },
    { id: 'STORE_OPS', label: 'Store Ops Lead', icon: Store },
    { id: 'APPROVER', label: 'Category Lead (Approver)', icon: ShieldCheck }
  ];

  const datasetOptions = [
    { id: 'SYNTHETIC', label: '⚡ Synthetic Retail Benchmark' },
    { id: 'VARSHITHA_ECOMMERCE', label: '🛍️ varshitha1809 Ecommerce Hub' },
    { id: 'ROSSMANN', label: '🏬 Rossmann Store Sales Dataset' },
    { id: 'UCI_ONLINE', label: '🌐 Kaggle UCI Online Retail (42.9 MB)' },
    { id: 'DUNNHUMBY', label: '🛒 dunnhumby Complete Journey' }
  ];

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-6 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        
        {/* Search Bar */}
        <div className="flex-1 max-w-md relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search anything in PromoAlign..."
            onChange={(e) => onGlobalSearch && onGlobalSearch(e.target.value)}
            className="w-full bg-slate-100/80 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
          />
        </div>

        {/* Right Controls */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Real Retail Dataset Source Selector */}
          <div className="relative flex items-center bg-indigo-50/80 border border-indigo-200 rounded-xl px-3 py-1.5 shadow-sm">
            <Database className="w-3.5 h-3.5 text-indigo-600 mr-2 shrink-0" />
            <select
              value={activeDatasetId || 'SYNTHETIC'}
              onChange={(e) => onSelectDataset(e.target.value)}
              className="bg-transparent text-xs font-bold text-indigo-950 focus:outline-none cursor-pointer pr-1"
            >
              {datasetOptions.map((opt) => (
                <option key={opt.id} value={opt.id} className="bg-white text-slate-900 font-medium">
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Persona Switcher */}
          <div className="relative flex items-center bg-slate-100/80 border border-slate-200 rounded-xl px-3 py-1.5">
            <Users className="w-3.5 h-3.5 text-indigo-600 mr-2" />
            <select
              value={persona}
              onChange={(e) => setPersona(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer pr-1"
            >
              {personaOptions.map((opt) => (
                <option key={opt.id} value={opt.id} className="bg-white text-slate-900">
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Reset Demo Button */}
          <button
            onClick={onResetDataset}
            title="Reset dataset with fresh demo scenarios"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-all active:scale-95"
          >
            <RotateCcw className="w-3.5 h-3.5 text-indigo-600" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          {/* User Profile Badge */}
          <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-400 text-white font-bold text-xs flex items-center justify-center shadow-sm">
              S
            </div>
            <div className="hidden md:block text-left">
              <div className="text-xs font-bold text-slate-900 leading-tight">Sravanthi</div>
              <div className="text-[10px] font-medium text-slate-500">Admin / Category Lead</div>
            </div>
          </div>

        </div>

      </div>
    </header>
  );
}
