from datetime import datetime
from typing import Any

from sqlalchemy.orm import Session

from app.models.article import Article
from app.models.company import Company


def parse_datetime(value: str | None) -> datetime | None:
    if not value:
        return None

    return datetime.fromisoformat(value)


def get_company_by_symbol(db: Session, symbol: str) -> Company | None:
    return (
        db.query(Company)
        .filter(Company.symbol == symbol.strip().upper())
        .first()
    )


def article_exists(db: Session, url: str) -> bool:
    return db.query(Article).filter(Article.url == url).first() is not None


def ingest_article_record(
    db: Session,
    article_data: dict[str, Any],
) -> tuple[str, str]:
    """
    Returns:
        ("created", title)
        ("skipped", title)
        ("missing_company", title)
    """

    title = article_data["title"].strip()
    url = article_data["url"].strip()
    company_symbol = article_data.get("company_symbol")

    if article_exists(db, url):
        return "skipped", title

    company_id = None

    if company_symbol:
        company = get_company_by_symbol(db, company_symbol)

        if not company:
            return "missing_company", title

        company_id = company.id

    article = Article(
        company_id=company_id,
        title=title,
        url=url,
        source=article_data["source"].strip(),
        author=article_data.get("author"),
        published_at=parse_datetime(article_data.get("published_at")),
        summary=article_data.get("summary"),
        content=article_data.get("content"),
        sentiment_label=(
            article_data.get("sentiment_label").strip().lower()
            if article_data.get("sentiment_label")
            else None
        ),
        importance_score=article_data.get("importance_score", 0),
        is_processed=False,
    )

    db.add(article)

    return "created", title


def ingest_articles(
    db: Session,
    articles: list[dict[str, Any]],
) -> dict[str, int]:
    created_count = 0
    skipped_count = 0
    missing_company_count = 0

    for article_data in articles:
        status, title = ingest_article_record(db, article_data)

        if status == "created":
            created_count += 1
            print(f"CREATED: {title}")
        elif status == "skipped":
            skipped_count += 1
            print(f"SKIPPED: {title}")
        elif status == "missing_company":
            missing_company_count += 1
            print(f"MISSING COMPANY: {title}")

    db.commit()

    return {
        "created": created_count,
        "skipped": skipped_count,
        "missing_company": missing_company_count,
    }