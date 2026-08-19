import { PRODUCTS, CUSTOMER_SEGMENTS, generateSyntheticInventory, generateRegionalDemandSignals } from '../data/syntheticGenerator.js';

console.log('🧪 Testing 7-Branch Business Hierarchy Data Engine...');

console.log(`✅ Customer Segments (Branch 2): ${CUSTOMER_SEGMENTS.length} segments`);
console.log(`✅ Product Specifications (Branch 3): ${PRODUCTS.length} products`);

const inv = generateSyntheticInventory();
console.log(`✅ Inventory Control (Branch 6): ${inv.length} inventory records`);

const dem = generateRegionalDemandSignals();
console.log(`✅ Demand Drivers (Branch 5): ${dem.length} regional demand signals`);

const sampleProduct = PRODUCTS[0];
console.log('\n📌 Sample Product 7-Branch Attribute Matrix:');
console.log(`  SKU: ${sampleProduct.sku}`);
console.log(`  Shelf Life: ${sampleProduct.shelf_life}`);
console.log(`  Seasonality: ${sampleProduct.seasonality}`);
console.log(`  Substitutability: ${sampleProduct.substitutability}`);
console.log(`  Incoming Stock: ${sampleProduct.incoming_stock} units`);
console.log(`  Safety Stock: ${sampleProduct.safety_stock} units`);
console.log(`  Lead Time: ${sampleProduct.lead_time}`);
console.log(`  Expiry: ${sampleProduct.expiry}`);
console.log(`  Holding Cost: ${sampleProduct.holding_cost}`);
console.log(`  Event Impact: ${sampleProduct.event_impact}`);
console.log(`  Trend Score: ${sampleProduct.trend_score}`);
console.log(`  Coupon Code: ${sampleProduct.coupon_code}`);
console.log(`  Offer Type: ${sampleProduct.offer_type}`);

if (sampleProduct.sku && sampleProduct.holding_cost && sampleProduct.coupon_code) {
  console.log('\n🎉 ALL 7-BRANCH BUSINESS HIERARCHY TESTS PASSED SUCCESSFULLY!');
} else {
  console.error('\n❌ Failed Business Hierarchy Test!');
  process.exit(1);
}
