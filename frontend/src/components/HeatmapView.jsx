import React from 'react';
import { Layers, TrendingUp } from 'lucide-react';

export default function HeatmapView({ heatmapData }) {
  if (!heatmapData || heatmapData.length === 0) {
    return (
      <div className="saas-card p-8 text-center text-xs text-slate-400">
        Loading Regional Heatmap Matrix...
      </div>
    );
  }

  const regions = ['North Region', 'South Region', 'East Region', 'West Region', 'Central Region'];
  const categories = ['Footwear', 'Apparel', 'Beauty & Care', 'Home Goods', 'Outdoor Gear', 'Electronics'];

  const getCellData = (region, category) => {
    return heatmapData.find(
      (h) => h.region === region && h.category === category
    );
  };

  const getCellBg = (item) => {
    if (!item) return 'bg-slate-50';
    if (item.demandIndex >= 1.5 && item.stockQty < 50) {
      return 'bg-red-50 border-red-300 text-red-800'; // Critical Stockout Mismatch!
    }
    if (item.demandIndex >= 1.4) {
      return 'bg-indigo-50 border-indigo-200 text-indigo-900'; // High Demand Spike
    }
    if (item.stockQty > 300) {
      return 'bg-amber-50 border-amber-200 text-amber-900'; // Overstock Cushion
    }
    return 'bg-slate-50 border-slate-200 text-slate-700';
  };

  return (
    <div className="space-y-6">
      
      <div className="saas-card p-5">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-600" />
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight font-sans">
              Regional Demand vs Inventory Stock Matrix
            </h2>
          </div>
          <span className="px-3 py-1 rounded-xl text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
            Supply-Demand Alignment Overlay
          </span>
        </div>
        <p className="text-xs text-slate-500">
          Identifies regional inventory bottlenecks and demand surges before launching store cluster promotional campaigns.
        </p>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 mt-4 pt-3 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-red-100 border border-red-300"></span>
            <span className="text-slate-700 font-medium">🔴 High Demand + Critical Low Stock (Stockout Risk)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-indigo-100 border border-indigo-300"></span>
            <span className="text-slate-700 font-medium">⚡ Demand Spike (&gt;1.4x Index)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-amber-100 border border-amber-300"></span>
            <span className="text-slate-700 font-medium">🟡 Overstock Buffer (&gt;300 units)</span>
          </div>
        </div>
      </div>

      {/* Grid Matrix */}
      <div className="saas-card p-5 overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider bg-slate-50">
              <th className="py-3 px-4">Product Category</th>
              {regions.map((r) => (
                <th key={r} className="py-3 px-4 text-center">{r}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {categories.map((cat) => (
              <tr key={cat} className="hover:bg-slate-50/50">
                <td className="py-4 px-4 font-bold text-slate-900 bg-slate-50">{cat}</td>
                {regions.map((reg) => {
                  const cell = getCellData(reg, cat);
                  return (
                    <td key={reg} className="py-3 px-3 text-center">
                      {cell ? (
                        <div className={`p-3 rounded-xl border flex flex-col items-center justify-center space-y-1 transition-all ${getCellBg(cell)}`}>
                          <span className="font-bold text-sm flex items-center gap-1">
                            {cell.demandIndex}x Index
                            {cell.demandIndex >= 1.4 && <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />}
                          </span>
                          <span className="text-[11px] font-medium opacity-90">
                            {cell.stockQty} units stock
                          </span>
                          <span className="text-[10px] opacity-75">
                            ({cell.daysOfSupply} days supply)
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
