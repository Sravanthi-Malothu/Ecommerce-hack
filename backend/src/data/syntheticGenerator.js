import { v4 as uuidv4 } from 'uuid';

/**
 * PromoAlign Synthetic Data Generator
 * Generates realistic retail datasets across diverse product categories.
 */

export const CUSTOMER_SEGMENTS = [
  {
    segment_id: 'seg_urban_fitness',
    segment_name: 'Urban Fitness Enthusiasts',
    description: 'Active professionals, high spenders on athletic wear, footwear & tech wearables',
    size: 45000,
    avg_discount_sensitivity: 0.45, // 0 to 1 scale
    avg_order_value: 135.0,
    preferred_categories: ['Footwear', 'Apparel', 'Electronics', 'Outdoor Gear'],
    last_promo_days_ago: 28
  },
  {
    segment_id: 'seg_bargain_hunters',
    segment_name: 'Bargain Hunters',
    description: 'Price-sensitive shoppers driven by flash sales, clothing & home deals',
    size: 92000,
    avg_discount_sensitivity: 0.92,
    avg_order_value: 68.0,
    preferred_categories: ['Apparel', 'Home Goods', 'Beauty & Care'],
    last_promo_days_ago: 6 // Trigger for promo fatigue
  },
  {
    segment_id: 'seg_loyalty_vip',
    segment_name: 'High-Value VIP Loyalists',
    description: 'Frequent buyers with high brand affinity, luxury beauty & outdoor gear',
    size: 18000,
    avg_discount_sensitivity: 0.25,
    avg_order_value: 240.0,
    preferred_categories: ['Outdoor Gear', 'Apparel', 'Beauty & Care'],
    last_promo_days_ago: 42
  },
  {
    segment_id: 'seg_tech_trendsetters',
    segment_name: 'Tech & Trendsetters',
    description: 'Early adopters seeking latest gadgets, smart home & premium tech',
    size: 31000,
    avg_discount_sensitivity: 0.38,
    avg_order_value: 195.0,
    preferred_categories: ['Electronics', 'Home Goods'],
    last_promo_days_ago: 21
  },
  {
    segment_id: 'seg_home_organizers',
    segment_name: 'Seasonal Home Organizers',
    description: 'Families shopping for seasonal upgrades, kitchenware & home wellness',
    size: 64000,
    avg_discount_sensitivity: 0.65,
    avg_order_value: 110.0,
    preferred_categories: ['Home Goods', 'Beauty & Care', 'Outdoor Gear'],
    last_promo_days_ago: 18
  }
];

