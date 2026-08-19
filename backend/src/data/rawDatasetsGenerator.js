import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const RAW_DIR = path.join(__dirname, 'raw');

if (!fs.existsSync(RAW_DIR)) {
  fs.mkdirSync(RAW_DIR, { recursive: true });
}

/**
 * 1. Generate Rossmann Store Sales CSV
 */
export function createRossmannCSV() {
  const filePath = path.join(RAW_DIR, 'rossmann_store_sales.csv');
  const headers = 'Store,DayOfWeek,Date,Sales,Customers,Open,Promo,StateHoliday,SchoolHoliday,StoreType,Assortment,CompetitionDistance,Region\n';
  
  let rows = headers;
  const storeTypes = ['a', 'b', 'c', 'd'];
  const assortments = ['Basic', 'Extra', 'Extended'];
  const regions = ['North Region', 'South Region', 'East Region', 'West Region', 'Central Region'];

  for (let store = 1; store <= 50; store++) {
    const storeType = storeTypes[store % 4];
    const assortment = assortments[store % 3];
    const competitionDistance = (store * 120) + 350;
    const region = regions[store % 5];

    for (let day = 1; day <= 10; day++) {
      const date = `2026-08-${day < 10 ? '0' + day : day}`;
      const promo = (day % 3 === 0 || store % 2 === 0) ? 1 : 0;
      const customers = Math.floor(400 + Math.random() * 800);
      const sales = Math.floor(customers * (5.5 + Math.random() * 4));
      
      rows += `${store},${(day % 7) + 1},${date},${sales},${customers},1,${promo},0,0,${storeType},${assortment},${competitionDistance},${region}\n`;
    }
  }

  fs.writeFileSync(filePath, rows);
}

/**
 * 2. Generate UCI Online Retail CSV
 */
export function createUciOnlineRetailCSV() {
  const filePath = path.join(RAW_DIR, 'uci_online_retail.csv');
  const headers = 'InvoiceNo,StockCode,Description,Quantity,InvoiceDate,UnitPrice,CustomerID,Country,DiscountPct\n';

  let rows = headers;
  const products = [
    { code: '85123A', desc: 'WHITE HANGING HEART T-LIGHT HOLDER', price: 2.55, cat: 'Home Goods' },
    { code: '71053', desc: 'WHITE METAL LANTERN', price: 3.39, cat: 'Home Goods' },
    { code: '84406B', desc: 'CREAM CUPID HEARTS COAT HANGER', price: 2.75, cat: 'Home Goods' },
    { code: '84029G', desc: 'KNITTED UNION FLAG HOT WATER BOTTLE', price: 3.39, cat: 'Apparel' },
    { code: '22752', desc: 'SET 7 BABUSHKA NESTING BOXES', price: 7.65, cat: 'Home Goods' },
    { code: '21730', desc: 'GLASS STAR FROSTED T-LIGHT HOLDER', price: 4.25, cat: 'Home Goods' },
    { code: '22633', desc: 'HAND WARMER UNION JACK', price: 1.85, cat: 'Apparel' },
    { code: '22632', desc: 'HAND WARMER RED RETROSPOT', price: 1.85, cat: 'Apparel' },
    { code: '85099B', desc: 'JUMBO BAG RED RETROSPOT', price: 1.95, cat: 'Outdoor Gear' },
    { code: '22386', desc: 'JUMBO BAG PINK POLKADOT', price: 1.95, cat: 'Outdoor Gear' }
  ];

  const countries = ['United Kingdom', 'Germany', 'France', 'EIRE', 'Spain', 'Netherlands'];

  for (let i = 1001; i <= 1120; i++) {
    const invNo = `536${i}`;
    const custId = 12000 + (i % 35);
    const country = countries[i % countries.length];
    const prod = products[i % products.length];
    const qty = Math.floor(6 + Math.random() * 48);
    const discount = (i % 4 === 0) ? 20 : (i % 3 === 0) ? 15 : 10;
    const date = `2026-08-${(i % 28) + 1} 08:26`;

    rows += `${invNo},${prod.code},"${prod.desc}",${qty},${date},${prod.price},${custId},${country},${discount}\n`;
  }

  fs.writeFileSync(filePath, rows);
}

/**
 * 3. Generate dunnhumby Complete Journey CSV
 */
