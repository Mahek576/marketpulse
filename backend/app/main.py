from contextlib import asynccontextmanager

from fastapi import FastAPI
from sqlalchemy import text

from app.api.routes_auth import router as auth_router
from app.api.routes_companies import router as companies_router
from app.api.routes_watchlist import router as watchlist_router
from app.config import settings
from app.db.database import engine
from app.db.init_db import init_db

@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield


app = FastAPI(
    title=settings.app_name,
    description="Production-grade market intelligence platform backend",
    version=settings.app_version,
    debug=settings.debug,
    lifespan=lifespan,
)

app.include_router(auth_router)
app.include_router(companies_router)
app.include_router(watchlist_router)


@app.get("/")
def root():
    return {
        "message": "MarketPulse backend is running",
        "environment": settings.environment,
        "version": settings.app_version,
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "marketpulse-api",
        "environment": settings.environment,
        "version": settings.app_version,
    }


@app.get("/health/db")
def database_health_check():
    with engine.connect() as connection:
        connection.execute(text("SELECT 1"))

    return {
        "status": "healthy",
        "database": "connected",
    }