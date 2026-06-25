from pydantic import BaseModel

from app.schemas.alert_schema import AlertResponse
from app.schemas.article_schema import ArticleResponse
from app.schemas.company_schema import CompanyResponse
from app.schemas.signal_schema import MarketSignalResponse


class PersonalizedFeedResponse(BaseModel):
    user_id: int
    watchlist_count: int
    unread_alert_count: int
    latest_articles_count: int
    latest_signals_count: int
    latest_alerts_count: int

    watchlist_companies: list[CompanyResponse]
    latest_articles: list[ArticleResponse]
    latest_signals: list[MarketSignalResponse]
    latest_alerts: list[AlertResponse]