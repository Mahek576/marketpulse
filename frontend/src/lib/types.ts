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