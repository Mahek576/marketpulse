from sqlalchemy.orm import Session

from app.models.alert import Alert
from app.models.market_signal import MarketSignal
from app.models.watchlist import Watchlist


def get_alert_by_id(db: Session, alert_id: int) -> Alert | None:
    return db.query(Alert).filter(Alert.id == alert_id).first()


def get_alert_for_user_and_signal(
    db: Session,
    user_id: int,
    signal_id: int,
) -> Alert | None:
    return (
        db.query(Alert)
        .filter(
            Alert.user_id == user_id,
            Alert.signal_id == signal_id,
        )
        .first()
    )


def user_watches_company(
    db: Session,
    user_id: int,
    company_id: int,
) -> bool:
    return (
        db.query(Watchlist)
        .filter(
            Watchlist.user_id == user_id,
            Watchlist.company_id == company_id,
        )
        .first()
        is not None
    )


def get_user_alerts(
    db: Session,
    user_id: int,
    unread_only: bool = False,
    skip: int = 0,
    limit: int = 50,
) -> list[Alert]:
    query = db.query(Alert).filter(Alert.user_id == user_id)

    if unread_only:
        query = query.filter(Alert.is_read == False)

    return (
        query.order_by(Alert.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )


def create_alert_from_signal(
    db: Session,
    user_id: int,
    signal: MarketSignal,
) -> Alert:
    alert_type = signal.signal_type
    severity = signal.severity

    title = f"{severity.title()} {alert_type.title()} Alert"

    message = (
        f"{signal.title}. "
        f"Reason: {signal.reason} "
        f"Why it matters: {signal.why_it_matters}"
    )

    alert = Alert(
        user_id=user_id,
        company_id=signal.company_id,
        signal_id=signal.id,
        alert_type=alert_type,
        severity=severity,
        title=title,
        message=message,
        is_read=False,
    )

    db.add(alert)
    db.commit()
    db.refresh(alert)

    return alert


def mark_alert_as_read(
    db: Session,
    alert: Alert,
) -> Alert:
    alert.is_read = True

    db.commit()
    db.refresh(alert)

    return alert