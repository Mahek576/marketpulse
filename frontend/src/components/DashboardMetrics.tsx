"use client";

import { useEffect, useState } from "react";
import MetricCard from "@/components/MetricCard";
import { apiRequest } from "@/lib/apiClient";
import { marketCards } from "@/lib/mockData";
import type { DashboardSummary, MetricCardData } from "@/lib/types";

function mapSummaryToCards(summary: DashboardSummary): MetricCardData[] {
  return [
    {
      title: "Tracked Companies",
      value: String(summary.tracked_companies),
      change: summary.tracked_companies_change,
    },
    {
      title: "Market Alerts",
      value: String(summary.market_alerts),
      change: summary.market_alerts_change,
    },
    {
      title: "News Signals",
      value: String(summary.news_signals),
      change: summary.news_signals_change,
    },
    {
      title: "Avg Sentiment",
      value: summary.avg_sentiment,
      change: summary.avg_sentiment_change,
    },
  ];
}

export default function DashboardMetrics() {
  const [cards, setCards] = useState<MetricCardData[]>(marketCards);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    async function loadSummary() {
      try {
        const summary = await apiRequest<DashboardSummary>("/dashboard/summary");
        setCards(mapSummaryToCards(summary));
        setIsLive(true);
      } catch {
        setCards(marketCards);
        setIsLive(false);
      }
    }

    loadSummary();
  }, []);

  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
          Dashboard Metrics
        </p>

        <div
          className={`rounded-full border px-3 py-1 text-xs ${
            isLive
              ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
              : "border-amber-400/20 bg-amber-400/10 text-amber-300"
          }`}
        >
          {isLive ? "Live API data" : "Using fallback data"}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <MetricCard
            key={card.title}
            title={card.title}
            value={card.value}
            change={card.change}
          />
        ))}
      </div>
    </section>
  );
}