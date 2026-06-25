from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_user
from app.db.database import get_db
from app.models.user import User
from app.schemas.company_schema import CompanyCreate, CompanyResponse
from app.services.cache_service import (
    build_companies_cache_key,
    clear_companies_cache,
    get_cached_value,
    set_cached_value,
)
from app.services.company_service import (
    create_company,
    get_companies,
    get_company_by_id,
    get_company_by_symbol,
)


router = APIRouter(
    prefix="/companies",
    tags=["Companies"],
)


@router.post(
    "",
    response_model=CompanyResponse,
    status_code=status.HTTP_201_CREATED,
)
def add_company(
    company_data: CompanyCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    existing_company = get_company_by_symbol(db, company_data.symbol)

    if existing_company:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Company with this symbol already exists",
        )

    company = create_company(db, company_data)

    clear_companies_cache()

    return company


@router.get(
    "",
    response_model=list[CompanyResponse],
)
def list_companies(
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=50, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    cache_key = build_companies_cache_key(skip=skip, limit=limit)

    cached_companies = get_cached_value(cache_key)

    if cached_companies is not None:
        return cached_companies

    companies = get_companies(db, skip=skip, limit=limit)

    serialized_companies = [
        CompanyResponse.model_validate(company).model_dump(mode="json")
        for company in companies
    ]

    set_cached_value(
        key=cache_key,
        value=serialized_companies,
    )

    return serialized_companies


@router.get(
    "/{company_id}",
    response_model=CompanyResponse,
)
def get_company(
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

    return company