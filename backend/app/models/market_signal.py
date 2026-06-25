from datetime import datetime

from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String, Text

from app.db.database import Base


class MarketSignal(Base):
    __tablename__ = "market_signals"

    id = Column(Integer, primary_key=True, index=True)

    company_id = Column(
        Integer,
        ForeignKey("companies.id"),
        nullable=True,
        index=True,
    )

    article_id = Column(
        Integer,
        ForeignKey("articles.id"),
        unique=True,
        nullable=True,
        index=True,
    )

    signal_type = Column(String(50), nullable=False)
    severity = Column(String(50), nullable=False)
    score = Column(Integer, default=0, nullable=False)

    title = Column(String(500), nullable=False)
    description = Column(Text, nullable=True)
    reason = Column(Text, nullable=False)
    why_it_matters = Column(Text, nullable=False)

    is_active = Column(Boolean, default=True, nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False,
    )