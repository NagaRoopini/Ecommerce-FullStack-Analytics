from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from app.routes.dashboard import router as dashboard_router
from app.routes.analytics import router as analytics_router
from app.routes.auth import router as auth_router
from app.routes.upload import router as upload_router
from app.routes.orders import router as orders_router


# --------------------------------------------------
# Frontend build location
# --------------------------------------------------

BASE_DIR = Path(__file__).resolve().parents[2]
FRONTEND_DIST = BASE_DIR / "frontend" / "dist"


# --------------------------------------------------
# FastAPI App
# --------------------------------------------------

app = FastAPI(
    title="E-Commerce Sales & Customer Analytics API",
    version="1.0.0"
)


# --------------------------------------------------
# CORS
# --------------------------------------------------

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


# --------------------------------------------------
# API Routers
# --------------------------------------------------

app.include_router(dashboard_router)
app.include_router(analytics_router)
app.include_router(auth_router)
app.include_router(upload_router)
app.include_router(orders_router)


# --------------------------------------------------
# API Routes
# --------------------------------------------------

@app.get("/")
def home():

    index_file = FRONTEND_DIST / "index.html"

    if index_file.exists():
        return FileResponse(index_file)

    return {
        "message": "E-Commerce Analytics API is running!"
    }


@app.get("/api/health")
def health_check():

    return {
        "status": "healthy"
    }


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


# --------------------------------------------------
# React Static Files
# --------------------------------------------------

if FRONTEND_DIST.exists():

    assets_dir = FRONTEND_DIST / "assets"

    if assets_dir.exists():

        app.mount(
            "/assets",
            StaticFiles(directory=assets_dir),
            name="assets"
        )


# --------------------------------------------------
# React SPA Fallback
# --------------------------------------------------

@app.get("/{full_path:path}")
def serve_frontend(full_path: str):

    # Don't interfere with API routes
    if full_path.startswith("api/"):

        raise HTTPException(
            status_code=404,
            detail="API endpoint not found"
        )

    requested_file = FRONTEND_DIST / full_path

    # Serve existing frontend files
    if requested_file.is_file():

        return FileResponse(requested_file)

    # Otherwise serve React index.html
    index_file = FRONTEND_DIST / "index.html"

    if index_file.exists():

        return FileResponse(index_file)

    return {
        "message": "Frontend build not found. Run npm run build in frontend."
    }