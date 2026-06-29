"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import AuthGuard from "@/components/AuthGuard";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import { apiRequest } from "@/lib/apiClient";
import { getAuthToken } from "@/lib/auth";
import type { ArticleCreateRequest, ArticleItem, Company } from "@/lib/types";

export default function NewArticlePage() {
  const [companies, setCompanies] = useState<Company[]>([]);

  const [companyId, setCompanyId] = useState("");
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [source, setSource] = useState("");
  const [author, setAuthor] = useState("");
  const [publishedAt, setPublishedAt] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [sentimentLabel, setSentimentLabel] = useState("Neutral");
  const [importanceScore, setImportanceScore] = useState(50);

  const [isLoadingCompanies, setIsLoadingCompanies] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "info">(
    "info"
  );

  useEffect(() => {
    async function loadCompanies() {
      const token = getAuthToken();

      if (!token) {
        setCompanies([]);
        setIsLoadingCompanies(false);
        return;
      }

      try {
        const data = await apiRequest<Company[]>("/companies", {
          token,
        });

        setCompanies(data);
      } catch {
        setMessage("Unable to load companies. You can still add an unlinked article.");
        setMessageType("info");
      } finally {
        setIsLoadingCompanies(false);
      }
    }

    loadCompanies();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const token = getAuthToken();

    if (!token) {
      setMessage("Please log in again to add articles.");
      setMessageType("error");
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    const payload: ArticleCreateRequest = {
      company_id: companyId ? Number(companyId) : null,
      title,
      url,
      source,
      author: author || null,
      published_at: publishedAt || null,
      summary: summary || null,
      content: content || null,
      sentiment_label: sentimentLabel || null,
      importance_score: importanceScore,
    };

    try {
      const createdArticle = await apiRequest<ArticleItem>("/articles", {
        method: "POST",
        token,
        body: payload,
      });

      setMessage(`Article created successfully. Article ID: ${createdArticle.id}`);
      setMessageType("success");

      setCompanyId("");
      setTitle("");
      setUrl("");
      setSource("");
      setAuthor("");
      setPublishedAt("");
      setSummary("");
      setContent("");
      setSentimentLabel("Neutral");
      setImportanceScore(50);
    } catch {
      setMessage(
        "Could not create article. Check that the URL is valid and not already added."
      );
      setMessageType("error");
    } finally {
      setIsSubmitting(false);
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
                  Manual Ingestion
                </div>

                <h1 className="text-3xl font-bold tracking-tight">
                  Add Article
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                  Manually add a market news article to test the MarketPulse
                  article, signal, and alert workflow.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/news"
                  className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/[0.08] hover:text-white"
                >
                  View News
                </Link>

                <Link
                  href="/"
                  className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-5 py-3 text-sm font-medium text-cyan-300 transition hover:bg-cyan-400/15"
                >
                  Back to Dashboard
                </Link>
              </div>
            </div>

            {message ? (
              <div
                className={`mb-5 rounded-2xl border px-4 py-3 text-sm ${getMessageClass()}`}
              >
                {message}
              </div>
            ) : null}

            <form
              onSubmit={handleSubmit}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
            >
              <div className="grid gap-5 lg:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-300">
                    Company
                  </span>

                  <select
                    suppressHydrationWarning
                    value={companyId}
                    onChange={(event) => setCompanyId(event.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-[#0b0f19] px-4 py-3 text-sm text-slate-300 outline-none focus:border-cyan-400/40"
                  >
                    <option value="">
                      {isLoadingCompanies
                        ? "Loading companies..."
                        : "Unlinked article"}
                    </option>

                    {companies.map((company) => (
                      <option key={company.id} value={company.id}>
                        {company.symbol} — {company.name}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-300">
                    Source
                  </span>

                  <input
                    suppressHydrationWarning
                    autoComplete="off"
                    value={source}
                    onChange={(event) => setSource(event.target.value)}
                    required
                    placeholder="Economic Times, Moneycontrol, Reuters..."
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-400/40"
                  />
                </label>

                <label className="block lg:col-span-2">
                  <span className="mb-2 block text-sm font-medium text-slate-300">
                    Article Title
                  </span>

                  <input
                    suppressHydrationWarning
                    autoComplete="off"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    required
                    placeholder="Enter article headline"
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-400/40"
                  />
                </label>

                <label className="block lg:col-span-2">
                  <span className="mb-2 block text-sm font-medium text-slate-300">
                    Article URL
                  </span>

                  <input
                    suppressHydrationWarning
                    autoComplete="off"
                    type="url"
                    value={url}
                    onChange={(event) => setUrl(event.target.value)}
                    required
                    placeholder="https://example.com/news/article"
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-400/40"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-300">
                    Author
                  </span>

                  <input
                    suppressHydrationWarning
                    autoComplete="off"
                    value={author}
                    onChange={(event) => setAuthor(event.target.value)}
                    placeholder="Optional"
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-400/40"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-300">
                    Published At
                  </span>

                  <input
                    suppressHydrationWarning
                    type="datetime-local"
                    value={publishedAt}
                    onChange={(event) => setPublishedAt(event.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none focus:border-cyan-400/40"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-300">
                    Sentiment Label
                  </span>

                  <select
                    suppressHydrationWarning
                    value={sentimentLabel}
                    onChange={(event) => setSentimentLabel(event.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-[#0b0f19] px-4 py-3 text-sm text-slate-300 outline-none focus:border-cyan-400/40"
                  >
                    <option value="Positive">Positive</option>
                    <option value="Neutral">Neutral</option>
                    <option value="Negative">Negative</option>
                    <option value="Bullish">Bullish</option>
                    <option value="Bearish">Bearish</option>
                  </select>
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-300">
                    Importance Score: {importanceScore}/100
                  </span>

                  <input
                    suppressHydrationWarning
                    type="range"
                    min="0"
                    max="100"
                    value={importanceScore}
                    onChange={(event) =>
                      setImportanceScore(Number(event.target.value))
                    }
                    className="w-full"
                  />
                </label>

                <label className="block lg:col-span-2">
                  <span className="mb-2 block text-sm font-medium text-slate-300">
                    Summary
                  </span>

                  <textarea
                    suppressHydrationWarning
                    value={summary}
                    onChange={(event) => setSummary(event.target.value)}
                    placeholder="Short summary of the article"
                    rows={4}
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-400/40"
                  />
                </label>

                <label className="block lg:col-span-2">
                  <span className="mb-2 block text-sm font-medium text-slate-300">
                    Content
                  </span>

                  <textarea
                    suppressHydrationWarning
                    value={content}
                    onChange={(event) => setContent(event.target.value)}
                    placeholder="Optional full article content or notes"
                    rows={6}
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-400/40"
                  />
                </label>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  suppressHydrationWarning
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-2xl bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-400/20 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? "Creating article..." : "Create Article"}
                </button>
              </div>
            </form>
          </section>
        </div>
      </main>
    </AuthGuard>
  );
}