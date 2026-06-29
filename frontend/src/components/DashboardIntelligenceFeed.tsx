"use client";

import { useEffect, useState } from "react";
import IntelligenceFeed from "@/components/IntelligenceFeed";
import { apiRequest } from "@/lib/apiClient";
import { news as fallbackNews } from "@/lib/mockData";
import type { NewsItem } from "@/lib/types";

export default function DashboardIntelligenceFeed() {
  const [news, setNews] = useState<NewsItem[]>(fallbackNews);

  useEffect(() => {
    async function loadFeed() {
      try {
        const data = await apiRequest<NewsItem[]>("/dashboard/feed");
        setNews(data);
      } catch {
        setNews(fallbackNews);
      }
    }

    loadFeed();
  }, []);

  return <IntelligenceFeed news={news} />;
}