from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_user
from app.db.database import get_db
from app.models.user import User
from app.schemas.ingestion_schema import NewsArticlePreview, NewsIngestionResponse
from app.services.company_service import get_company_by_id
from app.services.newsapi_service import (
    NewsAPIConfigError,
    NewsAPIRequestError,
    fetch_newsapi_articles_for_company,
    ingest_newsapi_articles,
    preview_newsapi_articles,
)


router = APIRouter(
    prefix="/ingestion",
    tags=["Ingestion"],
)


@router.post(
    "/news/company/{company_id}",
    response_model=NewsIngestionResponse,
)
def ingest_company_news(
    company_id: int,
    page_size: int = Query(default=5, ge=1, le=20),
    dry_run: bool = Query(default=True),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    company = get_company_by_id(db, company_id)

    if not company:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Company not found",
        )

    try:
        query, raw_articles = fetch_newsapi_articles_for_company(
            company=company,
            page_size=page_size,
        )
    except NewsAPIConfigError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc
    except NewsAPIRequestError as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=str(exc),
        ) from exc

    if dry_run:
        normalized_articles = preview_newsapi_articles(
            raw_articles=raw_articles,
            company_id=company.id,
        )

        return {
            "company_id": company.id,
            "company_symbol": company.symbol,
            "query": query,
            "dry_run": True,
            "fetched": len(raw_articles),
            "created": 0,
            "skipped": 0,
            "articles": [
                NewsArticlePreview(
                    title=article["title"],
                    url=article["url"],
                    source=article["source"],
                    published_at=article["published_at"],
                )
                for article in normalized_articles
            ],
        }

    created_count, skipped_count, normalized_articles = ingest_newsapi_articles(
        db=db,
        raw_articles=raw_articles,
        company_id=company.id,
    )

    return {
        "company_id": company.id,
        "company_symbol": company.symbol,
        "query": query,
        "dry_run": False,
        "fetched": len(raw_articles),
        "created": created_count,
        "skipped": skipped_count,
        "articles": [
            NewsArticlePreview(
                title=article["title"],
                url=article["url"],
                source=article["source"],
                published_at=article["published_at"],
            )
            for article in normalized_articles
        ],
    }