from app.cache.redis_client import get_redis_client
from fastapi import APIRouter
from sqlalchemy import text

from app.config import settings
from app.db.database import engine


router = APIRouter(
    tags=["Health"],
)


@router.get("/")
def root():
    return {
        "message": "MarketPulse backend is running",
        "environment": settings.environment,
        "version": settings.app_version,
    }


@router.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "marketpulse-api",
        "environment": settings.environment,
        "version": settings.app_version,
    }


@router.get("/health/db")
def database_health_check():
    with engine.connect() as connection:
        connection.execute(text("SELECT 1"))

    return {
        "status": "healthy",
        "database": "connected",
    }
@router.get("/health/cache")
def cache_health_check():
    client = get_redis_client()

    if not client:
        return {
            "status": "disabled_or_unavailable",
            "cache": "not_connected",
        }

    return {
        "status": "healthy",
        "cache": "connected",
    }