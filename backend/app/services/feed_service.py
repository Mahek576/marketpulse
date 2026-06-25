from sqlalchemy.orm import Session

from app.models.alert import Alert
from app.models.article import Article
from app.models.company import Company
from app.models.market_signal import MarketSignal
from app.models.watchlist import Watchlist


def get_user_watchlist_company_ids(
    db: Session,
    user_id: int,
) -> list[int]:
    rows = (
        db.query(Watchlist.company_id)
        .filter(Watchlist.user_id == user_id)
        .all()
    )

    return [row.company_id for row in rows]


def get_watchlist_companies(
    db: Session,
    company_ids: list[int],
) -> list[Company]:
    if not company_ids:
        return []

    return (
        db.query(Company)
        .filter(
            Company.id.in_(company_ids),
            Company.is_active == True,
        )
        .order_by(Company.symbol.asc())
        .all()
    )


def get_latest_watchlist_articles(
    db: Session,
    company_ids: list[int],
    limit: int,
) -> list[Article]:
    if not company_ids:
        return []

    return (
        db.query(Article)
        .filter(Article.company_id.in_(company_ids))
        .order_by(
            Article.published_at.desc().nullslast(),
            Article.created_at.desc(),
        )
        .limit(limit)
        .all()
    )


def get_latest_watchlist_signals(
    db: Session,
    company_ids: list[int],
    limit: int,
) -> list[MarketSignal]:
    if not company_ids:
        return []

    return (
        db.query(MarketSignal)
        .filter(
            MarketSignal.company_id.in_(company_ids),
            MarketSignal.is_active == True,
        )
        .order_by(MarketSignal.created_at.desc())
        .limit(limit)
        .all()
    )


def get_latest_user_alerts(
    db: Session,
    user_id: int,
    limit: int,
) -> list[Alert]:
    return (
        db.query(Alert)
        .filter(Alert.user_id == user_id)
        .order_by(Alert.created_at.desc())
        .limit(limit)
        .all()
    )


def get_unread_alert_count(
    db: Session,
    user_id: int,
) -> int:
    return (
        db.query(Alert)
        .filter(
            Alert.user_id == user_id,
            Alert.is_read == False,
        )
        .count()
    )


def build_personalized_feed(
    db: Session,
    user_id: int,
    limit: int = 10,
) -> dict:
    company_ids = get_user_watchlist_company_ids(
        db=db,
        user_id=user_id,
    )

    watchlist_companies = get_watchlist_companies(
        db=db,
        company_ids=company_ids,
    )

    latest_articles = get_latest_watchlist_articles(
        db=db,
        company_ids=company_ids,
        limit=limit,
    )

    latest_signals = get_latest_watchlist_signals(
        db=db,
        company_ids=company_ids,
        limit=limit,
    )

    latest_alerts = get_latest_user_alerts(
        db=db,
        user_id=user_id,
        limit=limit,
    )

    unread_alert_count = get_unread_alert_count(
        db=db,
        user_id=user_id,
    )

    return {
        "user_id": user_id,
        "watchlist_count": len(watchlist_companies),
        "unread_alert_count": unread_alert_count,
        "latest_articles_count": len(latest_articles),
        "latest_signals_count": len(latest_signals),
        "latest_alerts_count": len(latest_alerts),
        "watchlist_companies": watchlist_companies,
        "latest_articles": latest_articles,
        "latest_signals": latest_signals,
        "latest_alerts": latest_alerts,
    }