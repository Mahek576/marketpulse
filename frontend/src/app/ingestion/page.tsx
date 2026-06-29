"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import AuthGuard from "@/components/AuthGuard";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import { apiRequest } from "@/lib/apiClient";
import { getAuthToken } from "@/lib/auth";
import type {
  Company,
  IngestionJob,
  NewsIngestionResponse,
} from "@/lib/types";

export default function IngestionPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [jobs, setJobs] = useState<IngestionJob[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const [pageSize, setPageSize] = useState(5);

  const [previewResult, setPreviewResult] =
    useState<NewsIngestionResponse | null>(null);
  const [ingestionResult, setIngestionResult] =
    useState<NewsIngestionResponse | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [isIngesting, setIsIngesting] = useState(false);
  const [isStartingSampleJob, setIsStartingSampleJob] = useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "info">(
    "info"
  );

  const latestJob = useMemo(() => jobs[0] || null, [jobs]);

  async function loadPageData() {
    const token = getAuthToken();

    if (!token) {
      setCompanies([]);
      setJobs([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    try {
      const [companiesData, jobsData] = await Promise.all([
        apiRequest<Company[]>("/companies", {
          token,
        }),
        apiRequest<IngestionJob[]>("/jobs", {
          token,
        }),
      ]);

      setCompanies(companiesData);
      setJobs(jobsData);

      if (!selectedCompanyId && companiesData.length > 0) {
        setSelectedCompanyId(String(companiesData[0].id));
      }
    } catch {
      setMessage("Unable to load ingestion workspace data.");
      setMessageType("error");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadPageData();
  }, []);

  async function handlePreviewNews() {
    const token = getAuthToken();

    if (!token || !selectedCompanyId) {
      setMessage("Select a company before previewing news.");
      setMessageType("error");
      return;
    }

    setIsPreviewing(true);
    setMessage("");
    setPreviewResult(null);

    try {
      const result = await apiRequest<NewsIngestionResponse>(
        `/ingestion/news/company/${selectedCompanyId}?page_size=${pageSize}&dry_run=true`,
        {
          method: "POST",
          token,
        }
      );

      setPreviewResult(result);
      setMessage(`Preview fetched ${result.fetched} article(s).`);
      setMessageType("success");
    } catch {
      setMessage(
        "Could not preview live news. Check your NewsAPI key/backend config."
      );
      setMessageType("error");
    } finally {
      setIsPreviewing(false);
    }
  }

  async function handleIngestNews() {
    const token = getAuthToken();

    if (!token || !selectedCompanyId) {
      setMessage("Select a company before ingesting news.");
      setMessageType("error");
      return;
    }

    setIsIngesting(true);
    setMessage("");
    setIngestionResult(null);

    try {
      const result = await apiRequest<NewsIngestionResponse>(
        `/ingestion/news/company/${selectedCompanyId}?page_size=${pageSize}&dry_run=false`,
        {
          method: "POST",
          token,
        }
      );

      setIngestionResult(result);
      setMessage(
        `Ingestion complete. Created ${result.created}, skipped ${result.skipped}.`
      );
      setMessageType("success");
    } catch {
      setMessage(
        "Could not ingest live news. Check your NewsAPI key/backend config."
      );
      setMessageType("error");
    } finally {
      setIsIngesting(false);
    }
  }

  async function handleStartSampleJob() {
    const token = getAuthToken();

    if (!token) {
      setMessage("Please log in again to start ingestion jobs.");
      setMessageType("error");
      return;
    }

    setIsStartingSampleJob(true);
    setMessage("");

    try {
      const job = await apiRequest<IngestionJob>("/jobs/ingest-sample-articles", {
        method: "POST",
        token,
      });

      setMessage(`Sample ingestion job started. Job ID: ${job.id}`);
      setMessageType("success");

      await loadPageData();
    } catch {
      setMessage("Could not start sample ingestion job.");
      setMessageType("error");
    } finally {
      setIsStartingSampleJob(false);
    }
  }

  async function handleRefreshJobs() {
    await loadPageData();
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
                  Ingestion Control
                </div>

                <h1 className="text-3xl font-bold tracking-tight">
                  News Ingestion
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                  Bring external market news into MarketPulse, preview live
                  company news, ingest articles, and track ingestion jobs.
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
                  href="/articles/new"
                  className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-5 py-3 text-sm font-medium text-cyan-300 transition hover:bg-cyan-400/15"
                >
                  Add Manual Article
                </Link>
              </div>
            </div>

            <section className="mb-6 grid gap-4 md:grid-cols-4">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <div className="text-sm text-slate-400">Companies</div>
                <div className="mt-3 text-3xl font-bold">
                  {companies.length}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <div className="text-sm text-slate-400">Jobs</div>
                <div className="mt-3 text-3xl font-bold">{jobs.length}</div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <div className="text-sm text-slate-400">Latest Job</div>
                <div className="mt-3 text-xl font-bold">
                  {latestJob ? latestJob.status : "None"}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <div className="text-sm text-slate-400">Mode</div>
                <div className="mt-3 text-xl font-bold">Manual + API</div>
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
                Loading ingestion workspace...
              </div>
            ) : (
              <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
                <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                  <h2 className="text-xl font-semibold">Company NewsAPI</h2>
                  <p className="mt-1 text-sm leading-6 text-slate-400">
                    Preview company news first, then run actual ingestion to
                    create article records.
                  </p>

                  <div className="mt-5 space-y-4">
                    <label className="block">
                      <span className="mb-2 block text-sm font-medium text-slate-300">
                        Company
                      </span>

                      <select
                        suppressHydrationWarning
                        value={selectedCompanyId}
                        onChange={(event) =>
                          setSelectedCompanyId(event.target.value)
                        }
                        className="w-full rounded-2xl border border-white/10 bg-[#0b0f19] px-4 py-3 text-sm text-slate-300 outline-none focus:border-cyan-400/40"
                      >
                        {companies.length === 0 ? (
                          <option value="">No companies available</option>
                        ) : null}

                        {companies.map((company) => (
                          <option key={company.id} value={company.id}>
                            {company.symbol} — {company.name}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label className="block">
                      <span className="mb-2 block text-sm font-medium text-slate-300">
                        Page size: {pageSize}
                      </span>

                      <input
                        suppressHydrationWarning
                        type="range"
                        min="1"
                        max="20"
                        value={pageSize}
                        onChange={(event) =>
                          setPageSize(Number(event.target.value))
                        }
                        className="w-full"
                      />
                    </label>

                    <div className="flex flex-col gap-3 sm:flex-row">
                      <button
                        suppressHydrationWarning
                        onClick={handlePreviewNews}
                        disabled={isPreviewing || companies.length === 0}
                        className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-5 py-3 text-sm font-medium text-cyan-300 transition hover:bg-cyan-400/15 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isPreviewing ? "Previewing..." : "Preview News"}
                      </button>

                      <button
                        suppressHydrationWarning
                        onClick={handleIngestNews}
                        disabled={isIngesting || companies.length === 0}
                        className="rounded-2xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isIngesting ? "Ingesting..." : "Ingest News"}
                      </button>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-[#0b0f19] p-4 text-sm leading-6 text-slate-400">
                      Live NewsAPI ingestion requires a valid backend API key.
                      If not configured, preview/ingest will show a clean error.
                    </div>
                  </div>
                </section>

                <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                  <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                    <div>
                      <h2 className="text-xl font-semibold">Sample Jobs</h2>
                      <p className="mt-1 text-sm leading-6 text-slate-400">
                        Start sample ingestion and refresh job history.
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <button
                        suppressHydrationWarning
                        onClick={handleStartSampleJob}
                        disabled={isStartingSampleJob}
                        className="rounded-2xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isStartingSampleJob
                          ? "Starting..."
                          : "Run Sample Job"}
                      </button>

                      <button
                        suppressHydrationWarning
                        onClick={handleRefreshJobs}
                        className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/[0.08] hover:text-white"
                      >
                        Refresh
                      </button>
                    </div>
                  </div>

                  <div className="mt-5 space-y-3">
                    {jobs.length === 0 ? (
                      <div className="rounded-xl border border-dashed border-white/10 bg-[#0b0f19] p-5 text-sm text-slate-400">
                        No ingestion jobs yet.
                      </div>
                    ) : (
                      jobs.map((job) => (
                        <div
                          key={job.id}
                          className="rounded-xl border border-white/10 bg-[#0b0f19] p-4"
                        >
                          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                            <div>
                              <div className="font-semibold text-white">
                                Job #{job.id} · {job.job_type}
                              </div>
                              <div className="mt-1 text-xs text-slate-500">
                                Source: {job.source || "N/A"}
                              </div>
                            </div>

                            <div className="w-fit rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-300">
                              {job.status}
                            </div>
                          </div>

                          <div className="mt-4 grid gap-3 text-sm text-slate-400 md:grid-cols-4">
                            <div>Total: {job.total_records}</div>
                            <div>Created: {job.created_count}</div>
                            <div>Skipped: {job.skipped_count}</div>
                            <div>Missing: {job.missing_company_count}</div>
                          </div>

                          {job.error_message ? (
                            <div className="mt-3 rounded-xl border border-rose-400/20 bg-rose-400/10 p-3 text-xs text-rose-300">
                              {job.error_message}
                            </div>
                          ) : null}
                        </div>
                      ))
                    )}
                  </div>
                </section>
              </div>
            )}

            <section className="mt-6 grid gap-6 lg:grid-cols-2">
              <ResultPanel title="Preview Result" result={previewResult} />
              <ResultPanel title="Ingestion Result" result={ingestionResult} />
            </section>
          </section>
        </div>
      </main>
    </AuthGuard>
  );
}

function ResultPanel({
  title,
  result,
}: {
  title: string;
  result: NewsIngestionResponse | null;
}) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      <h2 className="text-xl font-semibold">{title}</h2>

      {!result ? (
        <div className="mt-5 rounded-xl border border-dashed border-white/10 bg-[#0b0f19] p-5 text-sm text-slate-400">
          No result yet.
        </div>
      ) : (
        <div className="mt-5 space-y-4">
          <div className="grid gap-3 text-sm text-slate-300 md:grid-cols-4">
            <div>Fetched: {result.fetched}</div>
            <div>Created: {result.created}</div>
            <div>Skipped: {result.skipped}</div>
            <div>{result.dry_run ? "Dry run" : "Ingested"}</div>
          </div>

          <div className="rounded-xl border border-white/10 bg-[#0b0f19] p-4 text-sm text-slate-400">
            Query: {result.query}
          </div>

          <div className="space-y-3">
            {result.articles.map((article) => (
              <div
                key={article.url}
                className="rounded-xl border border-white/10 bg-[#0b0f19] p-4"
              >
                <div className="text-sm font-semibold text-white">
                  {article.title}
                </div>
                <div className="mt-2 text-xs text-slate-500">
                  {article.source}
                  {article.published_at
                    ? ` · ${new Date(article.published_at).toLocaleString()}`
                    : ""}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}