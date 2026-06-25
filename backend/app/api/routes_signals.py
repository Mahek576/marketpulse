from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_user
from app.db.database import get_db
from app.models.user import User
from app.schemas.signal_schema import MarketSignalResponse
from app.services.article_service import get_article_by_id
from app.services.signal_service import (
    generate_signal_from_article,
    get_signal_by_article_id,
    get_signal_by_id,
    get_signals,
)


router = APIRouter(
    prefix="/signals",
    tags=["Signals"],
)


@router.post(
    "/from-article/{article_id}",
    response_model=MarketSignalResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_signal_from_article(
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

    existing_signal = get_signal_by_article_id(db, article_id)

    if existing_signal:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Signal already exists for this article",
        )

    signal = generate_signal_from_article(db, article)

    return signal


@router.get(
    "",
    response_model=list[MarketSignalResponse],
)
def list_signals(
    company_id: int | None = Query(default=None),
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=50, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    signals = get_signals(
        db=db,
        company_id=company_id,
        skip=skip,
        limit=limit,
    )

    return signals


@router.get(
    "/{signal_id}",
    response_model=MarketSignalResponse,
)
def get_signal(
    signal_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    signal = get_signal_by_id(db, signal_id)

    if not signal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Signal not found",
        )

    return signal