from datetime import datetime

from pydantic import BaseModel, Field


class CompanyCreate(BaseModel):
    symbol: str = Field(min_length=1, max_length=50)
    name: str = Field(min_length=1, max_length=255)
    exchange: str = Field(min_length=1, max_length=50)
    sector: str | None = Field(default=None, max_length=100)
    industry: str | None = Field(default=None, max_length=150)
    country: str = Field(default="India", max_length=100)


class CompanyResponse(BaseModel):
    id: int
    symbol: str
    name: str
    exchange: str
    sector: str | None
    industry: str | None
    country: str
    is_active: bool
    created_at: datetime

    model_config = {
        "from_attributes": True
    }