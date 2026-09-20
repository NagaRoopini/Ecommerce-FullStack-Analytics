from fastapi import APIRouter, Depends
from app.auth.dependencies import get_current_user
from typing import Optional

from app.database.connection import get_connection


router = APIRouter(
    prefix="/api/analytics",
    tags=["Analytics"],
    dependencies=[Depends(get_current_user)]
)


# =========================================================
# 1. SALES BY CATEGORY
# =========================================================

@router.get("/category-sales")
def get_category_sales(
    category: Optional[str] = None,
    region: Optional[str] = None,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None
):

    connection = get_connection()
    cursor = connection.cursor(dictionary=True)

    query = """
    SELECT
        Category AS category,
        SUM(Sales) AS total_sales
    FROM sales
    WHERE 1=1
    """

    params = []

    if category:
        query += " AND Category = %s"
        params.append(category)

    if region:
        query += " AND Region = %s"
        params.append(region)

    if start_date:
        query += " AND Order_Date >= %s"
        params.append(start_date)

    if end_date:
        query += " AND Order_Date <= %s"
        params.append(end_date)

    query += """
    GROUP BY Category
    ORDER BY total_sales DESC
    """

    cursor.execute(query, params)

    result = cursor.fetchall()

    cursor.close()
    connection.close()

    return result


# =========================================================
# 2. PROFIT BY CATEGORY
# =========================================================

@router.get("/category-profit")
def get_category_profit(
    category: Optional[str] = None,
    region: Optional[str] = None,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None
):

    connection = get_connection()
    cursor = connection.cursor(dictionary=True)

    query = """
    SELECT
        Category AS category,
        SUM(Profit) AS total_profit
    FROM sales
    WHERE 1=1
    """

    params = []

    if category:
        query += " AND Category = %s"
        params.append(category)

    if region:
        query += " AND Region = %s"
        params.append(region)

    if start_date:
        query += " AND Order_Date >= %s"
        params.append(start_date)

    if end_date:
        query += " AND Order_Date <= %s"
        params.append(end_date)

    query += """
    GROUP BY Category
    ORDER BY total_profit DESC
    """

    cursor.execute(query, params)

    result = cursor.fetchall()

    cursor.close()
    connection.close()

    return result


# =========================================================
# 3. MONTHLY SALES
# =========================================================

@router.get("/monthly-sales")
def get_monthly_sales(
    category: Optional[str] = None,
    region: Optional[str] = None,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None
):

    connection = get_connection()
    cursor = connection.cursor(dictionary=True)

    query = """
    SELECT
        DATE_FORMAT(Order_Date, '%Y-%m') AS month,
        SUM(Sales) AS total_sales
    FROM sales
    WHERE 1=1
    """

    params = []

    if category:
        query += " AND Category = %s"
        params.append(category)

    if region:
        query += " AND Region = %s"
        params.append(region)

    if start_date:
        query += " AND Order_Date >= %s"
        params.append(start_date)

    if end_date:
        query += " AND Order_Date <= %s"
        params.append(end_date)

    query += """
    GROUP BY DATE_FORMAT(Order_Date, '%Y-%m')
    ORDER BY month
    """

    cursor.execute(query, params)

    result = cursor.fetchall()

    cursor.close()
    connection.close()

    return result


# =========================================================
# 4. TOP PRODUCTS
# =========================================================

@router.get("/top-products")
def get_top_products(
    category: Optional[str] = None,
    region: Optional[str] = None,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None
):

    connection = get_connection()
    cursor = connection.cursor(dictionary=True)

    query = """
    SELECT
        Product AS product,
        SUM(Sales) AS total_sales,
        SUM(Profit) AS total_profit,
        SUM(Quantity) AS total_quantity,
        COUNT(Order_ID) AS total_orders
    FROM sales
    WHERE 1=1
    """

    params = []

    if category:
        query += " AND Category = %s"
        params.append(category)

    if region:
        query += " AND Region = %s"
        params.append(region)

    if start_date:
        query += " AND Order_Date >= %s"
        params.append(start_date)

    if end_date:
        query += " AND Order_Date <= %s"
        params.append(end_date)

    query += """
    GROUP BY Product
    ORDER BY total_sales DESC
    LIMIT 10
    """

    cursor.execute(query, params)

    result = cursor.fetchall()

    cursor.close()
    connection.close()

    return result

# =========================================================
# 5. SALES BY REGION
# =========================================================

