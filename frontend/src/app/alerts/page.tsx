"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import AlertsList from "@/components/AlertsList";
import AuthGuard from "@/components/AuthGuard";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import { apiRequest } from "@/lib/apiClient";
import { getAuthToken } from "@/lib/auth";
import type { AlertItem } from "@/lib/types";

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [message, setMessage] = useState("");
  const [markingAlertId, setMarkingAlertId] = useState<number | null>(null);

  const unreadCount = useMemo(
    () => alerts.filter((alert) => !alert.is_read).length,
    [alerts]
  );

  async function loadAlerts(unreadOnly = showUnreadOnly) {
    const token = getAuthToken();

    if (!token) {
      setAlerts([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      const data = await apiRequest<AlertItem[]>(
        `/alerts?unread_only=${unreadOnly}`,
        {
          token,
        }
      );

      setAlerts(data);
    } catch {
      setMessage("Unable to load alerts right now.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadAlerts(false);
  }, []);

  async function handleToggleUnreadOnly() {
    const nextValue = !showUnreadOnly;
    setShowUnreadOnly(nextValue);
    await loadAlerts(nextValue);
  }

  async function handleMarkRead(alertId: number) {
    const token = getAuthToken();

    if (!token) {
      setMessage("Please log in again to update alerts.");
      return;
    }

    setMarkingAlertId(alertId);
    setMessage("");

    try {
      const updatedAlert = await apiRequest<AlertItem>(
        `/alerts/${alertId}/read`,
        {
          method: "PATCH",
          token,
        }
      );

      setAlerts((currentAlerts) =>
        currentAlerts.map((alert) =>
          alert.id === alertId ? updatedAlert : alert
        )
      );
    } catch {
      setMessage("Unable to mark this alert as read.");
    } finally {
      setMarkingAlertId(null);
    }
  }

  return (
    <AuthGuard>
      <main className="min-h-screen bg-[#070a12] text-white">
        <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.12),transparent_35%),radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.12),transparent_30%)]" />

        <div className="flex min-h-screen">
          <Sidebar />

          <section className="flex-1 px-5 py-6 md:px-8 lg:px-10">
            <TopBar />

            <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <div className="mb-2 inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-300">
                  Alert Center
                </div>

                <h1 className="text-3xl font-bold tracking-tight">Alerts</h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                  Review market alerts generated from signals related to your
                  watchlisted companies.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  suppressHydrationWarning
                  onClick={handleToggleUnreadOnly}
                  className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/[0.08] hover:text-white"
                >
                  {showUnreadOnly ? "Show all alerts" : "Show unread only"}
                </button>

                <Link
                  href="/"
                  className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-5 py-3 text-sm font-medium text-cyan-300 transition hover:bg-cyan-400/15"
                >
                  Back to Dashboard
                </Link>
              </div>
            </div>

            <section className="mb-6 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <div className="text-sm text-slate-400">Total Alerts</div>
                <div className="mt-3 text-3xl font-bold">{alerts.length}</div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <div className="text-sm text-slate-400">Unread Alerts</div>
                <div className="mt-3 text-3xl font-bold">{unreadCount}</div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <div className="text-sm text-slate-400">Filter</div>
                <div className="mt-3 text-xl font-bold">
                  {showUnreadOnly ? "Unread only" : "All alerts"}
                </div>
              </div>
            </section>

            {message ? (
              <div className="mb-5 rounded-2xl border border-amber-400/20 bg-amber-400/10 px-4 py-3 text-sm text-amber-200">
                {message}
              </div>
            ) : null}

            {isLoading ? (
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-sm text-slate-400">
                Loading alerts...
              </div>
            ) : (
              <AlertsList
                alerts={alerts}
                onMarkRead={handleMarkRead}
                markingAlertId={markingAlertId}
              />
            )}
          </section>
        </div>
      </main>
    </AuthGuard>
  );
}