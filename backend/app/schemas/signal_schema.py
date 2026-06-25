from datetime import datetime

from pydantic import BaseModel


class MarketSignalResponse(BaseModel):
    id: int
    company_id: int | None
    article_id: int | None
    signal_type: str
    severity: str
    score: int
    title: str
    description: str | None
    reason: str
    why_it_matters: str
    is_active: bool
    created_at: datetime

    model_config = {
        "from_attributes": True
    }