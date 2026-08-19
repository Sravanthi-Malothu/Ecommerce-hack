import React, { useState } from 'react';
import {
  Building2,
  Users,
  Package,
  Brain,
  TrendingUp,
  Warehouse,
  Tag,
  ChevronRight,
  ChevronDown,
  Sparkles,
  ShieldCheck,
  Clock,
  DollarSign,
  Layers,
  Search,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { CATALOG_PRODUCTS } from '../utils/productCatalog.js';

export default function BusinessArchitectureView() {
  const [selectedProductId, setSelectedProductId] = useState('prod_coffee_roast');
  const [expandedBranch, setExpandedBranch] = useState('BRANCH_PRODUCTS');

  const selectedProduct = CATALOG_PRODUCTS.find(p => p.product_id === selectedProductId) || CATALOG_PRODUCTS[0];

  const branches = [
    {
      id: 'BRANCH_COMMERCE',
      name: '1. Commerce Type',
      icon: Building2,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
      description: 'Omnichannel B2C E-Commerce & Regional Retail Store Network',
      items: [
        { label: 'Primary Model', value: 'B2C Direct-to-Consumer & Retail POS' },
        { label: 'Fulfillment Channels', value: 'Store Delivery, Curbside Pickup, Central Warehouse' },
        { label: 'Store Regions', value: '5 Regional Clusters (North, South, East, West, Central)' }
      ]
    },
    {
      id: 'BRANCH_SEGMENTS',
      name: '2. Customer Segments',
      icon: Users,
      color: 'text-purple-600 bg-purple-50 border-purple-200',
      description: '5 Core Behavioral & RFM Customer Segment Profiles',
      items: [
        { label: 'Urban Fitness Enthusiasts', value: '45,000 members (High Sensitivity: 0.45)' },
        { label: 'Bargain Hunters', value: '92,000 members (High Sensitivity: 0.92)' },
        { label: 'High-Value VIP Loyalists', value: '18,000 members (Low Sensitivity: 0.25)' },
        { label: 'Tech & Trendsetters', value: '31,000 members (Sensitivity: 0.38)' },
        { label: 'Seasonal Home Organizers', value: '64,000 members (Sensitivity: 0.65)' }
      ]
    },
    {
      id: 'BRANCH_PRODUCTS',
      name: '3. Products',
      icon: Package,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
      description: '17 Product Specs (SKU, Cost, Price, Margin, Stock, Shelf Life, Seasonality, Substitutability)',
      items: [
        { label: 'SKU Code', value: selectedProduct.sku },
        { label: 'Category / Subcategory', value: `${selectedProduct.category} • ${selectedProduct.subcategory}` },
        { label: 'Price & Unit Cost', value: `Base: ₹${selectedProduct.base_price} | Cost: ₹${selectedProduct.unit_cost}` },
        { label: 'Post-Discount Margin', value: `${(selectedProduct.margin_pct * 100).toFixed(1)}% Base Margin` },
        { label: 'Shelf Life', value: selectedProduct.shelf_life },
        { label: 'Seasonality Peak', value: selectedProduct.seasonality },
        { label: 'Substitutability', value: selectedProduct.substitutability }
      ]
    },
    {
      id: 'BRANCH_BEHAVIOUR',
      name: '4. Customer Behaviour',
      icon: Brain,
      color: 'text-blue-600 bg-blue-50 border-blue-200',
      description: 'Purchase Frequency, Avg Basket, Recency, Price Sensitivity & Category Affinity',
      items: [
        { label: 'Purchase Frequency', value: 'Weekly to Monthly (2.4x / mo avg)' },
        { label: 'Average Basket Size', value: '₹3,450 per checkout' },
        { label: 'Recency Engagement', value: 'Active (4 to 28 days cooldown)' },
        { label: 'Price Sensitivity', value: 'Segment-weighted (0.25 VIP to 0.92 Bargain)' },
        { label: 'Category Affinity', value: '95% Preferred Category Score' }
      ]
    },
    {
      id: 'BRANCH_DEMAND',
      name: '5. Demand',
      icon: TrendingUp,
      color: 'text-amber-600 bg-amber-50 border-amber-200',
      description: 'Historical Sales, Seasonality, Event Impacts, Trends & External Factors',
      items: [
        { label: 'Historical Sales Volume', value: `${selectedProduct.avg_weekly_demand * 4} units / month baseline` },
        { label: 'Seasonality Index', value: selectedProduct.seasonality },
        { label: 'Event Impact', value: selectedProduct.event_impact },
        { label: 'Trend Search Score', value: selectedProduct.trend_score },
        { label: 'External Weather Factors', value: selectedProduct.external_factors }
      ]
    },
    {
      id: 'BRANCH_INVENTORY',
      name: '6. Inventory',
      icon: Warehouse,
      color: 'text-rose-600 bg-rose-50 border-rose-200',
      description: 'Current Stock, Incoming Stock, Safety Stock, Lead Time, Expiry & Holding Cost',
      items: [
        { label: 'Incoming Stock', value: `+${selectedProduct.incoming_stock} units arriving in ${selectedProduct.lead_time}` },
        { label: 'Safety Stock Floor', value: `${selectedProduct.safety_stock} units minimum threshold` },
        { label: 'Reorder Lead Time', value: selectedProduct.lead_time },
        { label: 'Batch Expiry Date', value: selectedProduct.expiry },
        { label: 'Monthly Holding Cost', value: selectedProduct.holding_cost }
      ]
    },
    {
      id: 'BRANCH_PROMOTIONS',
      name: '7. Promotions',
      icon: Tag,
      color: 'text-teal-600 bg-teal-50 border-teal-200',
      description: 'Discount, Bundle, Coupon, Personalized Offer, Cross-sell & Clearance',
      items: [
        { label: 'Discount Depths', value: '10% OFF, 15% OFF, 20% OFF, 25% OFF' },
        { label: 'Bundle Co-Promotes', value: 'Cross-product accessories (+68.4% attachment)' },
        { label: 'Coupon Code', value: selectedProduct.coupon_code },
        { label: 'Offer Type Suite', value: selectedProduct.offer_type },
        { label: 'Clearance & Cross-sell', value: 'Automated margin-floor protected clearance' }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="saas-card p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Layers className="w-5 h-5 text-indigo-400" />
            <h2 className="text-xl font-extrabold text-white tracking-tight font-sans">
              Complete 7-Branch Retail Business Architecture
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              100% Hierarchy Coverage
            </span>
          </div>
          <p className="text-xs text-slate-300">
            Full-stack data model &amp; decision matrix covering Commerce Type, Customer Segments, Products, Behaviour, Demand, Inventory, and Promotion Suites.
          </p>
        </div>

        {/* Product Selector */}
        <div className="flex items-center gap-2 bg-slate-800/80 p-2.5 rounded-2xl border border-slate-700">
          <span className="text-xs text-slate-300 font-medium">Select Product:</span>
          <select
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(e.target.value)}
            className="bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-700 focus:outline-none cursor-pointer"
          >
            {CATALOG_PRODUCTS.map(p => (
              <option key={p.product_id} value={p.product_id}>
                {p.product_name} ({p.category})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Interactive 7-Branch Tree Explorer & Product Specification Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: 7-Branch Interactive Tree Menu */}
        <div className="saas-card p-5 space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-2">
            <Building2 className="w-4 h-4 text-indigo-600" />
            7 Business Hierarchy Branches
          </h3>

          <div className="space-y-2">
            {branches.map((b) => {
              const Icon = b.icon;
              const isExpanded = expandedBranch === b.id;

              return (
                <div key={b.id} className="rounded-2xl border border-slate-200 overflow-hidden bg-white">
                  <button
                    onClick={() => setExpandedBranch(isExpanded ? '' : b.id)}
                    className={`w-full p-3.5 flex items-center justify-between text-left transition-colors ${
                      isExpanded ? 'bg-slate-50' : 'hover:bg-slate-50/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold border ${b.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">{b.name}</div>
                        <div className="text-[10px] text-slate-500 truncate max-w-[200px]">{b.description}</div>
                      </div>
                    </div>

                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="p-3.5 bg-slate-50/80 border-t border-slate-100 space-y-2 text-xs">
                      {b.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center py-1 border-b border-slate-200/60 last:border-none">
                          <span className="text-slate-500 font-medium">{item.label}</span>
                          <span className="font-bold text-slate-900 text-right">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Product 7-Branch Complete Specification Matrix (2 Cols) */}
        <div className="lg:col-span-2 saas-card p-6 space-y-5 bg-white">
          
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                {selectedProduct.category} • {selectedProduct.subcategory}
              </span>
              <h3 className="text-lg font-black text-slate-900 mt-1">
                {selectedProduct.product_name}
              </h3>
              <span className="text-xs text-slate-500 font-medium">SKU: {selectedProduct.sku}</span>
            </div>

            <div className="text-right">
              <div className="text-xs text-slate-400 font-medium">Base Price</div>
              <div className="text-xl font-black text-slate-900">₹{selectedProduct.base_price}</div>
              <span className="text-[11px] text-emerald-600 font-bold">
                Margin: {(selectedProduct.margin_pct * 100).toFixed(1)}% (Cost: ₹{selectedProduct.unit_cost})
              </span>
            </div>
          </div>

          {/* 7 Branch Cards Grid for Selected Product */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Products (Branch 3) */}
            <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-2">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                <Package className="w-4 h-4 text-emerald-600" />
                Products Branch
              </span>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between"><span className="text-slate-500">Shelf Life:</span> <strong className="text-slate-900">{selectedProduct.shelf_life}</strong></div>
                <div className="flex justify-between"><span className="text-slate-500">Seasonality:</span> <strong className="text-slate-900">{selectedProduct.seasonality}</strong></div>
                <div className="flex justify-between"><span className="text-slate-500">Substitutability:</span> <strong className="text-slate-900">{selectedProduct.substitutability}</strong></div>
              </div>
            </div>

            {/* Inventory (Branch 6) */}
            <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-100 space-y-2">
              <span className="text-xs font-bold text-rose-800 uppercase tracking-wider flex items-center gap-1.5">
                <Warehouse className="w-4 h-4 text-rose-600" />
                Inventory Branch
              </span>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between"><span className="text-slate-500">Incoming Stock:</span> <strong className="text-slate-900">+{selectedProduct.incoming_stock} units</strong></div>
                <div className="flex justify-between"><span className="text-slate-500">Safety Stock Floor:</span> <strong className="text-slate-900">{selectedProduct.safety_stock} units</strong></div>
                <div className="flex justify-between"><span className="text-slate-500">Lead Time &amp; Expiry:</span> <strong className="text-slate-900">{selectedProduct.lead_time} ({selectedProduct.expiry})</strong></div>
                <div className="flex justify-between"><span className="text-slate-500">Holding Cost:</span> <strong className="text-slate-900">{selectedProduct.holding_cost}</strong></div>
              </div>
            </div>

            {/* Demand (Branch 5) */}
            <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-100 space-y-2">
              <span className="text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-amber-600" />
                Demand Branch
              </span>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between"><span className="text-slate-500">Event Impact:</span> <strong className="text-slate-900">{selectedProduct.event_impact}</strong></div>
                <div className="flex justify-between"><span className="text-slate-500">Trend Score:</span> <strong className="text-slate-900">{selectedProduct.trend_score}</strong></div>
                <div className="flex justify-between"><span className="text-slate-500">External Factors:</span> <strong className="text-slate-900">{selectedProduct.external_factors}</strong></div>
              </div>
            </div>

            {/* Promotions (Branch 7) */}
            <div className="p-4 rounded-2xl bg-teal-50/50 border border-teal-100 space-y-2">
              <span className="text-xs font-bold text-teal-800 uppercase tracking-wider flex items-center gap-1.5">
                <Tag className="w-4 h-4 text-teal-600" />
                Promotions Branch
              </span>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between"><span className="text-slate-500">Coupon Code:</span> <strong className="text-teal-900 font-extrabold">{selectedProduct.coupon_code}</strong></div>
                <div className="flex justify-between"><span className="text-slate-500">Offer Type Suite:</span> <strong className="text-slate-900">{selectedProduct.offer_type}</strong></div>
                <div className="flex justify-between"><span className="text-slate-500">Discount Depths:</span> <strong className="text-slate-900">10% - 25% OFF</strong></div>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