export const PRODUCTS = [
  // --- Footwear & Athletic Apparel ---
  {
    product_id: 'prod_running_shoes_apex',
    product_name: 'Apex Trail Running Shoes',
    category: 'Footwear',
    subcategory: 'Athletic Footwear',
    base_price: 150.0,
    margin_pct: 0.48,
    seasonality_tag: 'Spring/Summer Peak',
    avg_weekly_demand: 140
  },
  {
    product_id: 'prod_hiking_boots',
    product_name: 'All-Terrain Waterproof Hiking Boots',
    category: 'Footwear',
    subcategory: 'Outdoor Footwear',
    base_price: 185.0,
    margin_pct: 0.52,
    seasonality_tag: 'Fall/Winter',
    avg_weekly_demand: 95
  },
  {
    product_id: 'prod_casual_sneakers',
    product_name: 'Classic Organic Canvas Sneakers',
    category: 'Footwear',
    subcategory: 'Casual Footwear',
    base_price: 85.0,
    margin_pct: 0.45,
    seasonality_tag: 'Year-round',
    avg_weekly_demand: 180
  },

  // --- Apparel & Fashion Outerwear ---
  {
    product_id: 'prod_winter_parka',
    product_name: 'UltraWarm Waterproof Winter Parka',
    category: 'Apparel',
    subcategory: 'Outerwear',
    base_price: 280.0,
    margin_pct: 0.55,
    seasonality_tag: 'Fall/Winter',
    avg_weekly_demand: 90
  },
  {
    product_id: 'prod_leather_jacket',
    product_name: 'Premium Italian Napa Leather Jacket',
    category: 'Apparel',
    subcategory: 'Luxury Apparel',
    base_price: 340.0,
    margin_pct: 0.60,
    seasonality_tag: 'Fall/Winter',
    avg_weekly_demand: 40
  },
  {
    product_id: 'prod_yoga_activewear_set',
    product_name: 'Luxe Breathable Yoga Activewear Set',
    category: 'Apparel',
    subcategory: 'Athletic Apparel',
    base_price: 95.0,
    margin_pct: 0.58,
    seasonality_tag: 'Year-round',
    avg_weekly_demand: 210
  },

  // --- Home Goods & Kitchenware ---
  {
    product_id: 'prod_office_chair',
    product_name: 'Ergonomic Mesh Executive Chair',
    category: 'Home Goods',
    subcategory: 'Furniture',
    base_price: 210.0,
    margin_pct: 0.42,
    seasonality_tag: 'Back-to-Work',
    avg_weekly_demand: 65
  },
  {
    product_id: 'prod_espresso_maker',
    product_name: 'Compact Artisan Espresso Machine',
    category: 'Home Goods',
    subcategory: 'Kitchenware',
    base_price: 190.0,
    margin_pct: 0.38,
    seasonality_tag: 'Holiday/Gifting',
    avg_weekly_demand: 45
  },
  {
    product_id: 'prod_dutch_oven',
    product_name: 'Enameled Cast Iron Dutch Oven Set',
    category: 'Home Goods',
    subcategory: 'Cookware',
    base_price: 140.0,
    margin_pct: 0.50,
    seasonality_tag: 'Fall/Winter Cooking',
    avg_weekly_demand: 115
  },
  {
    product_id: 'prod_robot_vacuum',
    product_name: 'Smart Navigation Robot Vacuum Cleaner',
    category: 'Home Goods',
    subcategory: 'Home Appliances',
    base_price: 260.0,
    margin_pct: 0.44,
    seasonality_tag: 'Year-round',
    avg_weekly_demand: 75
  },

  // --- Beauty & Personal Care ---
  {
    product_id: 'prod_skincare_bundle',
    product_name: 'Hydrating Botanical Skincare Trio Bundle',
    category: 'Beauty & Care',
    subcategory: 'Skincare',
    base_price: 78.0,
    margin_pct: 0.65, // High margin beauty!
    seasonality_tag: 'Year-round',
    avg_weekly_demand: 240
  },
  {
    product_id: 'prod_hair_dryer_styler',
    product_name: 'Ionic Hair Dryer & Multi-Styler Wand',
    category: 'Beauty & Care',
    subcategory: 'Haircare Tech',
    base_price: 160.0,
    margin_pct: 0.48,
    seasonality_tag: 'Gifting Season',
    avg_weekly_demand: 130
  },

  // --- Outdoor Gear & Fitness ---
  {
    product_id: 'prod_camping_tent',
    product_name: 'All-Weather 4-Person Camping Tent',
    category: 'Outdoor Gear',
    subcategory: 'Camping',
    base_price: 320.0,
    margin_pct: 0.50,
    seasonality_tag: 'Summer Peak',
    avg_weekly_demand: 50
  },
  {
    product_id: 'prod_hydration_flask',
    product_name: 'Insulated Stainless Steel Hydration Flask',
    category: 'Outdoor Gear',
    subcategory: 'Accessories',
    base_price: 42.0,
    margin_pct: 0.62,
    seasonality_tag: 'Year-round',
    avg_weekly_demand: 320
  },

  // --- Electronics & Audio ---
  {
    product_id: 'prod_smartwatch_pro',
    product_name: 'Pro Performance Smartwatch',
    category: 'Electronics',
    subcategory: 'Wearables',
    base_price: 240.0,
    margin_pct: 0.52,
    seasonality_tag: 'High Summer Demand',
    avg_weekly_demand: 85
  },
  {
    product_id: 'prod_earbuds_wireless',
    product_name: 'Noise-Cancelling Wireless Earbuds',
    category: 'Electronics',
    subcategory: 'Audio',
    base_price: 180.0,
    margin_pct: 0.18, // Demo case for Margin Risk!
    seasonality_tag: 'Year-round',
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

      if (region === 'North Region' && (category === 'Electronics' || category === 'Footwear')) {
        demand_index = 1.85;
        trend_direction = 'Spiking';
      }
      if (region === 'South Region' && category === 'Footwear') {
        demand_index = 1.92;
        trend_direction = 'Spiking';
      }
      if (region === 'West Region' && (category === 'Beauty & Care' || category === 'Outdoor Gear')) {
        demand_index = 1.75;
        trend_direction = 'Spiking';
      }

      signals.push({
        region,
        product_category: category,
        demand_index,
        trend_direction,
        week_of_year: 34
      });
    });
  });

  return signals;
}

export function generatePromotionHistory() {
  return [
    {
      promo_id: 'hist_101',
      product_id: 'prod_smartwatch_pro',
      segment_id: 'seg_urban_fitness',
      region: 'North Region',
      discount_pct: 15,
      redemption_rate: 0.28,
      incremental_revenue: 34500,
      stockout_flag: false
    },
    {
      promo_id: 'hist_102',
      product_id: 'prod_running_shoes_apex',
      segment_id: 'seg_bargain_hunters',
      region: 'South Region',
      discount_pct: 30,
      redemption_rate: 0.42,
      incremental_revenue: 41200,
      stockout_flag: true
    },
    {
      promo_id: 'hist_103',
      product_id: 'prod_skincare_bundle',
      segment_id: 'seg_loyalty_vip',
      region: 'West Region',
      discount_pct: 20,
      redemption_rate: 0.38,
      incremental_revenue: 28900,
      stockout_flag: false
    }
  ];
}

export function generateFullDataset() {
  const inventory = generateSyntheticInventory();
  const regional_demand = generateRegionalDemandSignals();
  const promo_history = generatePromotionHistory();

  return {
    customer_segments: CUSTOMER_SEGMENTS,
    products: PRODUCTS,
    regions: REGIONS,
    inventory,
    regional_demand_signals: regional_demand,
    promotion_history: promo_history
  };
}
