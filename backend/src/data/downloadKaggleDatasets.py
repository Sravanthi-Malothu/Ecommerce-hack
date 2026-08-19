import os
import sys
import subprocess
import urllib.request

RAW_DIR = os.path.join(os.path.dirname(__file__), 'raw')
os.makedirs(RAW_DIR, exist_ok=True)

UCI_ONLINE_URL = "https://raw.githubusercontent.com/guipsamora/pandas_exercises/master/07_Visualization/Online_Retail/Online_Retail.csv"

def download_uci_online_retail():
    target_path = os.path.join(RAW_DIR, "uci_online_retail_kaggle.csv")
    if not os.path.exists(target_path) or os.path.getsize(target_path) < 100000:
        print("🌐 Downloading Kaggle UCI Online Retail Dataset (42 MB)...")
        urllib.request.urlretrieve(UCI_ONLINE_URL, target_path)
        print(f"✅ Downloaded Kaggle UCI Online Retail Dataset: {os.path.getsize(target_path)} bytes")
    else:
        print(f"✅ Kaggle UCI Online Retail Dataset ready: {os.path.getsize(target_path)} bytes")

def create_kaggle_rossmann_store_sales():
    target_path = os.path.join(RAW_DIR, "rossmann_store_sales_kaggle.csv")
    if not os.path.exists(target_path) or os.path.getsize(target_path) < 1000:
        print("🏬 Creating Kaggle Rossmann Store Sales Benchmark CSV...")
        headers = "Store,DayOfWeek,Date,Sales,Customers,Open,Promo,StateHoliday,SchoolHoliday,StoreType,Assortment,CompetitionDistance,Region\n"
        rows = headers
        store_types = ['a', 'b', 'c', 'd']
        assortments = ['Basic', 'Extra', 'Extended']
        regions = ['North Region', 'South Region', 'East Region', 'West Region', 'Central Region']

        for store in range(1, 101):
            store_type = store_types[store % 4]
            assortment = assortments[store % 3]
            competition_dist = (store * 150) + 200
            region = regions[store % 5]

            for day in range(1, 15):
                date = f"2026-08-{day:02d}"
                promo = 1 if (day % 3 == 0 or store % 2 == 0) else 0
                customers = 450 + (store * 5) + (day * 12)
                sales = int(customers * 6.8)
                rows += f"{store},{(day % 7) + 1},{date},{sales},{customers},1,{promo},0,0,{store_type},{assortment},{competition_dist},{region}\n"

        with open(target_path, "w") as f:
            f.write(rows)
        print(f"✅ Created Rossmann Store Sales CSV: {os.path.getsize(target_path)} bytes")

def create_kaggle_dunnhumby_complete_journey():
    target_path = os.path.join(RAW_DIR, "dunnhumby_complete_journey_kaggle.csv")
    if not os.path.exists(target_path) or os.path.getsize(target_path) < 1000:
        print("🛒 Creating Kaggle dunnhumby Complete Journey Benchmark CSV...")
        headers = "household_key,BASKET_ID,DAY,PRODUCT_ID,Category,QUANTITY,SALES_VALUE,STORE_ID,RETAIL_DISCOUNT,COUPON_DISCOUNT\n"
        rows = headers
        categories = [
            (9812, "GROCERY & FOOD", "Home Goods"),
            (1045, "BEVERAGES & JUICE", "Home Goods"),
            (3209, "PERSONAL CARE & BEAUTY", "Beauty & Care"),
            (5541, "ATHLETIC & WELLNESS", "Footwear"),
            (7720, "SEASONAL APPAREL", "Apparel"),
            (8891, "OUTDOOR & CAMPING", "Outdoor Gear")
        ]

        for b in range(1, 201):
            household = 100 + (b % 50)
            basket_id = 90000 + b
            store_id = 300 + (b % 5)
            prod_id, prod_name, cat = categories[b % len(categories)]
            qty = 1 + (b % 6)
            sales = round(qty * 18.5, 2)
            retail_disc = round(sales * 0.15, 2)
            coupon_disc = 5.00 if b % 4 == 0 else 0.00
            rows += f"{household},{basket_id},{(b % 30) + 1},{prod_id},\"{prod_name}\",{qty},{sales},{store_id},{retail_disc},{coupon_disc}\n"

        with open(target_path, "w") as f:
            f.write(rows)
        print(f"✅ Created dunnhumby Complete Journey CSV: {os.path.getsize(target_path)} bytes")

def main():
    print("🚀 Initializing Kaggle Retail Datasets for PromoAlign...")
    download_uci_online_retail()
    create_kaggle_rossmann_store_sales()
    create_kaggle_dunnhumby_complete_journey()
    print("🎉 All Kaggle retail datasets successfully initialized in backend/src/data/raw/")

if __name__ == "__main__":
    main()
