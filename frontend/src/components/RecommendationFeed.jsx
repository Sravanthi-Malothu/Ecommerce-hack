import React, { useState } from 'react';
import {
  Search,
  Sparkles,
  CheckCheck,
  Zap,
  ArrowUpDown,
  AlertCircle,
  TrendingUp,
  Package,
  ShoppingBag,
  DollarSign,
  PieChart as PieIcon,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import RecommendationCard from './RecommendationCard';
import ProductAssessmentModal from './ProductAssessmentModal';

export default function RecommendationFeed({
  recommendations,
  summary,
  onStatusChange,
  onDiscountChange,
  onAddNote,
  onBulkApproveHealthy,
  onNLSearch,
  onInspectAssessment
}) {
  const [selectedAssessmentItem, setSelectedAssessmentItem] = useState(null);
  const [nlQuery, setNlQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedRisk, setSelectedRisk] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [sortBy, setSortBy] = useState('FIT_SCORE');

  const handleNLSubmit = (e) => {
    e.preventDefault();
    if (!nlQuery.trim()) return;
    onNLSearch(nlQuery.trim());
  };

  const quickChips = [
    { label: '🔴 Stockout Risks', query: 'stockout risk' },
    { label: '🟢 Healthy North Region', query: 'North Region healthy' },
    { label: '🟠 Margin Erosion Warnings', query: 'margin risk' },
    { label: '⚡ Top Fit Footwear', query: 'Footwear high score' }
  ];

  const handleChipClick = (chipQuery) => {
    setNlQuery(chipQuery);
    onNLSearch(chipQuery);
  };

  let filtered = [...recommendations];

  if (selectedRegion !== 'ALL') {
    filtered = filtered.filter((r) => r.region === selectedRegion);
  }

  if (selectedCategory !== 'ALL') {
    filtered = filtered.filter((r) => r.category === selectedCategory);
  }

  if (selectedRisk !== 'ALL') {
    filtered = filtered.filter((r) => r.constraintEval.riskLevel === selectedRisk);
  }

  if (selectedStatus !== 'ALL') {
    filtered = filtered.filter((r) => r.status === selectedStatus);
  }

  if (sortBy === 'FIT_SCORE') {
    filtered.sort((a, b) => b.metrics.fitScore - a.metrics.fitScore);
  } else if (sortBy === 'REVENUE') {
    filtered.sort((a, b) => b.metrics.projectedRevenue - a.metrics.projectedRevenue);
  } else if (sortBy === 'MARGIN') {
    filtered.sort((a, b) => b.metrics.marginPctAfterDiscount - a.metrics.marginPctAfterDiscount);
  }

  const healthyDraftCount = recommendations.filter(
    (r) => r.constraintEval.riskLevel === 'HEALTHY' && r.status === 'DRAFT'
  ).length;

  // Donut chart category data
  const categoryChartData = (summary && summary.categoryBreakdown) || [
    { category: 'Footwear', revenue: 145000 },
    { category: 'Electronics', revenue: 198000 },
    { category: 'Apparel', revenue: 92000 },
    { category: 'Home Goods', revenue: 64000 }
  ];

  const PIE_COLORS = ['#4F46E5', '#38BDF8', '#10B981', '#F59E0B', '#EC4899'];

  return (
    <div className="space-y-6">
      
      {/* Top Hero Welcome Section (Matching Sellix Reference UI: "Hello Orlando...") */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Hero Banner & 3 Overlay KPI Cards (2 Columns) */}
        <div className="lg:col-span-2 hero-gradient-card p-6 rounded-2xl flex flex-col justify-between relative overflow-hidden">
          <div className="mb-4">
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight font-sans">
              Hello Sravanthi,
            </h2>
            <p className="text-sm font-medium text-slate-600">
              welcome back and let's optimize your regional promotional campaigns!
            </p>
          </div>

          {/* 3 Metric Cards Overlay (Total Revenue, Approved Orders, Monthly Growth) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200/80 flex items-center justify-between">
              <div>
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Revenue Lift</div>
                <div className="text-lg font-black text-slate-900 mt-0.5">
                  ${(summary?.totalIncrementalRevenue || 248560).toLocaleString()}
                </div>
                <div className="text-[10px] text-emerald-600 font-bold mt-1">vs last month: +8.6%</div>
              </div>
              <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200/80 flex items-center justify-between">
              <div>
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Approved Promos</div>
                <div className="text-lg font-black text-slate-900 mt-0.5">
                  {summary?.approvedCount || 12} campaigns
                </div>
                <div className="text-[10px] text-slate-500 font-medium mt-1">avg/day: 4 campaigns</div>
              </div>
              <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Package className="w-4 h-4" />
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200/80 flex items-center justify-between">
              <div>
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Readiness Score</div>
                <div className="text-lg font-black text-emerald-600 mt-0.5">
                  +{summary?.readinessScore || 88}%
                </div>
                <div className="text-[10px] text-slate-500 font-medium mt-1">trend: steady rise</div>
              </div>
              <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>

          </div>
        </div>

        {/* Product Sales Category Donut Chart Card (Right Column) */}
        <div className="saas-card p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-slate-900">Product Sales Category</h3>
            <span className="text-xs text-slate-400">···</span>
          </div>

          <div className="h-44 flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={42}
                  outerRadius={68}
                  paddingAngle={3}
                  dataKey="revenue"
                >
                  {categoryChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', borderRadius: '12px', fontSize: '11px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Mini Category Chips */}
          <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-slate-100 text-[11px]">
            {categoryChartData.slice(0, 4).map((c, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }}></span>
                <span className="text-slate-600 font-medium truncate">{c.category}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Operational Risk Status Quad Cards (Matching Reference 4-box Grid) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        
        <div className="saas-card p-4 flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-slate-500">🟢 Healthy Stock</div>
            <div className="text-xl font-extrabold text-slate-900 mt-1">
              {summary?.riskDistribution?.healthyCount || 18}
            </div>
            <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">Ready to Launch</div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="saas-card p-4 flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-slate-500">🟡 Tight Stock</div>
            <div className="text-xl font-extrabold text-slate-900 mt-1">
              {summary?.riskDistribution?.tightStockCount || 6}
            </div>
            <div className="text-[10px] text-amber-600 font-semibold mt-0.5">Buffer Warning</div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="saas-card p-4 flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-slate-500">🔴 Stockout Risk</div>
            <div className="text-xl font-extrabold text-slate-900 mt-1">
              {summary?.riskDistribution?.stockoutRiskCount || 8}
            </div>
            <div className="text-[10px] text-red-600 font-semibold mt-0.5">Inventory Shortfall</div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
            <Zap className="w-5 h-5" />
          </div>
        </div>

        <div className="saas-card p-4 flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-slate-500">🟠 Margin Risk</div>
            <div className="text-xl font-extrabold text-slate-900 mt-1">
              {summary?.riskDistribution?.marginRiskCount || 4}
            </div>
            <div className="text-[10px] text-orange-600 font-semibold mt-0.5">Below 15% Floor</div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* Natural Language Prompt Search Bar */}
      <div className="saas-card p-4">
        <form onSubmit={handleNLSubmit} className="relative flex items-center">
          <Sparkles className="w-4 h-4 text-indigo-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Ask AI Filter (e.g., 'Show me high margin footwear in North region with low stockout risk')..."
            value={nlQuery}
            onChange={(e) => setNlQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-24 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
          />
          <button
            type="submit"
            className="absolute right-2 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-lg transition-all shadow-sm"
          >
            AI Search
          </button>
        </form>

        {/* Quick Chips */}
        <div className="flex flex-wrap items-center gap-2 mt-3 pt-2 border-t border-slate-100">
          <span className="text-[11px] font-semibold text-slate-400">Quick Prompt Chips:</span>
          {quickChips.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleChipClick(chip.query)}
              className="px-2.5 py-1 rounded-lg text-xs bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 transition-all"
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      {/* Filter & Sort Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 saas-card p-3.5">
        <div className="flex flex-wrap items-center gap-3">
          
          <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
            <span className="text-xs text-slate-500">Region:</span>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Regions</option>
              <option value="North Region">North Region</option>
              <option value="South Region">South Region</option>
              <option value="East Region">East Region</option>
              <option value="West Region">West Region</option>
              <option value="Central Region">Central Region</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
            <span className="text-xs text-slate-500">Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Categories</option>
              <option value="Footwear">Footwear</option>
              <option value="Apparel">Apparel</option>
              <option value="Beauty & Care">Beauty & Care</option>
              <option value="Home Goods">Home Goods</option>
              <option value="Outdoor Gear">Outdoor Gear</option>
              <option value="Electronics">Electronics</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
            <span className="text-xs text-slate-500">Risk Badge:</span>
            <select
              value={selectedRisk}
              onChange={(e) => setSelectedRisk(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Risk Levels</option>
              <option value="HEALTHY">🟢 Healthy Stock</option>
              <option value="TIGHT_STOCK">🟡 Tight Stock</option>
              <option value="STOCKOUT_RISK">🔴 Stockout Risk</option>
              <option value="MARGIN_RISK">🟠 Margin Risk</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
            <span className="text-xs text-slate-500">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="DRAFT">Draft</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>

        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
            <ArrowUpDown className="w-3.5 h-3.5 text-indigo-600" />
            <span className="text-xs text-slate-500">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="FIT_SCORE">Fit Score (High-Low)</option>
              <option value="REVENUE">Projected Rev Lift</option>
              <option value="MARGIN">Post-Promo Margin %</option>
            </select>
          </div>

          {healthyDraftCount > 0 && (
            <button
              onClick={onBulkApproveHealthy}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all shadow-sm active:scale-95"
            >
              <CheckCheck className="w-4 h-4" />
              Approve {healthyDraftCount} Healthy
            </button>
          )}
        </div>
      </div>

      {/* Grid of Recommendation Cards */}
      {filtered.length === 0 ? (
        <div className="saas-card p-12 text-center space-y-3">
          <AlertCircle className="w-10 h-10 text-slate-400 mx-auto" />
          <h4 className="text-base font-bold text-slate-800">No matching recommendations found</h4>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Try clearing your search query or adjusting your risk/region filter criteria.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5">
          {filtered.map((item) => (
            <RecommendationCard
              key={item.id}
              item={item}
              onStatusChange={onStatusChange}
              onDiscountChange={onDiscountChange}
              onAddNote={onAddNote}
              onInspectAssessment={(itm) => {
                if (onInspectAssessment) onInspectAssessment(itm);
                setSelectedAssessmentItem(itm);
              }}
            />
          ))}
        </div>
      )}

      {/* Render Product Assessment Modal */}
      {selectedAssessmentItem && (
        <ProductAssessmentModal
          item={selectedAssessmentItem}
          onClose={() => setSelectedAssessmentItem(null)}
        />
      )}

    </div>
  );
}
