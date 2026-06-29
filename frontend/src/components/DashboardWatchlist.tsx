"use client";

import { useEffect, useState } from "react";
import WatchlistTable from "@/components/WatchlistTable";
import { apiRequest } from "@/lib/apiClient";
import { getAuthToken } from "@/lib/auth";
import { watchlist as fallbackWatchlist } from "@/lib/mockData";
import type { WatchlistItem } from "@/lib/types";

export default function DashboardWatchlist() {
  const [watchlist, setWatchlist] =
    useState<WatchlistItem[]>(fallbackWatchlist);

  useEffect(() => {
    async function loadWatchlist() {
      const token = getAuthToken();

      if (!token) {
        setWatchlist([]);
        return;
      }

      try {
        const data = await apiRequest<WatchlistItem[]>("/dashboard/watchlist", {
          token,
        });

        setWatchlist(data);
      } catch {
        setWatchlist([]);
      }
    }

    loadWatchlist();
  }, []);

  return <WatchlistTable watchlist={watchlist} />;
}