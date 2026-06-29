"use client";

import { useEffect, useState } from "react";
import WatchlistTable from "@/components/WatchlistTable";
import { apiRequest } from "@/lib/apiClient";
import { getAuthToken } from "@/lib/auth";
import type { WatchlistItem } from "@/lib/types";

export default function DashboardWatchlist() {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [removingCompanyId, setRemovingCompanyId] = useState<number | null>(
    null
  );

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

  useEffect(() => {
    loadWatchlist();
  }, []);

  async function handleRemove(companyId: number) {
    const token = getAuthToken();

    if (!token) {
      return;
    }

    setRemovingCompanyId(companyId);

    try {
      await apiRequest(`/watchlist/${companyId}`, {
        method: "DELETE",
        token,
      });

      setWatchlist((currentWatchlist) =>
        currentWatchlist.filter((item) => item.company_id !== companyId)
      );
    } catch {
      await loadWatchlist();
    } finally {
      setRemovingCompanyId(null);
    }
  }

  return (
    <WatchlistTable
      watchlist={watchlist}
      onRemove={handleRemove}
      removingCompanyId={removingCompanyId}
    />
  );
}