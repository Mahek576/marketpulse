from sqlalchemy.orm import Session

from app.models.company import Company
from app.models.watchlist import Watchlist


def get_watchlist_item(
    db: Session,
    user_id: int,
    company_id: int,
) -> Watchlist | None:
    return (
        db.query(Watchlist)
        .filter(
            Watchlist.user_id == user_id,
            Watchlist.company_id == company_id,
        )
        .first()
    )


def add_company_to_watchlist(
    db: Session,
    user_id: int,
    company_id: int,
) -> Watchlist:
    watchlist_item = Watchlist(
        user_id=user_id,
        company_id=company_id,
    )

    db.add(watchlist_item)
    db.commit()
    db.refresh(watchlist_item)

    return watchlist_item


def get_user_watchlist_companies(
    db: Session,
    user_id: int,
) -> list[Company]:
    return (
        db.query(Company)
        .join(Watchlist, Watchlist.company_id == Company.id)
        .filter(
            Watchlist.user_id == user_id,
            Company.is_active == True,
        )
        .all()
    )


def remove_company_from_watchlist(
    db: Session,
    user_id: int,
    company_id: int,
) -> bool:
    watchlist_item = get_watchlist_item(
        db=db,
        user_id=user_id,
        company_id=company_id,
    )

    if not watchlist_item:
        return False

    db.delete(watchlist_item)
    db.commit()

    return True