export type MetricCardData = {
  title: string;
  value: string;
  change: string;
};

export type WatchlistItem = {
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