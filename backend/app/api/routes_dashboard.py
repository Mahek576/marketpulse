from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.alert import Alert
from app.models.article import Article
from app.models.company import Company
from app.models.market_signal import MarketSignal
from app.schemas.dashboard import (
    DashboardFeedItem,
    DashboardRiskSignal,
    DashboardSummary,
    DashboardWatchlistItem,
)

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


def map_sentiment_to_feed_tag(sentiment_label: str | None) -> str:
    if not sentiment_label:
        return "Neutral"

    normalized_sentiment = sentiment_label.lower().strip()

    if normalized_sentiment in {"positive", "bullish", "opportunity"}:
        return "Positive"

    if normalized_sentiment in {"negative", "bearish", "risk", "caution"}:
        return "Caution"

    return "Neutral"


@router.get("/summary", response_model=DashboardSummary)
def get_dashboard_summary(db: Session = Depends(get_db)):
    tracked_companies = db.query(Company).count()
    market_alerts = db.query(Alert).count()
    news_signals = db.query(MarketSignal).count()

    return {
        "tracked_companies": tracked_companies,
        "market_alerts": market_alerts,
        "news_signals": news_signals,
        "avg_sentiment": "Bullish",
        "tracked_companies_change": "Database-backed count",
        "market_alerts_change": "Active alert records",
        "news_signals_change": "Generated signal records",
        "avg_sentiment_change": "Sentiment aggregation coming soon",
    }


@router.get("/watchlist", response_model=list[DashboardWatchlistItem])
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


@router.get("/feed", response_model=list[DashboardFeedItem])
def get_dashboard_feed(db: Session = Depends(get_db)):
    articles = (
        db.query(Article)
        .order_by(
            Article.importance_score.desc(),
            Article.published_at.desc(),
            Article.created_at.desc(),
        )
        .limit(6)
        .all()
    )

    return [
        {
            "title": article.title,
            "source": article.source,
            "tag": map_sentiment_to_feed_tag(article.sentiment_label),
        }
        for article in articles
    ]


@router.get("/risk-radar", response_model=list[DashboardRiskSignal])
def get_dashboard_risk_radar():
    return [
        {
            "title": "High Volatility",
            "description": "IT sector showing negative sentiment acceleration.",
            "severity": "high",
        },
        {
            "title": "Earnings Watch",
            "description": "Banking names may react to upcoming quarterly updates.",
            "severity": "medium",
        },
        {
            "title": "Positive Momentum",
            "description": "Energy and infrastructure news flow remains strong.",
            "severity": "positive",
        },
    ]