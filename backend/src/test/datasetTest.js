import { getDatasetById, parseRossmannDataset, parseUciOnlineRetailDataset, parseDunnhumbyDataset } from '../engine/datasetParser.js';

console.log('🧪 Testing Real Retail Dataset Parsers...');

// Test 1: Rossmann Store Sales Dataset
const rossmannData = parseRossmannDataset();
console.log(`✅ Rossmann Dataset Parsed:
  - Name: ${rossmannData.dataset_name}
  - Segments: ${rossmannData.customer_segments.length}
  - Products: ${rossmannData.products.length}
  - Regional Signals: ${rossmannData.regional_demand_signals.length}
`);

if (!rossmannData.products.some(p => p.product_id.includes('rossmann'))) {
  console.error('❌ Failed Rossmann Parser Test!');
  process.exit(1);
}

// Test 2: UCI Online Retail Dataset
const uciData = parseUciOnlineRetailDataset();
console.log(`✅ UCI Online Retail Dataset Parsed:
  - Name: ${uciData.dataset_name}
  - Segments: ${uciData.customer_segments.length}
  - Products: ${uciData.products.length}
  - Inventory Records: ${uciData.inventory.length}
`);

if (!uciData.products.some(p => p.product_id.includes('uci'))) {
  console.error('❌ Failed UCI Online Retail Parser Test!');
  process.exit(1);
}

// Test 3: dunnhumby Complete Journey Dataset
const dunnhumbyData = parseDunnhumbyDataset();
console.log(`✅ dunnhumby Complete Journey Dataset Parsed:
  - Name: ${dunnhumbyData.dataset_name}
  - Segments: ${dunnhumbyData.customer_segments.length}
  - Products: ${dunnhumbyData.products.length}
`);

if (!dunnhumbyData.products.some(p => p.product_id.includes('dunn'))) {
  console.error('❌ Failed dunnhumby Parser Test!');
  process.exit(1);
}

console.log('🎉 ALL DATASET PARSER TESTS PASSED SUCCESSFULLY!');
