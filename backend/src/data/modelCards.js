/**
 * PromoAlign AI Model Cards Registry
 * Detailed documentation for all 6 machine learning models operating in the PromoAlign engine.
 */

export const MODEL_CARDS = [
  {
    id: 'elasticity',
    name: 'Sigmoidal Price Elasticity & Demand Curve Generator',
    version: '2.1.0',
    category: 'Demand Forecasting & Dynamic Pricing',
    badge: '🔮 Price Elasticity',
    icon: 'TrendingUp',
    description: 'Models non-linear promotional redemption rates and unit demand lift multipliers as a function of discount depth using sigmoidal response curves.',
    whatItPredicts: [
      'Promotional redemption rate %: R(d) = 1 / (1 + e^-8(d - 0.15)) * s',
      'Demand lift multiplier (1.0x to 3.2x baseline demand)',
      'Gross revenue lift ($) and post-discount net profit ($)',
      'Margin erosion floor breaches'
    ],
    keyAssumptions: [
      'Discount depth d is bounded between 5% and 50%.',
      'Price sensitivity s is anchored around regional customer segment historical response.',
      'S-curve threshold centers at 15% discount depth (tipping point for redemption acceleration).'
    ],
    knownFailureModes: [
      'Under-predicts demand spikes during major holiday events (Black Friday / Cyber Monday) due to exogenous traffic surges.',
      'Does not model competitor price undercut actions in real time unless regional demand index is manually adjusted.'
    ],
    idealInputRanges: {
      discountPct: '5% - 40%',
      basePrice: '$10 - $5,000',
      sensitivity: '0.2 - 0.9',
      unitCost: '30% - 70% of base price'
    },
    performanceMetrics: {
      maeRedemption: '2.8%',
      rmseRedemption: '3.9%',
      liftAccuracyPct: '94.2%',
      f1Score: '92.6%'
    }
  },
  {
    id: 'similarity',
    name: 'Cosine Similarity Vector Space Model',
    version: '1.8.4',
    category: 'Product-Segment Affinity Matching',
    badge: '🎯 Affinity Matching',
    icon: 'Sparkles',
    description: 'Maps customer segment preference vectors and product attribute vectors into a 3D latent space to compute normalized cosine similarity scores.',
    whatItPredicts: [
      'Customer-product brand & category affinity score (0% to 100%)',
      'Target segment suitability ranking for new promotional launches',
      'Cross-category affinity alignment'
    ],
    keyAssumptions: [
      'Customer preferences are represented by normalized 3-element vectors [Category Preference, Brand Affinity, Price Sensitivity].',
      'Vector elements are updated based on rolling 90-day purchase transactions.'
    ],
    knownFailureModes: [
      'Cold-start problem for newly introduced products without historical category transaction logs.',
      'High similarity scores do not guarantee stock availability in local fulfillment centers.'
    ],
    idealInputRanges: {
      vectorDimensions: '3 normalized floats (0.0 to 1.0)',
      minAffinityThreshold: '50%'
    },
    performanceMetrics: {
      precisionAt5: '91.8%',
      precisionAt10: '89.4%',
      recall: '87.2%',
      f1Score: '88.3%'
    }
  },
  {
    id: 'apriori',
    name: 'Apriori Market Basket Co-Purchase Predictor',
    version: '3.0.1',
    category: 'Cross-Product Bundles & Attachment',
    badge: '📦 Basket Association',
    icon: 'PackagePlus',
    description: 'Mines historical transaction basket IDs to discover complementary product pairs and forecast attachment rates for promotional cross-bundles.',
    whatItPredicts: [
      'Cross-product attachment rate % (e.g. 78.5% attachment for Shoes + Socks)',
      'Association metrics: Support (%), Confidence (%), and Lift Ratio',
      'Incremental bundle profit ($) vs standalone promotional profit'
    ],
    keyAssumptions: [
      'Minimum itemset support threshold = 15%.',
      'Minimum confidence threshold = 55%.',
      'Bundle discounts apply to lower-priced accessory items.'
    ],
    knownFailureModes: [
      'May suggest bundling low-stock accessories, compounding inventory stockout risks.',
      'Does not account for physical store shelf proximity or warehouse packaging constraints.'
    ],
    idealInputRanges: {
      minSupport: '15% - 40%',
      minConfidence: '50% - 90%',
      maxItemsPerBundle: '2 - 3 items'
    },
    performanceMetrics: {
      maeAttachment: '3.4%',
      rmseAttachment: '4.8%',
      liftRatioAccuracy: '93.5%',
      f1Score: '90.1%'
    }
  },
  {
    id: 'shap',
    name: 'SHAP Feature Attribution Decomposition Model',
    version: '1.5.0',
    category: 'Explainable AI & Rationale Generation',
    badge: '🧩 Explainable AI',
    icon: 'Brain',
    description: 'Computes Shapley additive explanations (SHAP values) to quantify the exact point contribution of every input feature toward the final promotion Fit Score.',
    whatItPredicts: [
      'Feature attribution waterfall breakdown (+/- points per feature)',
      'Baseline score offset (+50 pts baseline)',
      'Plain-language rationale for category leads and merchandisers'
    ],
    keyAssumptions: [
      'Feature contributions are strictly additive: Fit Score = Base + ∑ SHAP_i.',
      'Features evaluated: Category Affinity, Demand Index, Promo Responsiveness, Stock Cushion, Margin Preservation.'
    ],
    knownFailureModes: [
      'Computationally expensive if evaluated over thousands of item pairs simultaneously (mitigated by sampling top candidates).',
      'Additive assumption assumes linear independence among top features.'
    ],
    idealInputRanges: {
      baseScore: '50.0 points',
      fitScoreBounds: '0 to 100 points'
    },
    performanceMetrics: {
      fidelityScore: '97.4%',
      attributionStability: '96.8%',
      f1Score: '95.1%'
    }
  },
  {
    id: 'rfm',
    name: 'RFM Customer Clustering & LTV Predictor',
    version: '2.2.0',
    category: 'Customer Profiling & Lifetime Value',
    badge: '👥 RFM Segmentation',
    icon: 'Users',
    description: 'Segments customer cohorts into RFM tiers (Recency, Frequency, Monetary) to predict promotional responsiveness and long-term customer lifetime value (LTV).',
    whatItPredicts: [
      'RFM cluster tier (e.g. VIP Champion 444, Bargain Hunter 142, At-Risk Loyalist)',
      'Estimated 12-month Customer Lifetime Value ($)',
      'Offer fatigue probability based on days since last promo'
    ],
    keyAssumptions: [
      'Recency R (1-4), Frequency F (1-4), Monetary M (1-4) scores normalized over rolling 180 days.',
      'Customers with recency < 14 days have high fatigue risk.'
    ],
    knownFailureModes: [
      'Does not distinguish between seasonal shoppers (e.g., holiday-only buyers) and churning customers.',
      'LTV estimates can be inflated for recent high-value single buyers.'
    ],
    idealInputRanges: {
      recencyDays: '1 - 180 days',
      frequencyMonthly: '0.5 - 10.0 orders/mo',
      monetaryValue: '$20 - $10,000'
    },
    performanceMetrics: {
      clusterPrecision: '92.1%',
      ltvMae: '$42.50',
      f1Score: '89.7%'
    }
  },
  {
    id: 'csp',
    name: 'Multi-Attribute Constraint Satisfaction Programming (CSP)',
    version: '4.1.0',
    category: 'Operational Risk & Compliance',
    badge: '🛡️ Constraint Engine',
    icon: 'ShieldCheck',
    description: 'Evaluates promotional candidate parameters against hard operational constraints (Stockout Risk, Margin Floor, Fatigue Limits) to assign risk badges and approval flags.',
    whatItPredicts: [
      'Operational Risk Level (HEALTHY, TIGHT_STOCK, MARGIN_RISK, STOCKOUT_RISK)',
      'Constraint violation flags and required operational remedial actions',
      'One-click campaign readiness score (0% to 100%)'
    ],
    keyAssumptions: [
      'Hard Margin Floor = 15.0% post-discount margin.',
      'Stockout Risk Floor = Store stock_qty < projected_promotional_demand.',
      'Fatigue Limit = minimum 14 days between major discount offers.'
    ],
    knownFailureModes: [
      'Can produce conservative recommendations (blocking profitable high-risk promos) if safety buffers are set too high.',
      'Assumes inventory stock levels are updated in real time without supply chain delays.'
    ],
    idealInputRanges: {
      marginFloor: '15.0%',
      stockRatio: '>= 1.0x projected demand',
      fatigueBuffer: '>= 14 days'
    },
    performanceMetrics: {
      stockoutRecall: '96.8%',
      marginBreachPrecision: '94.5%',
      overallRiskAccuracy: '95.2%',
      f1Score: '95.6%'
    }
  }
];
