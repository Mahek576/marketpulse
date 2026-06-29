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