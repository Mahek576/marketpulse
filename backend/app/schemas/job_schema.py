from datetime import datetime

from pydantic import BaseModel


class IngestionJobResponse(BaseModel):
    id: int
    user_id: int
    job_type: str
    status: str
    source: str | None

    total_records: int
    created_count: int
    skipped_count: int
    missing_company_count: int

    error_message: str | None

    started_at: datetime | None
    finished_at: datetime | None
    created_at: datetime

    model_config = {
        "from_attributes": True
    }