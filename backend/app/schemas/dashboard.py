from typing import Literal

from pydantic import BaseModel


class DashboardSummary(BaseModel):
    tracked_companies: int
    market_alerts: int
    news_signals: int
    avg_sentiment: str
    tracked_companies_change: str
    market_alerts_change: str
    news_signals_change: str
    avg_sentiment_change: str


class DashboardWatchlistItem(BaseModel):
    company_id: int
    symbol: str
    name: str
    sentiment: Literal["Bullish", "Bearish", "Neutral"]
    impact: Literal["High", "Medium", "Low"]

class DashboardFeedItem(BaseModel):
    title: str
    source: str
    tag: Literal["Positive", "Caution", "Neutral"]


class DashboardRiskSignal(BaseModel):
    title: str
    description: str
    severity: Literal["high", "medium", "positive"]