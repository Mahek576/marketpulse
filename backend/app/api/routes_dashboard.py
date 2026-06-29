from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.alert import Alert
from app.models.article import Article
from app.models.company import Company
from app.models.market_signal import MarketSignal
from app.models.watchlist import Watchlist
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


def map_signal_severity_to_dashboard(severity: str | None) -> str:
    if not severity:
        return "medium"

    normalized_severity = severity.lower().strip()

    if normalized_severity in {"high", "critical", "severe", "risk"}:
        return "high"

    if normalized_severity in {"positive", "opportunity", "bullish"}:
        return "positive"

    return "medium"


def map_signal_to_watchlist_sentiment(severity: str | None) -> str:
    if not severity:
        return "Neutral"

    normalized_severity = severity.lower().strip()

    if normalized_severity in {"positive", "opportunity", "bullish"}:
        return "Bullish"

    if normalized_severity in {"high", "critical", "severe", "risk", "negative", "bearish"}:
        return "Bearish"

    return "Neutral"


def map_signal_score_to_impact(score: int | None) -> str:
    if score is None:
        return "Medium"

    if score >= 75:
        return "High"

    if score >= 40:
        return "Medium"

    return "Low"


def build_watchlist_item(company: Company, db: Session) -> dict:
    latest_signal = (
        db.query(MarketSignal)
        .filter(
            MarketSignal.company_id == company.id,
            MarketSignal.is_active.is_(True),
        )
        .order_by(
            MarketSignal.score.desc(),
            MarketSignal.created_at.desc(),
        )
        .first()
    )

    return {
        "symbol": company.symbol,
        "name": company.name,
        "sentiment": map_signal_to_watchlist_sentiment(
            latest_signal.severity if latest_signal else None
        ),
        "impact": map_signal_score_to_impact(
            latest_signal.score if latest_signal else None
        ),
    }


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
def get_dashboard_watchlist(db: Session = Depends(get_db)):
    watchlist_rows = (
        db.query(Watchlist, Company)
        .join(Company, Watchlist.company_id == Company.id)
        .filter(Company.is_active.is_(True))
        .order_by(Watchlist.created_at.desc())
        .limit(20)
        .all()
    )

    companies = []
    seen_company_ids = set()

    for _, company in watchlist_rows:
        if company.id not in seen_company_ids:
            companies.append(company)
            seen_company_ids.add(company.id)

        if len(companies) == 4:
            break

    if not companies:
        companies = (
            db.query(Company)
            .filter(Company.is_active.is_(True))
            .order_by(Company.created_at.desc())
            .limit(4)
            .all()
        )

    return [build_watchlist_item(company, db) for company in companies]


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
def get_dashboard_risk_radar(db: Session = Depends(get_db)):
    signals = (
        db.query(MarketSignal)
        .filter(MarketSignal.is_active.is_(True))
        .order_by(
            MarketSignal.score.desc(),
            MarketSignal.created_at.desc(),
        )
        .limit(3)
        .all()
    )

    return [
        {
            "title": signal.title,
            "description": signal.description or signal.why_it_matters,
            "severity": map_signal_severity_to_dashboard(signal.severity),
        }
        for signal in signals
    ]