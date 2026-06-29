"use client";

import { useEffect, useState } from "react";
import WatchlistTable from "@/components/WatchlistTable";
import { apiRequest } from "@/lib/apiClient";
import { watchlist as fallbackWatchlist } from "@/lib/mockData";
import type { WatchlistItem } from "@/lib/types";

export default function DashboardWatchlist() {
  const [watchlist, setWatchlist] =
    useState<WatchlistItem[]>(fallbackWatchlist);

  useEffect(() => {
    async function loadWatchlist() {
      try {
        const data =
          await apiRequest<WatchlistItem[]>("/dashboard/watchlist");
        setWatchlist(data);
      } catch {
        setWatchlist(fallbackWatchlist);
      }
    }

    loadWatchlist();
  }, []);

  return <WatchlistTable watchlist={watchlist} />;
}