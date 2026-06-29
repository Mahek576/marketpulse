"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import AuthGuard from "@/components/AuthGuard";
import Sidebar from "@/components/Sidebar";
import SignalsList from "@/components/SignalsList";
import TopBar from "@/components/TopBar";
import { apiRequest } from "@/lib/apiClient";
import { getAuthToken } from "@/lib/auth";
import type { AlertItem, MarketSignalItem } from "@/lib/types";

export default function SignalsPage() {
  const [signals, setSignals] = useState<MarketSignalItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "info">(
    "info"
  );
  const [showActiveOnly, setShowActiveOnly] = useState(true);
  const [creatingAlertSignalId, setCreatingAlertSignalId] = useState<
    number | null
  >(null);

  useEffect(() => {
    async function loadSignals() {
      const token = getAuthToken();

      if (!token) {
        setSignals([]);
        setIsLoading(false);
        return;
      }

      try {
        const data = await apiRequest<MarketSignalItem[]>("/signals?limit=50", {
          token,
        });

        setSignals(data);
      } catch {
        setMessage("Unable to load market signals right now.");
        setMessageType("error");
      } finally {
        setIsLoading(false);
      }
    }

    loadSignals();
  }, []);

  const filteredSignals = useMemo(() => {
    if (!showActiveOnly) {
      return signals;
    }

    return signals.filter((signal) => signal.is_active);
  }, [signals, showActiveOnly]);

  const activeCount = useMemo(
    () => signals.filter((signal) => signal.is_active).length,
    [signals]
  );

  const highPriorityCount = useMemo(
    () =>
      signals.filter(
        (signal) =>
          signal.score >= 75 ||
          signal.severity.toLowerCase().includes("high") ||
          signal.severity.toLowerCase().includes("critical")
      ).length,
    [signals]
  );

  const avgScore = useMemo(() => {
    if (signals.length === 0) {
      return 0;
    }

    const total = signals.reduce((sum, signal) => sum + signal.score, 0);

    return Math.round(total / signals.length);
  }, [signals]);

  async function handleCreateAlert(signalId: number) {
    const token = getAuthToken();

    if (!token) {
      setMessage("Please log in again to create alerts.");
      setMessageType("error");
      return;
    }

    setCreatingAlertSignalId(signalId);
    setMessage("");

    try {
      await apiRequest<AlertItem>(`/alerts/from-signal/${signalId}`, {
        method: "POST",
        token,
      });

      setMessage("Alert created successfully.");
      setMessageType("success");
    } catch {
      setMessage(
        "Could not create alert. The company may not be in your watchlist, or the alert may already exist."
      );
      setMessageType("error");
    } finally {
      setCreatingAlertSignalId(null);
    }
  }

  function getMessageClass() {
    if (messageType === "success") {
      return "border-emerald-400/20 bg-emerald-400/10 text-emerald-200";
    }

    if (messageType === "error") {
      return "border-rose-400/20 bg-rose-400/10 text-rose-200";
    }

    return "border-cyan-400/20 bg-cyan-400/10 text-cyan-200";
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
                  Signal Intelligence
                </div>

                <h1 className="text-3xl font-bold tracking-tight">
                  Market Signals
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                  Review AI-generated market risk, opportunity, and monitoring
                  signals created from processed financial news.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  suppressHydrationWarning
                  onClick={() => setShowActiveOnly((current) => !current)}
                  className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/[0.08] hover:text-white"
                >
                  {showActiveOnly ? "Show all signals" : "Show active only"}
                </button>

                <Link
                  href="/alerts"
                  className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-5 py-3 text-sm font-medium text-cyan-300 transition hover:bg-cyan-400/15"
                >
                  View Alerts
                </Link>
              </div>
            </div>

            <section className="mb-6 grid gap-4 md:grid-cols-4">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <div className="text-sm text-slate-400">Total Signals</div>
                <div className="mt-3 text-3xl font-bold">{signals.length}</div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <div className="text-sm text-slate-400">Active Signals</div>
                <div className="mt-3 text-3xl font-bold">{activeCount}</div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <div className="text-sm text-slate-400">High Priority</div>
                <div className="mt-3 text-3xl font-bold">
                  {highPriorityCount}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <div className="text-sm text-slate-400">Avg Score</div>
                <div className="mt-3 text-3xl font-bold">{avgScore}/100</div>
              </div>
            </section>

            {message ? (
              <div
                className={`mb-5 rounded-2xl border px-4 py-3 text-sm ${getMessageClass()}`}
              >
                {message}
              </div>
            ) : null}

            {isLoading ? (
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-sm text-slate-400">
                Loading market signals...
              </div>
            ) : (
              <SignalsList
                signals={filteredSignals}
                onCreateAlert={handleCreateAlert}
                creatingAlertSignalId={creatingAlertSignalId}
              />
            )}
          </section>
        </div>
      </main>
    </AuthGuard>
  );
}