from datetime import datetime

from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String, Text

from app.db.database import Base


class Article(Base):
    __tablename__ = "articles"

    id = Column(Integer, primary_key=True, index=True)

    company_id = Column(
        Integer,
        ForeignKey("companies.id"),
        nullable=True,
        index=True,
    )

    title = Column(String(500), nullable=False)
    url = Column(String(1000), unique=True, index=True, nullable=False)
    source = Column(String(150), nullable=False)
    author = Column(String(150), nullable=True)

    published_at = Column(DateTime, nullable=True)

    summary = Column(Text, nullable=True)
    content = Column(Text, nullable=True)

    sentiment_label = Column(String(50), nullable=True)
    importance_score = Column(Integer, default=0, nullable=False)

    is_processed = Column(Boolean, default=False, nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False,
    )