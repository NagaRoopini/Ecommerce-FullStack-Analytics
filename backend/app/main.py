from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.dashboard import router as dashboard_router
from app.routes.analytics import router as analytics_router
from app.routes.auth import router as auth_router
from app.routes.upload import router as upload_router
from app.routes.orders import router as orders_router

app = FastAPI(
    title="E-Commerce Sales & Customer Analytics API",
    version="1.0.0"
)


# =========================================================
# CORS
# =========================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================================================
# ROUTERS
# =========================================================

app.include_router(dashboard_router)

app.include_router(analytics_router)

app.include_router(auth_router)

app.include_router(upload_router)

app.include_router(orders_router)

# =========================================================
# HOME
# =========================================================

@app.get("/")
def home():

    return {
        "message": "E-Commerce Analytics API is running!"
    }


# =========================================================
# HEALTH
# =========================================================

@app.get("/api/health")
def health_check():

    return {
        "status": "healthy"
    }


# =========================================================
# DATABASE TEST
# =========================================================

@app.get("/api/test-db")
def test_database():

    from app.database.connection import get_connection

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute(
        "SELECT COUNT(*) FROM sales"
    )

    result = cursor.fetchone()

    cursor.close()
    connection.close()

    return {
        "database": "connected",
        "sales_rows": result[0]
    }