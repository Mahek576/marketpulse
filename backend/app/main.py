from fastapi import FastAPI
from sqlalchemy import text

from app.config import settings
from app.db.database import engine

app = FastAPI(
    title=settings.app_name,
    description="Production-grade market intelligence platform backend",
    version=settings.app_version,
    debug=settings.debug,
)


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