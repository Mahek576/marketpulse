from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_user
from app.db.database import get_db
from app.models.user import User
from app.schemas.article_schema import ArticleCreate, ArticleResponse
from app.services.article_service import (
    create_article,
    get_article_by_id,
    get_article_by_url,
    get_articles,
)
from app.services.company_service import get_company_by_id


router = APIRouter(
    prefix="/articles",
    tags=["Articles"],
)


@router.post(
    "",
    response_model=ArticleResponse,
    status_code=status.HTTP_201_CREATED,
)
def add_article(
    article_data: ArticleCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if article_data.company_id is not None:
        company = get_company_by_id(db, article_data.company_id)

        if not company:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Company not found",
            )

    existing_article = get_article_by_url(db, str(article_data.url))

    if existing_article:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Article with this URL already exists",
        )

    article = create_article(db, article_data)

    return article


@router.get(
    "",
    response_model=list[ArticleResponse],
)
def list_articles(
    company_id: int | None = Query(default=None),
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=50, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    articles = get_articles(
        db=db,
        company_id=company_id,
        skip=skip,
        limit=limit,
    )

    return articles


@router.get(
    "/{article_id}",
    response_model=ArticleResponse,
)
def get_article(
    article_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    article = get_article_by_id(db, article_id)

    if not article:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Article not found",
        )

    return article