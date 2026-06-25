from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_user
from app.db.database import get_db
from app.models.user import User
from app.schemas.company_schema import CompanyResponse
from app.services.company_service import get_company_by_id
from app.services.watchlist_service import (
    add_company_to_watchlist,
    get_user_watchlist_companies,
    get_watchlist_item,
    remove_company_from_watchlist,
)


router = APIRouter(
    prefix="/watchlist",
    tags=["Watchlist"],
)


@router.post(
    "/{company_id}",
    response_model=CompanyResponse,
    status_code=status.HTTP_201_CREATED,
)
def add_to_watchlist(
    company_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    company = get_company_by_id(db, company_id)

    if not company:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Company not found",
        )

    existing_item = get_watchlist_item(
        db=db,
        user_id=current_user.id,
        company_id=company_id,
    )

    if existing_item:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Company already exists in your watchlist",
        )

    add_company_to_watchlist(
        db=db,
        user_id=current_user.id,
        company_id=company_id,
    )

    return company


@router.get(
    "",
    response_model=list[CompanyResponse],
)
def get_my_watchlist(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    companies = get_user_watchlist_companies(
        db=db,
        user_id=current_user.id,
    )

    return companies


@router.delete(
    "/{company_id}",
)
def delete_from_watchlist(
    company_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    removed = remove_company_from_watchlist(
        db=db,
        user_id=current_user.id,
        company_id=company_id,
    )

    if not removed:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Company not found in your watchlist",
        )

    return {
        "message": "Company removed from watchlist",
        "company_id": company_id,
    }