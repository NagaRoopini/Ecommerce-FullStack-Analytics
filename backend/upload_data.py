import pandas as pd
from app.database.connection import get_connection


CSV_PATH = "../dataset/ecommerce_sales.csv"


def upload_data():

    # Read CSV
    df = pd.read_csv(CSV_PATH)

    print(f"CSV loaded successfully! Rows: {len(df)}")

    # Convert date
    df["Order_Date"] = pd.to_datetime(df["Order_Date"]).dt.date

    # Connect to Aiven MySQL
    connection = get_connection()
    cursor = connection.cursor()

    insert_query = """
    INSERT INTO sales (
        Order_ID,
        Order_Date,
        Customer_ID,
        Category,
        Product,
        Quantity,
        Sales,
        Discount,
        Profit,
        Region,
        City,
        Payment_Mode
    )
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """

    data = []

    for _, row in df.iterrows():

        data.append((
            row["Order_ID"],
            row["Order_Date"],
            row["Customer_ID"],
            row["Category"],
            row["Product"],
            int(row["Quantity"]),
            float(row["Sales"]),
            float(row["Discount"]),
            float(row["Profit"]),
            row["Region"],
            row["City"],
            row["Payment_Mode"]
        ))

    # Insert all rows
    cursor.executemany(insert_query, data)

    connection.commit()

    print(f"Data uploaded successfully! Rows inserted: {cursor.rowcount}")

    cursor.close()
    connection.close()


if __name__ == "__main__":
    upload_data()