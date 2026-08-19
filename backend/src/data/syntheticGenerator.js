import { v4 as uuidv4 } from 'uuid';

/**
 * PromoAlign Synthetic Data Generator
 * Generates realistic retail datasets mapped across all 7 Business Architecture Branches:
 * 1. Commerce Type (Omnichannel B2C E-Commerce & Retail Stores)
 * 2. Customer Segments (RFM, Discount Sensitivity, Recency, Category Affinity)
 * 3. Products (SKU, Cost, Price, Margin, Stock, Shelf Life, Seasonality, Substitutability)
 * 4. Customer Behaviour (Purchase Frequency, Avg Basket, Recency, Price Sensitivity)
 * 5. Demand (Historical Sales, Seasonality, Events, Trends, External Factors)
 * 6. Inventory (Current Stock, Incoming Stock, Safety Stock, Lead Time, Expiry, Holding Cost)
 * 7. Promotions (Discount, Bundle, Coupon, Personalized Offer, Cross-sell, Clearance)
 */

export const CUSTOMER_SEGMENTS = [
  {
    segment_id: 'seg_urban_fitness',
    segment_name: 'Urban Fitness Enthusiasts',
    description: 'Active professionals, high spenders on athletic wear, footwear & tech wearables',
    size: 45000,
    avg_discount_sensitivity: 0.45,
    avg_order_value: 135.0,
    preferred_categories: ['Footwear', 'Apparel', 'Electronics', 'Outdoor Gear'],
    last_promo_days_ago: 28,
    purchase_frequency: 'Bi-Weekly (2.4x/mo)',
    average_basket: '₹3,450',
    recency_score: 'Active (4 days ago)'
  },
  {
    segment_id: 'seg_bargain_hunters',
    segment_name: 'Bargain Hunters',
    description: 'Price-sensitive shoppers driven by flash sales, clothing & home deals',
    size: 92000,
    avg_discount_sensitivity: 0.92,
    avg_order_value: 68.0,
    preferred_categories: ['Apparel', 'Home Goods', 'Beauty & Care'],
    last_promo_days_ago: 6, // Trigger for promo fatigue
    purchase_frequency: 'Monthly (1.1x/mo)',
    average_basket: '₹1,850',
    recency_score: 'Active (6 days ago)'
  },
  {
    segment_id: 'seg_loyalty_vip',
    segment_name: 'High-Value VIP Loyalists',
    description: 'Frequent buyers with high brand affinity, luxury beauty & outdoor gear',
    size: 18000,
    avg_discount_sensitivity: 0.25,
    avg_order_value: 240.0,
    preferred_categories: ['Outdoor Gear', 'Apparel', 'Beauty & Care'],
    last_promo_days_ago: 42,
    purchase_frequency: 'Weekly (4.2x/mo)',
    average_basket: '₹6,800',
    recency_score: 'Highly Active (1 day ago)'
  },
  {
    segment_id: 'seg_tech_trendsetters',
    segment_name: 'Tech & Trendsetters',
    description: 'Early adopters seeking latest gadgets, smart home & premium tech',
    size: 31000,
    avg_discount_sensitivity: 0.38,
    avg_order_value: 195.0,
    preferred_categories: ['Electronics', 'Home Goods'],
    last_promo_days_ago: 21,
    purchase_frequency: 'Monthly (1.5x/mo)',
    average_basket: '₹5,200',
    recency_score: 'Active (12 days ago)'
  },
  {
    segment_id: 'seg_home_organizers',
    segment_name: 'Seasonal Home Organizers',
    description: 'Families shopping for seasonal upgrades, kitchenware & home wellness',
    size: 64000,
    avg_discount_sensitivity: 0.65,
    avg_order_value: 110.0,
    preferred_categories: ['Home Goods', 'Beauty & Care', 'Outdoor Gear'],
    last_promo_days_ago: 18,
    purchase_frequency: 'Monthly (1.3x/mo)',
    average_basket: '₹2,900',
    recency_score: 'Active (18 days ago)'
  }
];

