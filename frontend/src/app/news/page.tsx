"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import AuthGuard from "@/components/AuthGuard";
import NewsList from "@/components/NewsList";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import { apiRequest } from "@/lib/apiClient";
import { getAuthToken } from "@/lib/auth";
import type { ArticleItem, PersonalizedFeed } from "@/lib/types";

export default function NewsPage() {
  const [articles, setArticles] = useState<ArticleItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");

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

  useEffect(() => {
    async function loadNews() {
      const token = getAuthToken();

      if (!token) {
        setArticles([]);
        setIsLoading(false);
        return;
      }

      try {
        const feed = await apiRequest<PersonalizedFeed>("/feed?limit=20", {
          token,
        });

        setArticles(feed.latest_articles);
      } catch {
        setMessage("Unable to load news intelligence right now.");
      } finally {
        setIsLoading(false);
      }
    }

    loadNews();
  }, []);

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
                  Review market-moving articles, sentiment labels, source
                  attribution, and article importance scores.
                </p>
              </div>

              <Link
                href="/"
                className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-5 py-3 text-sm font-medium text-cyan-300 transition hover:bg-cyan-400/15"
              >
                Back to Dashboard
              </Link>
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
                <div className="mt-3 text-3xl font-bold">
                  {processedCount}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <div className="text-sm text-slate-400">Avg Importance</div>
                <div className="mt-3 text-3xl font-bold">
                  {avgImportance}/100
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
                Loading news intelligence...
              </div>
            ) : (
              <NewsList articles={articles} />
            )}
          </section>
        </div>
      </main>
    </AuthGuard>
  );
}