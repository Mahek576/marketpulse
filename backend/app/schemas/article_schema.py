from datetime import datetime

from pydantic import BaseModel, Field, HttpUrl


class ArticleCreate(BaseModel):
    company_id: int | None = None
    title: str = Field(min_length=1, max_length=500)
    url: HttpUrl
    source: str = Field(min_length=1, max_length=150)
    author: str | None = Field(default=None, max_length=150)
    published_at: datetime | None = None
    summary: str | None = None
    content: str | None = None
    sentiment_label: str | None = Field(default=None, max_length=50)
    importance_score: int = Field(default=0, ge=0, le=100)


class ArticleResponse(BaseModel):
    id: int
    company_id: int | None
    title: str
    url: str
    source: str
    author: str | None
    published_at: datetime | None
    summary: str | None
    content: str | None
    sentiment_label: str | None
    importance_score: int
    is_processed: bool
    created_at: datetime

    model_config = {
        "from_attributes": True
    }