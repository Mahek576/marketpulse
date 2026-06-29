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
@router.get("/watchlist")
def get_dashboard_watchlist():
    return [
        {
            "symbol": "RELIANCE",
            "name": "Reliance Industries",
            "sentiment": "Bullish",
            "impact": "High",
        },
        {
            "symbol": "TCS",
            "name": "Tata Consultancy Services",
            "sentiment": "Neutral",
            "impact": "Medium",
        },
        {
            "symbol": "INFY",
            "name": "Infosys",
            "sentiment": "Bearish",
            "impact": "Medium",
        },
        {
            "symbol": "HDFCBANK",
            "name": "HDFC Bank",
            "sentiment": "Bullish",
            "impact": "High",
        },
    ]
@router.get("/feed")
def get_dashboard_feed():
    return [
        {
            "title": "Reliance gains attention after energy expansion update",
            "source": "MarketPulse Intelligence",
            "tag": "Positive",
        },
        {
            "title": "IT sector sentiment weakens amid global demand concerns",
            "source": "AI News Monitor",
            "tag": "Caution",
        },
        {
            "title": "Banking stocks remain active as rate outlook stabilizes",
            "source": "Financial Signals",
            "tag": "Neutral",
        },
    ]