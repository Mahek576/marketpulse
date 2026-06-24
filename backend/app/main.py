from fastapi import FastAPI

from app.config import settings

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