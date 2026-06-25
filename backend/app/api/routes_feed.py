from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_user
from app.db.database import get_db
from app.models.user import User
from app.schemas.feed_schema import PersonalizedFeedResponse
from app.services.feed_service import build_personalized_feed


router = APIRouter(
    prefix="/feed",
    tags=["Feed"],
)


@router.get(
    "",
    response_model=PersonalizedFeedResponse,
)
def get_my_personalized_feed(
    limit: int = Query(default=10, ge=1, le=50),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    feed = build_personalized_feed(
        db=db,
        user_id=current_user.id,
        limit=limit,
    )

    return feed