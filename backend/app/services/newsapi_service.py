from datetime import datetime
from typing import Any

import httpx
from sqlalchemy.orm import Session

from app.config import settings
from app.models.article import Article
from app.models.company import Company


class NewsAPIConfigError(Exception):
    pass


class NewsAPIRequestError(Exception):
    pass


def parse_news_datetime(value: str | None) -> datetime | None:
    if not value:
        return None

    try:
        return datetime.fromisoformat(value.replace("Z", "+00:00"))
    except ValueError:
        return None


def build_company_news_query(company: Company) -> str:
    return f'"{company.name}" OR {company.symbol}'


def fetch_newsapi_articles_for_company(
    company: Company,
    page_size: int = 5,
) -> tuple[str, list[dict[str, Any]]]:
    if not settings.news_api_key or settings.news_api_key == "your-newsapi-key-here":
        raise NewsAPIConfigError(
            "NEWS_API_KEY is missing. Add your NewsAPI key to the .env file."
        )

    query = build_company_news_query(company)

    params = {
        "q": query,
        "language": settings.news_api_default_language,
        "sortBy": settings.news_api_default_sort_by,
        "pageSize": page_size,
        "apiKey": settings.news_api_key,
    }

    try:
        with httpx.Client(timeout=20) as client:
            response = client.get(
                settings.news_api_base_url,
                params=params,
            )
    except httpx.HTTPError as exc:
        raise NewsAPIRequestError(f"News API request failed: {exc}") from exc

    if response.status_code >= 400:
        raise NewsAPIRequestError(
            f"News API returned status {response.status_code}: {response.text}"
        )

    data = response.json()

    if data.get("status") != "ok":
        raise NewsAPIRequestError(
            f"News API returned error: {data.get('message', 'Unknown error')}"
        )

    articles = data.get("articles", [])

    return query, articles


def normalize_newsapi_article(
    raw_article: dict[str, Any],
    company_id: int,
) -> dict[str, Any] | None:
    title = raw_article.get("title")
    url = raw_article.get("url")
    source_data = raw_article.get("source") or {}
    source_name = source_data.get("name") or "Unknown Source"

    if not title or not url:
        return None

    return {
        "company_id": company_id,
        "title": title.strip(),
        "url": url.strip(),
        "source": source_name.strip(),
        "author": raw_article.get("author"),
        "published_at": parse_news_datetime(raw_article.get("publishedAt")),
        "summary": raw_article.get("description"),
        "content": raw_article.get("content"),
        "sentiment_label": None,
        "importance_score": 50,
    }


def article_exists_by_url(
    db: Session,
    url: str,
) -> bool:
    return db.query(Article).filter(Article.url == url).first() is not None


def preview_newsapi_articles(
    raw_articles: list[dict[str, Any]],
    company_id: int,
) -> list[dict[str, Any]]:
    previews = []

    for raw_article in raw_articles:
        normalized = normalize_newsapi_article(
            raw_article=raw_article,
            company_id=company_id,
        )

        if normalized:
            previews.append(normalized)

    return previews


def ingest_newsapi_articles(
    db: Session,
    raw_articles: list[dict[str, Any]],
    company_id: int,
) -> tuple[int, int, list[dict[str, Any]]]:
    created_count = 0
    skipped_count = 0
    normalized_articles = []

    for raw_article in raw_articles:
        normalized = normalize_newsapi_article(
            raw_article=raw_article,
            company_id=company_id,
        )

        if not normalized:
            skipped_count += 1
            continue

        normalized_articles.append(normalized)

        if article_exists_by_url(db=db, url=normalized["url"]):
            skipped_count += 1
            continue

        article = Article(
            company_id=normalized["company_id"],
            title=normalized["title"],
            url=normalized["url"],
            source=normalized["source"],
            author=normalized["author"],
            published_at=normalized["published_at"],
            summary=normalized["summary"],
            content=normalized["content"],
            sentiment_label=normalized["sentiment_label"],
            importance_score=normalized["importance_score"],
            is_processed=False,
        )

        db.add(article)
        created_count += 1

    db.commit()

    return created_count, skipped_count, normalized_articles