export type MetricCardData = {
  title: string;
  value: string;
  change: string;
};

export type WatchlistItem = {
  company_id?: number;
  symbol: string;
  name: string;
  sentiment: "Bullish" | "Bearish" | "Neutral";
  impact: "High" | "Medium" | "Low";
};
export type NewsItem = {
  title: string;
  source: string;
  tag: "Positive" | "Caution" | "Neutral";
};
export type DashboardSummary = {
  tracked_companies: number;
  market_alerts: number;
  news_signals: number;
  avg_sentiment: string;
  tracked_companies_change: string;
  market_alerts_change: string;
  news_signals_change: string;
  avg_sentiment_change: string;
};
export type RiskSignal = {
  title: string;
  description: string;
  severity: "high" | "medium" | "positive";
};
export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  email: string;
  full_name?: string;
  password: string;
};

export type TokenResponse = {
  access_token: string;
  token_type: string;
};

export type UserProfile = {
  id: number;
  email: string;
  full_name: string | null;
  is_active: boolean;
  created_at: string;
};
export type Company = {
  id: number;
  symbol: string;
  name: string;
  exchange: string;
  sector: string | null;
  industry: string | null;
  country: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};
export type AlertItem = {
  id: number;
  user_id: number;
  company_id: number | null;
  signal_id: number;
  alert_type: string;
  severity: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
};
export type ArticleItem = {
  id: number;
  company_id: number | null;
  title: string;
  url: string;
  source: string;
  author: string | null;
  published_at: string | null;
  summary: string | null;
  content: string | null;
  sentiment_label: string | null;
  importance_score: number;
  is_processed: boolean;
  created_at: string;
};

export type PersonalizedFeed = {
  user_id: number;
  watchlist_count: number;
  unread_alert_count: number;
  latest_articles_count: number;
  latest_signals_count: number;
  latest_alerts_count: number;
  watchlist_companies: Company[];
  latest_articles: ArticleItem[];
  latest_signals: MarketSignalItem[];
  latest_alerts: AlertItem[];
};
export type MarketSignalItem = {
  id: number;
  company_id: number | null;
  article_id: number | null;
  signal_type: string;
  severity: string;
  score: number;
  title: string;
  description: string | null;
  reason: string;
  why_it_matters: string;
  is_active: boolean;
  created_at: string;
};