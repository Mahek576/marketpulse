import type {
  MetricCardData,
  NewsItem,
  RiskSignal,
  WatchlistItem,
} from "./types";

export const marketCards: MetricCardData[] = [
  {
    title: "Tracked Companies",
    value: "24",
    change: "+6 this week",
  },
  {
    title: "Market Alerts",
    value: "12",
    change: "4 high priority",
  },
  {
    title: "News Signals",
    value: "186",
    change: "Last 24 hours",
  },
  {
    title: "Avg Sentiment",
    value: "Bullish",
    change: "+18% momentum",
  },
];

export const watchlist: WatchlistItem[] = [
  {
    symbol: "RELIANCE",
    name: "Reliance Industries",
    sentiment: "Bullish",
    impact: "High",
  },
  {
    symbol: "TCS",
    name: "Tata Consultancy Services",
    sentiment: "Neutral",
    impact: "Medium",
  },
  {
    symbol: "INFY",
    name: "Infosys",
    sentiment: "Bearish",
    impact: "Medium",
  },
  {
    symbol: "HDFCBANK",
    name: "HDFC Bank",
    sentiment: "Bullish",
    impact: "High",
  },
];

export const news: NewsItem[] = [
  {
    title: "Reliance gains attention after energy expansion update",
    source: "MarketPulse Intelligence",
    tag: "Positive",
  },
  {
    title: "IT sector sentiment weakens amid global demand concerns",
    source: "AI News Monitor",
    tag: "Caution",
  },
  {
    title: "Banking stocks remain active as rate outlook stabilizes",
    source: "Financial Signals",
    tag: "Neutral",
  },
];
export const riskSignals: RiskSignal[] = [
  {
    title: "High Volatility",
    description: "IT sector showing negative sentiment acceleration.",
    severity: "high",
  },
  {
    title: "Earnings Watch",
    description: "Banking names may react to upcoming quarterly updates.",
    severity: "medium",
  },
  {
    title: "Positive Momentum",
    description: "Energy and infrastructure news flow remains strong.",
    severity: "positive",
  },
];