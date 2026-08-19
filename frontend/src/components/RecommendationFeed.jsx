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
  AlertTriangle,
  Layers,
  Users,
  MapPin
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
  const [groupBy, setGroupBy] = useState('PRODUCT'); // 'PRODUCT', 'SEGMENT', 'REGION'

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

  // Grouping logic based on groupBy state
  const groupKeyAttr = groupBy === 'PRODUCT' ? 'product_name' : groupBy === 'SEGMENT' ? 'segment_name' : 'region';

  const groupedMap = {};
  filtered.forEach((item) => {
    const key = item[groupKeyAttr] || 'General';
    if (!groupedMap[key]) {
      groupedMap[key] = [];
    }
    groupedMap[key].push(item);
  });

  const healthyDraftCount = recommendations.filter(
    (r) => r.constraintEval.riskLevel === 'HEALTHY' && r.status === 'DRAFT'
  ).length;

  const PIE_COLORS = ['#4F46E5', '#38BDF8', '#10B981', '#F59E0B', '#EC4899'];

  return (
    <div className="space-y-6">
      
      {/* Top Hero Welcome Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Hero Banner & 3 Overlay KPI Cards */}
        <div className="lg:col-span-2 hero-gradient-card p-6 rounded-2xl flex flex-col justify-between relative overflow-hidden">
          <div className="mb-4">
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight font-sans">
              Hello Sravanthi,
            </h2>
            <p className="text-sm font-medium text-slate-600">
              welcome back and let's optimize your regional promotional campaigns!
            </p>
          </div>

          {/* 3 Metric Cards Overlay */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200/80 flex items-center justify-between">
              <div>
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Revenue Lift</div>
                <div className="text-lg font-black text-slate-900 mt-0.5">
                  +${(summary?.totalIncrementalRevenue || 0).toLocaleString()}
                </div>
              </div>
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">
                +24%
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200/80 flex items-center justify-between">
              <div>
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Approved Campaigns</div>
                <div className="text-lg font-black text-slate-900 mt-0.5">
                  {summary?.approvedCount || 0} / {summary?.totalRecommendationsCount || 0}
                </div>
              </div>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200/80 flex items-center justify-between">
              <div>
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Campaign Readiness</div>
                <div className="text-lg font-black text-emerald-600 mt-0.5">
                  {summary?.readinessScore || 88}%
                </div>
              </div>
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">
                AI
              </div>
            </div>
          </div>
        </div>

        {/* Donut Chart Component */}
        <div className="saas-card p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <PieIcon className="w-4 h-4 text-indigo-600" />
              Product Sales Category
            </h3>
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              {summary?.datasetName || 'Retail Data'}
            </span>
          </div>

          <div className="h-44 w-full relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={summary?.categoryBreakdown || [
                    { category: 'Footwear', revenue: 145000 },
                    { category: 'Electronics', revenue: 198000 },
                    { category: 'Apparel', revenue: 92000 },
                    { category: 'Home Goods', revenue: 64000 }
                  ]}
                  dataKey="revenue"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={65}
                  paddingAngle={3}
                >
                  {PIE_COLORS.map((color, index) => (
                    <Cell key={`cell-${index}`} fill={color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val) => `$${Number(val).toLocaleString()}`}
                  contentStyle={{ backgroundColor: '#1E293B', color: '#FFF', borderRadius: '12px', border: 'none', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-base font-black text-slate-900">${((summary?.totalMarginDollars || 420000) / 1000).toFixed(0)}k</span>
              <span className="text-[9px] font-semibold text-slate-400 uppercase">Margin</span>
            </div>
          </div>
        </div>

      </div>

      {/* Natural Language Prompt Search Bar */}
      <div className="saas-card p-4 space-y-3 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white">
        <form onSubmit={handleNLSubmit} className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-indigo-300 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Ask AI search (e.g. 'Show footwear in West region with >50% margin')..."
              value={nlQuery}
              onChange={(e) => setNlQuery(e.target.value)}
              className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-400 focus:bg-slate-800"
            />
          </div>

          <button
            type="submit"
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition-all shadow-md active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Search</span>
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[11px] text-slate-400 font-medium mr-1">Quick Prompts:</span>
          {quickChips.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleChipClick(chip.query)}
              className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white border border-slate-700/80 transition-all"
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      {/* View Switcher & Filters Header Row */}
      <div className="saas-card p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Left: View Switcher (Product-Wise / Segment-Wise / Region-Wise) */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => setGroupBy('PRODUCT')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              groupBy === 'PRODUCT'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>🛍️ Group Product-Wise</span>
          </button>

          <button
            onClick={() => setGroupBy('SEGMENT')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              groupBy === 'SEGMENT'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>👥 Group Segment-Wise</span>
          </button>

          <button
            onClick={() => setGroupBy('REGION')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              groupBy === 'REGION'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>📍 Group Region-Wise</span>
          </button>
        </div>

        {/* Right: Filters & Actions */}
        <div className="flex flex-wrap items-center gap-2">
          
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
            <span className="text-xs text-slate-500">Risk:</span>
            <select
              value={selectedRisk}
              onChange={(e) => setSelectedRisk(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Risks</option>
              <option value="HEALTHY">🟢 Healthy Stock</option>
              <option value="STOCKOUT_RISK">🔴 Stockout Risk</option>
              <option value="MARGIN_RISK">🟠 Margin Risk</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
            <ArrowUpDown className="w-3.5 h-3.5 text-indigo-600" />
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
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all shadow-sm active:scale-95"
            >
              <CheckCheck className="w-4 h-4" />
              Approve {healthyDraftCount} Healthy
            </button>
          )}

        </div>

      </div>

      {/* Recommendation Feed Content (Grouped by Selected View) */}
      {filtered.length === 0 ? (
        <div className="saas-card p-12 text-center space-y-3">
          <AlertCircle className="w-10 h-10 text-slate-400 mx-auto" />
          <h4 className="text-base font-bold text-slate-800">No matching recommendations found</h4>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Try clearing your search query or adjusting your risk/region filter criteria.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedMap).map(([groupTitle, groupItems]) => (
            <div key={groupTitle} className="space-y-4">
              
              {/* Group Header Banner */}
              <div className="flex items-center justify-between bg-white px-5 py-3.5 rounded-2xl border border-slate-200 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                    {groupBy === 'PRODUCT' ? <Package className="w-5 h-5" /> : groupBy === 'SEGMENT' ? <Users className="w-5 h-5" /> : <MapPin className="w-5 h-5" />}
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900 tracking-tight font-sans">
                      {groupTitle}
                    </h3>
                    <span className="text-xs font-medium text-slate-500">
                      {groupItems.length} candidate promotion option(s) targeting different regions & segments
                    </span>
                  </div>
                </div>

                <span className="px-3 py-1 rounded-xl text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                  {groupBy === 'PRODUCT' ? `Base Price: $${groupItems[0]?.base_price || 150}` : `Group: ${groupTitle}`}
                </span>
              </div>

              {/* Group Child Recommendation Cards */}
              <div className="grid grid-cols-1 gap-4">
                {groupItems.map((item) => (
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

            </div>
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
