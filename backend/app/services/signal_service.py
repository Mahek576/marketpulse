from sqlalchemy.orm import Session

from app.models.article import Article
from app.models.market_signal import MarketSignal


RISK_KEYWORDS = [
    "regulatory",
    "regulation",
    "compliance",
    "restriction",
    "penalty",
    "fraud",
    "lawsuit",
    "probe",
    "investigation",
    "loss",
    "decline",
    "downgrade",
]

OPPORTUNITY_KEYWORDS = [
    "growth",
    "expands",
    "expansion",
    "investment",
    "profit",
    "contract",
    "deal",
    "partnership",
    "launch",
    "approval",
    "wins",
]


def get_signal_by_id(db: Session, signal_id: int) -> MarketSignal | None:
    return db.query(MarketSignal).filter(MarketSignal.id == signal_id).first()


def get_signal_by_article_id(db: Session, article_id: int) -> MarketSignal | None:
    return (
        db.query(MarketSignal)
        .filter(MarketSignal.article_id == article_id)
        .first()
    )


def get_signals(
    db: Session,
    company_id: int | None = None,
    skip: int = 0,
    limit: int = 50,
) -> list[MarketSignal]:
    query = db.query(MarketSignal).filter(MarketSignal.is_active == True)

    if company_id is not None:
        query = query.filter(MarketSignal.company_id == company_id)

    return (
        query.order_by(MarketSignal.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )


def calculate_severity(score: int) -> str:
    if score >= 75:
        return "high"

    if score >= 50:
        return "medium"

    return "low"


def generate_signal_from_article(db: Session, article: Article) -> MarketSignal:
    text = f"{article.title} {article.summary or ''} {article.content or ''}".lower()

    risk_hits = [keyword for keyword in RISK_KEYWORDS if keyword in text]
    opportunity_hits = [keyword for keyword in OPPORTUNITY_KEYWORDS if keyword in text]

    base_score = article.importance_score or 0
    sentiment = (article.sentiment_label or "neutral").lower()

    signal_type = "monitor"
    score = base_score
    reason_parts = []

    if sentiment == "negative":
        score += 10
        signal_type = "risk"
        reason_parts.append("Article sentiment is negative.")

    if sentiment == "positive":
        score += 10
        signal_type = "opportunity"
        reason_parts.append("Article sentiment is positive.")

    if risk_hits:
        score += 10
        signal_type = "risk"
        reason_parts.append(
            "Risk-related keywords detected: " + ", ".join(risk_hits[:5]) + "."
        )

    if opportunity_hits and signal_type != "risk":
        score += 10
        signal_type = "opportunity"
        reason_parts.append(
            "Opportunity-related keywords detected: "
            + ", ".join(opportunity_hits[:5])
            + "."
        )

    score = min(score, 100)
    severity = calculate_severity(score)

    if not reason_parts:
        reason_parts.append(
            "Article does not show strong risk or opportunity signals, but is worth monitoring."
        )

    if signal_type == "risk":
        why_it_matters = (
            "This may indicate higher business, compliance, operational, "
            "or investor risk for the company."
        )
    elif signal_type == "opportunity":
        why_it_matters = (
            "This may indicate business growth, stronger market positioning, "
            "or positive investor sentiment."
        )
    else:
        why_it_matters = (
            "This update may be relevant for tracking company developments over time."
        )

    signal = MarketSignal(
        company_id=article.company_id,
        article_id=article.id,
        signal_type=signal_type,
        severity=severity,
        score=score,
        title=f"{signal_type.title()} signal: {article.title}",
        description=article.summary,
        reason=" ".join(reason_parts),
        why_it_matters=why_it_matters,
    )

    db.add(signal)

    article.is_processed = True

    db.commit()
    db.refresh(signal)

    return signal