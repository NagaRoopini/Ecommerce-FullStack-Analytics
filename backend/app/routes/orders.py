from fastapi import APIRouter, Depends
from typing import Optional
from app.database.connection import get_connection
from app.auth.dependencies import get_current_user

router = APIRouter(
    prefix="/api/orders",
    tags=["Orders"],
    dependencies=[Depends(get_current_user)]
)


@router.get("")
def get_orders(
    search: Optional[str] = None,
    category: Optional[str] = None,
    region: Optional[str] = None,
    payment_method: Optional[str] = None,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    page: int = 1,
    limit: int = 20
):

    if page < 1:
        page = 1

    if limit < 1:
        limit = 20

    if limit > 100:
        limit = 100

    offset = (page - 1) * limit

    connection = get_connection()
    cursor = connection.cursor(dictionary=True)

    where_clause = " WHERE 1=1 "
    params = []

    # Search
    if search:
        where_clause += """
            AND (
                Order_ID LIKE %s
                OR Customer_ID LIKE %s
                OR Product LIKE %s
                OR City LIKE %s
            )
        """

        search_value = f"%{search}%"

        params.extend([
            search_value,
            search_value,
            search_value,
            search_value
        ])

    # Category
    if category:
        where_clause += " AND Category = %s "
        params.append(category)

    # Region
    if region:
        where_clause += " AND Region = %s "
        params.append(region)

    # Payment Method
    if payment_method:
        where_clause += " AND Payment_Mode = %s "
        params.append(payment_method)

    # Start Date
    if start_date:
        where_clause += " AND Order_Date >= %s "
        params.append(start_date)

    # End Date
    if end_date:
        where_clause += " AND Order_Date <= %s "
        params.append(end_date)

    # Total records
    count_query = f"""
        SELECT COUNT(*) AS total
        FROM sales
        {where_clause}
    """

    cursor.execute(
        count_query,
        params
    )

    total_records = cursor.fetchone()["total"]

    # Orders
    orders_query = f"""
        SELECT
            Order_ID AS order_id,
            Order_Date AS order_date,
            Customer_ID AS customer_id,
            Category AS category,
            Product AS product,
            Quantity AS quantity,
            Sales AS sales,
            Discount AS discount,
            Profit AS profit,
            Region AS region,
            City AS city,
            Payment_Mode AS payment_method
        FROM sales
        {where_clause}
        ORDER BY Order_Date DESC, Order_ID DESC
        LIMIT %s OFFSET %s
    """

    order_params = params.copy()

    order_params.extend([
        limit,
        offset
    ])

    cursor.execute(
        orders_query,
        order_params
    )

    orders = cursor.fetchall()

    cursor.close()
    connection.close()

    total_pages = (
        (total_records + limit - 1) // limit
        if total_records > 0
        else 0
    )

    return {
        "data": orders,
        "pagination": {
            "page": page,
            "limit": limit,
            "total_records": total_records,
            "total_pages": total_pages
        }
    }