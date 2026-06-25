from datetime import datetime

from pydantic import BaseModel


class NewsArticlePreview(BaseModel):
    title: str
    url: str
    source: str
    published_at: datetime | None


class NewsIngestionResponse(BaseModel):
    company_id: int
    company_symbol: str
    query: str
    dry_run: bool
    fetched: int
    created: int
    skipped: int
    articles: list[NewsArticlePreview]