from fastapi import APIRouter, Depends
from app.auth.dependencies import get_current_user

router = APIRouter(
    prefix="/api/dashboard",
    tags=["Dashboard"],
    dependencies=[Depends(get_current_user)]
)

@router.get("/summary")
def get_dashboard_summary():

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
    """

    cursor.execute(query)

    result = cursor.fetchone()

    cursor.close()
    connection.close()

    return result