"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import AuthGuard from "@/components/AuthGuard";
import NewsList from "@/components/NewsList";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import { apiRequest } from "@/lib/apiClient";
import { getAuthToken } from "@/lib/auth";
import type { ArticleItem, MarketSignalItem } from "@/lib/types";

export default function NewsPage() {
  const [articles, setArticles] = useState<ArticleItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "info">(
    "info"
  );
  const [creatingSignalArticleId, setCreatingSignalArticleId] = useState<
    number | null
  >(null);

  const processedCount = useMemo(
    () => articles.filter((article) => article.is_processed).length,
    [articles]
  );

  const avgImportance = useMemo(() => {
    if (articles.length === 0) {
      return 0;
    }

    const total = articles.reduce(
      (sum, article) => sum + article.importance_score,
      0
    );

    return Math.round(total / articles.length);
  }, [articles]);

  async function loadArticles() {
    const token = getAuthToken();

    if (!token) {
      setArticles([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    try {
      const data = await apiRequest<ArticleItem[]>("/articles?limit=50", {
        token,
      });

      setArticles(data);
    } catch {
      setMessage("Unable to load articles right now.");
      setMessageType("error");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadArticles();
  }, []);

  async function handleCreateSignal(articleId: number) {
    const token = getAuthToken();

    if (!token) {
      setMessage("Please log in again to create signals.");
      setMessageType("error");
      return;
    }

    setCreatingSignalArticleId(articleId);
    setMessage("");

    try {
      const signal = await apiRequest<MarketSignalItem>(
        `/signals/from-article/${articleId}`,
        {
          method: "POST",
          token,
        }
      );

      setMessage(`Signal created successfully. Signal ID: ${signal.id}`);
      setMessageType("success");

      await loadArticles();
    } catch {
      setMessage(
        "Could not create signal. A signal may already exist for this article."
      );
      setMessageType("error");
    } finally {
      setCreatingSignalArticleId(null);
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
                  News Intelligence
                </div>

                <h1 className="text-3xl font-bold tracking-tight">
                  Market News Intelligence
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                  Review all market articles, generate signals, and move
                  important intelligence into the alert workflow.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/articles/new"
                  className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/[0.08] hover:text-white"
                >
                  Add Article
                </Link>

                <Link
                  href="/signals"
                  className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/[0.08] hover:text-white"
                >
                  View Signals
                </Link>

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
                <div className="text-sm text-slate-400">Articles Loaded</div>
                <div className="mt-3 text-3xl font-bold">
                  {articles.length}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <div className="text-sm text-slate-400">Processed</div>
                <div className="mt-3 text-3xl font-bold">{processedCount}</div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <div className="text-sm text-slate-400">Avg Importance</div>
                <div className="mt-3 text-3xl font-bold">
                  {avgImportance}/100
                </div>
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
                Loading news intelligence...
              </div>
            ) : (
              <NewsList
                articles={articles}
                onCreateSignal={handleCreateSignal}
                creatingSignalArticleId={creatingSignalArticleId}
              />
            )}
          </section>
        </div>
      </main>
    </AuthGuard>
  );
}