export const PRODUCTS = [
  {
    product_id: 'prod_coffee_roast',
    sku: 'SKU-HG-COFF-101',
    product_name: 'Organic Dark Roast Gourmet Coffee',
    category: 'Home Goods',
    subcategory: 'Beverages & Pantry',
    base_price: 150.0,
    unit_cost: 100.0,
    margin_pct: 0.333,
    shelf_life: '180 Days',
    seasonality: 'High Repeat Daily Demand',
    substitutability: 'High Substitutability',
    incoming_stock: 450,
    safety_stock: 120,
    lead_time: '3 Days',
    expiry: 'Dec 2026',
    holding_cost: '₹8 / unit / mo',
    event_impact: 'Diwali Morning Special (+35% Demand)',
    trend_score: '+22.4% Search Momentum',
    external_factors: 'Winter Morning Demand Surge',
    coupon_code: 'COFFEE20',
    offer_type: 'Discount & Bundle',
    avg_weekly_demand: 500
  },
  {
    product_id: 'prod_running_shoes_apex',
    sku: 'SKU-FW-APEX-202',
    product_name: 'Apex Trail Running Shoes',
    category: 'Footwear',
    subcategory: 'Athletic Footwear',
    base_price: 150.0,
    unit_cost: 78.0,
    margin_pct: 0.48,
    shelf_life: 'Non-Perishable',
    seasonality: 'Spring/Summer Peak',
    substitutability: 'Medium Substitutability',
    incoming_stock: 200,
    safety_stock: 80,
    lead_time: '5 Days',
    expiry: 'N/A',
    holding_cost: '₹15 / unit / mo',
    event_impact: 'Marathon Season Festival (+48% Demand)',
    trend_score: '+18.5% Search Interest',
    external_factors: 'Dry Outdoor Fitness Season',
    coupon_code: 'APEXRUN15',
    offer_type: 'Personalized Offer',
    avg_weekly_demand: 140
  },
  {
    product_id: 'prod_hiking_boots',
    sku: 'SKU-FW-BOOT-303',
    product_name: 'All-Terrain Waterproof Hiking Boots',
    category: 'Footwear',
    subcategory: 'Outdoor Footwear',
    base_price: 185.0,
    unit_cost: 88.8,
    margin_pct: 0.52,
    shelf_life: 'Non-Perishable',
    seasonality: 'Fall/Winter',
    substitutability: 'Low Substitutability',
    incoming_stock: 150,
    safety_stock: 60,
    lead_time: '7 Days',
    expiry: 'N/A',
    holding_cost: '₹18 / unit / mo',
    event_impact: 'Mountain Trekking Fest (+42% Demand)',
    trend_score: '+15.2% Search Momentum',
    external_factors: 'Monsoon Outdoor Weather',
    coupon_code: 'HIKEBOOT20',
    offer_type: 'Cross-sell',
    avg_weekly_demand: 95
  },
  {
    product_id: 'prod_casual_sneakers',
    sku: 'SKU-FW-SNKR-404',
    product_name: 'Classic Organic Canvas Sneakers',
    category: 'Footwear',
    subcategory: 'Casual Footwear',
    base_price: 85.0,
    unit_cost: 46.75,
    margin_pct: 0.45,
    shelf_life: 'Non-Perishable',
    seasonality: 'Year-round',
    substitutability: 'High Substitutability',
    incoming_stock: 300,
    safety_stock: 100,
    lead_time: '4 Days',
    expiry: 'N/A',
    holding_cost: '₹10 / unit / mo',
    event_impact: 'Back to College Sale (+30% Demand)',
    trend_score: '+12.0% Search Momentum',
    external_factors: 'Urban Youth Trend',
    coupon_code: 'SNEAKER10',
    offer_type: 'Discount',
    avg_weekly_demand: 180
  },
  {
    product_id: 'prod_winter_parka',
    sku: 'SKU-AP-PARK-505',
    product_name: 'UltraWarm Waterproof Winter Parka',
    category: 'Apparel',
    subcategory: 'Outerwear',
    base_price: 280.0,
    unit_cost: 126.0,
    margin_pct: 0.55,
    shelf_life: 'Non-Perishable',
    seasonality: 'Fall/Winter',
    substitutability: 'Low Substitutability',
    incoming_stock: 120,
    safety_stock: 50,
    lead_time: '6 Days',
    expiry: 'N/A',
    holding_cost: '₹22 / unit / mo',
    event_impact: 'Winter Solstice Clearance (+55% Demand)',
    trend_score: '+28.4% Search Momentum',
    external_factors: 'Cold Wave Weather Alert',
    coupon_code: 'PARKA25',
    offer_type: 'Clearance',
    avg_weekly_demand: 90
  },
  {
    product_id: 'prod_leather_jacket',
    sku: 'SKU-AP-LTHR-606',
    product_name: 'Premium Italian Napa Leather Jacket',
    category: 'Apparel',
    subcategory: 'Luxury Apparel',
    base_price: 340.0,
    unit_cost: 136.0,
    margin_pct: 0.60,
    shelf_life: 'Non-Perishable',
    seasonality: 'Fall/Winter',
    substitutability: 'Low Substitutability',
    incoming_stock: 80,
    safety_stock: 30,
    lead_time: '10 Days',
    expiry: 'N/A',
    holding_cost: '₹30 / unit / mo',
    event_impact: 'Festive Fashion Gala (+25% Demand)',
    trend_score: '+14.1% Search Momentum',
    external_factors: 'Luxury Trend Demand',
    coupon_code: 'VIPLUXURY',
    offer_type: 'Personalized Offer',
    avg_weekly_demand: 40
  },
  {
    product_id: 'prod_yoga_activewear_set',
    sku: 'SKU-AP-YOGA-707',
    product_name: 'Luxe Breathable Yoga Activewear Set',
    category: 'Apparel',
    subcategory: 'Athletic Apparel',
    base_price: 95.0,
    unit_cost: 39.9,
    margin_pct: 0.58,
    shelf_life: 'Non-Perishable',
    seasonality: 'Year-round',
    substitutability: 'Medium Substitutability',
    incoming_stock: 350,
    safety_stock: 120,
    lead_time: '3 Days',
    expiry: 'N/A',
    holding_cost: '₹9 / unit / mo',
    event_impact: 'International Yoga Day (+60% Demand)',
    trend_score: '+31.0% Search Momentum',
    external_factors: 'Wellness Habit Trend',
    coupon_code: 'YOGA20',
    offer_type: 'Bundle & Discount',
    avg_weekly_demand: 210
  },
  {
    product_id: 'prod_office_chair',
    sku: 'SKU-HG-CHAIR-808',
    product_name: 'Ergonomic Mesh Executive Chair',
    category: 'Home Goods',
    subcategory: 'Furniture',
    base_price: 210.0,
    unit_cost: 121.8,
    margin_pct: 0.42,
    shelf_life: 'Non-Perishable',
    seasonality: 'Back-to-Work',
    substitutability: 'Medium Substitutability',
    incoming_stock: 90,
    safety_stock: 40,
    lead_time: '8 Days',
    expiry: 'N/A',
    holding_cost: '₹25 / unit / mo',
    event_impact: 'Work-from-Home Upgrade (+32% Demand)',
    trend_score: '+16.5% Search Momentum',
    external_factors: 'Corporate Work-from-Home Trend',
    coupon_code: 'WORKCHAIR15',
    offer_type: 'Discount',
    avg_weekly_demand: 65
  },
  {
    product_id: 'prod_espresso_maker',
    sku: 'SKU-HG-ESPR-909',
    product_name: 'Compact Artisan Espresso Machine',
    category: 'Home Goods',
    subcategory: 'Kitchen Appliances',
    base_price: 260.0,
    unit_cost: 135.2,
    margin_pct: 0.48,
    shelf_life: 'Non-Perishable',
    seasonality: 'Holiday Gifting',
    substitutability: 'Low Substitutability',
    incoming_stock: 110,
    safety_stock: 45,
    lead_time: '6 Days',
    expiry: 'N/A',
    holding_cost: '₹20 / unit / mo',
    event_impact: 'Diwali Kitchen Gifting (+50% Demand)',
    trend_score: '+26.8% Search Momentum',
    external_factors: 'Home Barista Trend',
    coupon_code: 'ESPRESSO20',
    offer_type: 'Bundle & Cross-sell',
    avg_weekly_demand: 75
  },
  {
    product_id: 'prod_dutch_oven',
    sku: 'SKU-HG-OVEN-1010',
    product_name: 'Enameled Cast Iron Dutch Oven Set',
    category: 'Home Goods',
    subcategory: 'Cookware',
    base_price: 140.0,
    unit_cost: 70.0,
    margin_pct: 0.50,
    shelf_life: 'Non-Perishable',
    seasonality: 'Fall/Winter',
    substitutability: 'Medium Substitutability',
    incoming_stock: 160,
    safety_stock: 60,
    lead_time: '5 Days',
    expiry: 'N/A',
    holding_cost: '₹14 / unit / mo',
    event_impact: 'Festive Cooking Event (+40% Demand)',
    trend_score: '+19.2% Search Momentum',
    external_factors: 'Home Culinary Trend',
    coupon_code: 'DUTCHOVEN15',
    offer_type: 'Discount',
    avg_weekly_demand: 110
  },
  {
    product_id: 'prod_robot_vacuum',
    sku: 'SKU-HG-ROBOT-1111',
    product_name: 'Smart Navigation Robot Vacuum Cleaner',
    category: 'Home Goods',
    subcategory: 'Smart Appliances',
    base_price: 310.0,
    unit_cost: 161.2,
    margin_pct: 0.48,
    shelf_life: 'Non-Perishable',
    seasonality: 'Diwali Deep Clean',
    substitutability: 'Low Substitutability',
    incoming_stock: 140,
    safety_stock: 50,
    lead_time: '7 Days',
    expiry: 'N/A',
    holding_cost: '₹22 / unit / mo',
    event_impact: 'Festive Cleaning Fest (+65% Demand)',
    trend_score: '+35.4% Search Momentum',
    external_factors: 'Smart Home Cleaning Demand',
    coupon_code: 'CLEANBOT25',
    offer_type: 'Bundle',
    avg_weekly_demand: 80
  },
  {
    product_id: 'prod_skincare_bundle',
    sku: 'SKU-BC-CARE-1212',
    product_name: 'Hydrating Botanical Skincare Trio Bundle',
    category: 'Beauty & Care',
    subcategory: 'Facial Care',
    base_price: 78.0,
    unit_cost: 32.76,
    margin_pct: 0.58,
    shelf_life: '365 Days',
    seasonality: 'Year-round',
    substitutability: 'Low Substitutability',
    incoming_stock: 500,
    safety_stock: 150,
    lead_time: '3 Days',
    expiry: 'Nov 2027',
    holding_cost: '₹7 / unit / mo',
    event_impact: 'Bridal & Festive Glow Fest (+75% Demand)',
    trend_score: '+42.1% Search Momentum',
    external_factors: 'Clean Beauty Skincare Trend',
    coupon_code: 'BOTANICAL20',
    offer_type: 'Bundle & Coupon',
    avg_weekly_demand: 310
  },
  {
    product_id: 'prod_hair_dryer_styler',
    sku: 'SKU-BC-HAIR-1313',
    product_name: 'Ionic Hair Dryer & Multi-Styler Wand',
    category: 'Beauty & Care',
    subcategory: 'Hair Electronics',
    base_price: 160.0,
    unit_cost: 80.0,
    margin_pct: 0.50,
    shelf_life: 'Non-Perishable',
    seasonality: 'Wedding/Festive Peak',
    substitutability: 'Medium Substitutability',
    incoming_stock: 220,
    safety_stock: 80,
    lead_time: '5 Days',
    expiry: 'N/A',
    holding_cost: '₹14 / unit / mo',
    event_impact: 'Wedding Season Beauty Fest (+50% Demand)',
    trend_score: '+24.5% Search Momentum',
    external_factors: 'Salon at Home Trend',
    coupon_code: 'STYLER15',
    offer_type: 'Discount',
    avg_weekly_demand: 130
  },
  {
    product_id: 'prod_camping_tent',
    sku: 'SKU-OG-TENT-1414',
    product_name: 'All-Weather 4-Person Camping Tent',
    category: 'Outdoor Gear',
    subcategory: 'Camping',
    base_price: 320.0,
    unit_cost: 160.0,
    margin_pct: 0.50,
    shelf_life: 'Non-Perishable',
    seasonality: 'Summer Peak',
    substitutability: 'Low Substitutability',
    incoming_stock: 75,
    safety_stock: 30,
    lead_time: '8 Days',
    expiry: 'N/A',
    holding_cost: '₹28 / unit / mo',
    event_impact: 'Summer Camp Fest (+55% Demand)',
    trend_score: '+21.0% Search Momentum',
    external_factors: 'Outdoor Ecotourism Trend',
    coupon_code: 'CAMP20',
    offer_type: 'Bundle',
    avg_weekly_demand: 50
  },
  {
    product_id: 'prod_hydration_flask',
    sku: 'SKU-OG-FLSK-1515',
    product_name: 'Insulated Stainless Steel Hydration Flask',
    category: 'Outdoor Gear',
    subcategory: 'Accessories',
    base_price: 42.0,
    unit_cost: 15.96,
    margin_pct: 0.62,
    shelf_life: 'Non-Perishable',
    seasonality: 'Year-round',
    substitutability: 'High Substitutability',
    incoming_stock: 600,
    safety_stock: 200,
    lead_time: '3 Days',
    expiry: 'N/A',
    holding_cost: '₹5 / unit / mo',
    event_impact: 'Summer Hydration Campaign (+45% Demand)',
    trend_score: '+29.8% Search Momentum',
    external_factors: 'Eco-Friendly Bottle Trend',
    coupon_code: 'FLASK10',
    offer_type: 'Discount & Cross-sell',
    avg_weekly_demand: 320
  },
  {
    product_id: 'prod_smartwatch_pro',
    sku: 'SKU-EL-WATCH-1616',
    product_name: 'Pro Performance Smartwatch',
    category: 'Electronics',
    subcategory: 'Wearables',
    base_price: 240.0,
    unit_cost: 115.2,
    margin_pct: 0.52,
    shelf_life: 'Non-Perishable',
    seasonality: 'High Summer Demand',
    substitutability: 'Low Substitutability',
    incoming_stock: 300,
    safety_stock: 100,
    lead_time: '5 Days',
    expiry: 'N/A',
    holding_cost: '₹16 / unit / mo',
    event_impact: 'Fitness Resolution Fest (+60% Demand)',
    trend_score: '+38.5% Search Momentum',
    external_factors: 'Health & ECG Wearable Trend',
    coupon_code: 'PROWATCH20',
    offer_type: 'Bundle & Personalized Offer',
    avg_weekly_demand: 85
  },
  {
    product_id: 'prod_earbuds_wireless',
    sku: 'SKU-EL-BUDS-1717',
    product_name: 'Noise-Cancelling Wireless Earbuds',
    category: 'Electronics',
    subcategory: 'Audio',
    base_price: 180.0,
    unit_cost: 147.6,
    margin_pct: 0.18, // Demo case for Margin Risk!
    shelf_life: 'Non-Perishable',
    seasonality: 'Year-round',
    substitutability: 'High Substitutability',
    incoming_stock: 250,
    safety_stock: 90,
    lead_time: '4 Days',
    expiry: 'N/A',
    holding_cost: '₹12 / unit / mo',
    event_impact: 'Tech Audio Flash Sale (+40% Demand)',
    trend_score: '+20.2% Search Momentum',
    external_factors: 'ANC Audio Headphones Demand',
    coupon_code: 'BUDS15',
    offer_type: 'Discount',
    avg_weekly_demand: 110
  }
];

