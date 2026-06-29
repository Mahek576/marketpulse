from fastapi import APIRouter

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/summary")
def get_dashboard_summary():
    return {
        "tracked_companies": 24,
        "market_alerts": 12,
        "news_signals": 186,
        "avg_sentiment": "Bullish",
        "tracked_companies_change": "+6 this week",
        "market_alerts_change": "4 high priority",
        "news_signals_change": "Last 24 hours",
        "avg_sentiment_change": "+18% momentum",
    }