export function createDunnhumbyCSV() {
  const filePath = path.join(RAW_DIR, 'dunnhumby_complete_journey.csv');
  const headers = 'household_key,BASKET_ID,DAY,PRODUCT_ID,Category,QUANTITY,SALES_VALUE,STORE_ID,RETAIL_DISCOUNT,COUPON_DISCOUNT\n';

  let rows = headers;
  const categories = [
    { id: 9812, name: 'GROCERY & FOOD', cat: 'Home Goods' },
    { id: 1045, name: 'BEVERAGES & JUICE', cat: 'Home Goods' },
    { id: 3209, name: 'PERSONAL CARE & BEAUTY', cat: 'Beauty & Care' },
    { id: 5541, name: 'ATHLETIC & WELLNESS', cat: 'Footwear' },
    { id: 7720, name: 'SEASONAL APPAREL', cat: 'Apparel' },
    { id: 8891, name: 'OUTDOOR & CAMPING', cat: 'Outdoor Gear' }
  ];

  for (let b = 1; b <= 120; b++) {
    const householdKey = 100 + (b % 40);
    const basketId = 90000 + b;
    const storeId = 300 + (b % 5);
    const prod = categories[b % categories.length];
    const qty = Math.floor(1 + Math.random() * 8);
    const salesValue = +(qty * (12.5 + Math.random() * 35)).toFixed(2);
    const retailDiscount = +(salesValue * (0.10 + Math.random() * 0.20)).toFixed(2);
    const couponDiscount = Math.random() > 0.7 ? 5.00 : 0.00;

    rows += `${householdKey},${basketId},${(b % 30) + 1},${prod.id},"${prod.name}",${qty},${salesValue},${storeId},${retailDiscount},${couponDiscount}\n`;
  }

  fs.writeFileSync(filePath, rows);
}

/**
 * 4. Generate varshitha1809 Ecommerce Dataset CSV
 */
export function createVarshithaEcommerceCSV() {
  const filePath = path.join(RAW_DIR, 'varshitha1809_ecommerce.csv');
  const headers = 'Transaction_ID,Customer_ID,Customer_Segment,Product_Category,Product_Name,Base_Price,Margin_Pct,Discount_Applied_Pct,Store_Region,Sales_Volume,Customer_Affinity_Score\n';

  let rows = headers;
  const segments = ['Urban Fitness Enthusiasts', 'High-Value VIP Loyalists', 'Bargain Hunters', 'Tech & Trendsetters', 'Seasonal Home Organizers'];
  const categories = [
    { cat: 'Footwear', name: 'Apex Trail Running Shoes', price: 150, margin: 0.48 },
    { cat: 'Apparel', name: 'UltraWarm Waterproof Winter Parka', price: 280, margin: 0.55 },
    { cat: 'Beauty & Care', name: 'Hydrating Botanical Skincare Bundle', price: 78, margin: 0.65 },
    { cat: 'Home Goods', name: 'Ergonomic Mesh Executive Chair', price: 210, margin: 0.42 },
    { cat: 'Outdoor Gear', name: 'All-Weather 4-Person Camping Tent', price: 320, margin: 0.50 },
    { cat: 'Electronics', name: 'Pro Performance Smartwatch', price: 240, margin: 0.52 }
  ];
  const regions = ['North Region', 'South Region', 'East Region', 'West Region', 'Central Region'];

  for (let i = 1; i <= 150; i++) {
    const txId = `TX_VAR_${1000 + i}`;
    const custId = `CUST_${2000 + (i % 25)}`;
    const seg = segments[i % segments.length];
    const item = categories[i % categories.length];
    const reg = regions[i % regions.length];
    const discount = (i % 3 === 0) ? 25 : (i % 2 === 0) ? 20 : 15;
    const vol = Math.floor(10 + Math.random() * 40);
    const affinity = +(0.70 + Math.random() * 0.28).toFixed(2);

    rows += `${txId},${custId},"${seg}","${item.cat}","${item.name}",${item.price},${item.margin},${discount},"${reg}",${vol},${affinity}\n`;
  }

  fs.writeFileSync(filePath, rows);
  console.log(`✅ Generated varshitha1809 Ecommerce Dataset CSV at ${filePath}`);
}

export function generateAllRawDatasets() {
  createRossmannCSV();
  createUciOnlineRetailCSV();
  createDunnhumbyCSV();
  createVarshithaEcommerceCSV();
}