export const REGIONS = ['North Region', 'South Region', 'East Region', 'West Region', 'Central Region'];

export function generateSyntheticInventory() {
  const inventory = [];
  
  PRODUCTS.forEach((product) => {
    REGIONS.forEach((region) => {
      let stock_qty = Math.floor(product.avg_weekly_demand * (2.5 + Math.random() * 3));
      
      // Seed Demo Edge Cases:
      // Case 1: Stockout Risk in South Region for Apex Running Shoes
      if (product.product_id === 'prod_running_shoes_apex' && region === 'South Region') {
        stock_qty = 32; // Only 32 units left against promo demand!
      }

      // Case 2: Stockout Risk in East Region for Winter Parka
      if (product.product_id === 'prod_winter_parka' && region === 'East Region') {
        stock_qty = 25;
      }

      // Case 4: High ROI Winner in North Region for Smartwatch Pro
      if (product.product_id === 'prod_smartwatch_pro' && region === 'North Region') {
        stock_qty = 680;
      }

      // High ROI Winner for Skincare Bundle in West Region
      if (product.product_id === 'prod_skincare_bundle' && region === 'West Region') {
        stock_qty = 850;
      }

      const days_of_supply = Math.round((stock_qty / (product.avg_weekly_demand / 7)));
      
      inventory.push({
        inventory_id: `inv_${product.product_id}_${region.replace(/\s+/g, '_').toLowerCase()}`,
        product_id: product.product_id,
        region,
        stock_qty,
        incoming_stock: product.incoming_stock || 200,
        safety_stock: product.safety_stock || 80,
        lead_time: product.lead_time || '5 Days',
        expiry: product.expiry || 'Dec 2026',
        holding_cost: product.holding_cost || '₹12 / unit / mo',
        reorder_threshold: Math.round(product.avg_weekly_demand * 0.8),
        days_of_supply
      });
    });
  });

  return inventory;
}

