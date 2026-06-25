from sqlalchemy.orm import Session

from app.models.company import Company
from app.schemas.company_schema import CompanyCreate


def normalize_symbol(symbol: str) -> str:
    return symbol.strip().upper()


def normalize_exchange(exchange: str) -> str:
    return exchange.strip().upper()


def get_company_by_id(db: Session, company_id: int) -> Company | None:
    return db.query(Company).filter(Company.id == company_id).first()


def get_company_by_symbol(db: Session, symbol: str) -> Company | None:
    normalized_symbol = normalize_symbol(symbol)

    return db.query(Company).filter(Company.symbol == normalized_symbol).first()


def get_companies(db: Session, skip: int = 0, limit: int = 50) -> list[Company]:
    return (
        db.query(Company)
        .filter(Company.is_active == True)
        .offset(skip)
        .limit(limit)
        .all()
    )


def create_company(db: Session, company_data: CompanyCreate) -> Company:
    company = Company(
        symbol=normalize_symbol(company_data.symbol),
        name=company_data.name.strip(),
        exchange=normalize_exchange(company_data.exchange),
        sector=company_data.sector.strip() if company_data.sector else None,
        industry=company_data.industry.strip() if company_data.industry else None,
        country=company_data.country.strip(),
    )

    db.add(company)
    db.commit()
    db.refresh(company)

    return company