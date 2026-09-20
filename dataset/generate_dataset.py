import pandas as pd
import random
from datetime import datetime, timedelta

random.seed(42)

categories = {
    "Electronics": ["Laptop", "Smart Watch", "Headphones", "Mobile Phone"],
    "Clothing": ["T-Shirt", "Jeans", "Dress", "Shoes"],
    "Furniture": ["Sofa", "Chair", "Table", "Bookshelf"],
    "Beauty": ["Shampoo", "Face Cream", "Face Wash", "Perfume"],
    "Books": ["Novel", "Comics", "Textbook", "Magazine"]
}

regions = {
    "North": ["Delhi", "Jaipur", "Lucknow"],
    "South": ["Chennai", "Bangalore", "Hyderabad"],
    "East": ["Kolkata", "Bhubaneswar", "Patna"],
    "West": ["Mumbai", "Pune", "Ahmedabad"]
}

payment_modes = [
    "UPI",
    "Credit Card",
    "Debit Card",
    "Cash on Delivery",
    "Net Banking"
]

start_date = datetime(2025, 1, 1)

data = []

for i in range(1, 10001):

    category = random.choice(list(categories.keys()))
    product = random.choice(categories[category])

    region = random.choice(list(regions.keys()))
    city = random.choice(regions[region])

    quantity = random.randint(1, 5)

    unit_price = random.randint(500, 50000)

    sales = quantity * unit_price

    discount = round(random.uniform(0, 0.30), 2)

    profit = round(sales * (1 - discount) * random.uniform(0.05, 0.25), 2)

    order_date = start_date + timedelta(
        days=random.randint(0, 364)
    )

    data.append([
        f"ORD{i:05d}",
        order_date.date(),
        f"CUST{random.randint(1, 2000):04d}",
        category,
        product,
        quantity,
        round(sales, 2),
        discount,
        profit,
        region,
        city,
        random.choice(payment_modes)
    ])


columns = [
    "Order_ID",
    "Order_Date",
    "Customer_ID",
    "Category",
    "Product",
    "Quantity",
    "Sales",
    "Discount",
    "Profit",
    "Region",
    "City",
    "Payment_Mode"
]

df = pd.DataFrame(data, columns=columns)

df.to_csv(
    "ecommerce_sales.csv",
    index=False
)

print("Dataset created successfully!")
print("Rows:", len(df))
print("Columns:", len(df.columns))
print(df.head())