export function generateRegionalDemandSignals() {
  const signals = [];
  const categories = ['Footwear', 'Apparel', 'Home Goods', 'Beauty & Care', 'Outdoor Gear', 'Electronics'];

  REGIONS.forEach((region) => {
    categories.forEach((category) => {
      let demand_index = +(0.8 + Math.random() * 0.9).toFixed(2);
      let trend_direction = demand_index >= 1.2 ? 'Spiking' : demand_index >= 1.0 ? 'Steady' : 'Declining';

      if (region === 'West Region' && category === 'Beauty & Care') {
        demand_index = 1.75;
        trend_direction = 'Spiking';
      }
      if (region === 'North Region' && category === 'Electronics') {
        demand_index = 1.60;
        trend_direction = 'Spiking';
      }

      signals.push({
        signal_id: `dem_${region.replace(/\s+/g, '_').toLowerCase()}_${category.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}`,
        region,
        product_category: category,
        demand_index,
        trend_direction,
        event_impact: 'Diwali Festival Sale (+45% Demand)',
        trend_score: '+18.5% Search Interest',
        external_factors: 'Seasonal Weather Demand Surge',
        last_updated: '2026-08-19'
      });
    });
  });

  return signals;
}

export function generateFullDataset() {
  const inventory = generateSyntheticInventory();
  const regional_demand = generateRegionalDemandSignals();

  return {
    dataset_id: 'dataset_synthetic_default',
    dataset_name: 'PromoAlign Core Retail Dataset',
    customer_segments: CUSTOMER_SEGMENTS,
    segments: CUSTOMER_SEGMENTS,
    products: PRODUCTS,
    regions: REGIONS,
    inventory,
    regional_demand,
    regional_demand_signals: regional_demand
  };
}
