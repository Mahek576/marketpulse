from datetime import datetime

from pydantic import BaseModel


class AlertResponse(BaseModel):
    id: int
    user_id: int
    company_id: int | None
    signal_id: int
    alert_type: str
    severity: str
    title: str
    message: str
    is_read: bool
    created_at: datetime

    model_config = {
        "from_attributes": True
    }