@router.get("/region-sales")
def get_region_sales(
    category: Optional[str] = None,
    region: Optional[str] = None,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None
):

    connection = get_connection()
    cursor = connection.cursor(dictionary=True)

    query = """
    SELECT
        Region AS region,
        SUM(Sales) AS total_sales,
        SUM(Profit) AS total_profit,
        SUM(Quantity) AS total_quantity,
        COUNT(Order_ID) AS total_orders,
        COUNT(DISTINCT Customer_ID) AS total_customers
    FROM sales
    WHERE 1=1
    """

    params = []

    if category:
        query += " AND Category = %s"
        params.append(category)

    if region:
        query += " AND Region = %s"
        params.append(region)

    if start_date:
        query += " AND Order_Date >= %s"
        params.append(start_date)

    if end_date:
        query += " AND Order_Date <= %s"
        params.append(end_date)

    query += """
    GROUP BY Region
    ORDER BY total_sales DESC
    """

    cursor.execute(query, params)

    result = cursor.fetchall()

    cursor.close()
    connection.close()

    return result


# =========================================================
# 6. TOP CUSTOMERS
# =========================================================

@router.get("/top-customers")
def get_top_customers(
    category: Optional[str] = None,
    region: Optional[str] = None,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None
):

    connection = get_connection()
    cursor = connection.cursor(dictionary=True)

    query = """
    SELECT
        Customer_ID AS customer_id,
        COUNT(Order_ID) AS total_orders,
        SUM(Sales) AS total_spending,
        SUM(Profit) AS total_profit,
        SUM(Quantity) AS total_quantity
    FROM sales
    WHERE 1=1
    """

    params = []

    if category:
        query += " AND Category = %s"
        params.append(category)

    if region:
        query += " AND Region = %s"
        params.append(region)

    if start_date:
        query += " AND Order_Date >= %s"
        params.append(start_date)

    if end_date:
        query += " AND Order_Date <= %s"
        params.append(end_date)

    query += """
    GROUP BY Customer_ID
    ORDER BY total_spending DESC
    LIMIT 10
    """

    cursor.execute(query, params)

    result = cursor.fetchall()

    cursor.close()
    connection.close()

    return result

# =========================================================
# 7. PAYMENT METHODS
# =========================================================

@router.get("/payment-methods")
def get_payment_methods(
    category: Optional[str] = None,
    region: Optional[str] = None,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None
):

    connection = get_connection()
    cursor = connection.cursor(dictionary=True)

    query = """
    SELECT
        Payment_Mode AS payment_method,
        COUNT(Order_ID) AS total_orders,
        SUM(Sales) AS total_sales,
        SUM(Profit) AS total_profit,
        SUM(Quantity) AS total_quantity
    FROM sales
    WHERE 1=1
    """

    params = []

    if category:
        query += " AND Category = %s"
        params.append(category)

    if region:
        query += " AND Region = %s"
        params.append(region)

    if start_date:
        query += " AND Order_Date >= %s"
        params.append(start_date)

    if end_date:
        query += " AND Order_Date <= %s"
        params.append(end_date)

    query += """
    GROUP BY Payment_Mode
    ORDER BY total_orders DESC
    """

    cursor.execute(query, params)

    result = cursor.fetchall()

    cursor.close()
    connection.close()

    return result

# =========================================================
# 8. SALES KPI SUMMARY
# =========================================================

@router.get("/summary")
def get_sales_summary(
    category: Optional[str] = None,
    region: Optional[str] = None,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None
):

    connection = get_connection()
    cursor = connection.cursor(dictionary=True)

    query = """
    SELECT
        COALESCE(SUM(Sales), 0) AS total_sales,
        COALESCE(SUM(Profit), 0) AS total_profit,
        COUNT(Order_ID) AS total_orders,
        COUNT(DISTINCT Customer_ID) AS total_customers,
        COALESCE(AVG(Sales), 0) AS average_order_value
    FROM sales
    WHERE 1=1
    """

    params = []

    if category:
        query += " AND Category = %s"
        params.append(category)

    if region:
        query += " AND Region = %s"
        params.append(region)

    if start_date:
        query += " AND Order_Date >= %s"
        params.append(start_date)

    if end_date:
        query += " AND Order_Date <= %s"
        params.append(end_date)

    cursor.execute(query, params)

    result = cursor.fetchone()

    cursor.close()
    connection.close()

    return result