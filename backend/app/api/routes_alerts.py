from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_user
from app.db.database import get_db
from app.models.user import User
from app.schemas.alert_schema import AlertResponse
from app.services.alert_service import (
    create_alert_from_signal,
    get_alert_by_id,
    get_alert_for_user_and_signal,
    get_user_alerts,
    mark_alert_as_read,
    user_watches_company,
)
from app.services.signal_service import get_signal_by_id


router = APIRouter(
    prefix="/alerts",
    tags=["Alerts"],
)


@router.post(
    "/from-signal/{signal_id}",
    response_model=AlertResponse,
    status_code=status.HTTP_201_CREATED,
)
def generate_alert_from_signal(
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

    if signal.company_id is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Signal is not linked to a company",
        )

    if not user_watches_company(
        db=db,
        user_id=current_user.id,
        company_id=signal.company_id,
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Company is not in your watchlist",
        )

    existing_alert = get_alert_for_user_and_signal(
        db=db,
        user_id=current_user.id,
        signal_id=signal.id,
    )

    if existing_alert:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Alert already exists for this signal",
        )

    alert = create_alert_from_signal(
        db=db,
        user_id=current_user.id,
        signal=signal,
    )

    return alert


@router.get(
    "",
    response_model=list[AlertResponse],
)
def list_my_alerts(
    unread_only: bool = Query(default=False),
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=50, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    alerts = get_user_alerts(
        db=db,
        user_id=current_user.id,
        unread_only=unread_only,
        skip=skip,
        limit=limit,
    )

    return alerts


@router.patch(
    "/{alert_id}/read",
    response_model=AlertResponse,
)
def mark_my_alert_as_read(
    alert_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    alert = get_alert_by_id(db, alert_id)

    if not alert:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Alert not found",
        )

    if alert.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have access to this alert",
        )

    alert = mark_alert_as_read(db=db, alert=alert)

    return alert