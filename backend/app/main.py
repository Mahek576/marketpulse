from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException
from fastapi.exceptions import RequestValidationError

from app.api.exception_handlers import (
    http_exception_handler,
    validation_exception_handler,
)
from app.api.routes_articles import router as articles_router
from app.api.routes_auth import router as auth_router
from app.api.routes_companies import router as companies_router
from app.api.routes_health import router as health_router
from app.api.routes_watchlist import router as watchlist_router
from app.config import settings



@asynccontextmanager
async def lifespan(app: FastAPI):
    yield

openapi_tags = [
    {
        "name": "Health",
        "description": "Service and database health check endpoints.",
    },
    {
        "name": "Auth",
        "description": "User registration, login, and current user profile endpoints.",
    },
    {
        "name": "Companies",
        "description": "Company creation, listing, and detail endpoints.",
    },
    {
        "name": "Watchlist",
        "description": "User-specific company watchlist endpoints.",
    },
    {
    "name": "Articles",
    "description": "Market news and article storage endpoints.",
},
]


app = FastAPI(
    title=settings.app_name,
    description=(
        "MarketPulse is a production-grade market intelligence backend "
        "for tracking companies, user watchlists, and future market signals."
    ),
    version=settings.app_version,
    debug=settings.debug,
    lifespan=lifespan,
    openapi_tags=openapi_tags,
)

app.add_exception_handler(HTTPException, http_exception_handler)
app.add_exception_handler(RequestValidationError, validation_exception_handler)

app.include_router(health_router)
app.include_router(auth_router)
app.include_router(companies_router)
app.include_router(watchlist_router)
app.include_router(articles_router)