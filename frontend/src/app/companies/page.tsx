"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import AuthGuard from "@/components/AuthGuard";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import { apiRequest } from "@/lib/apiClient";
import { getAuthToken } from "@/lib/auth";
import type { Company, WatchlistItem } from "@/lib/types";

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [watchlistCompanyIds, setWatchlistCompanyIds] = useState<number[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "info">(
    "info"
  );

  const [addingCompanyId, setAddingCompanyId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSector, setSelectedSector] = useState("All");

  useEffect(() => {
    async function loadCompaniesPageData() {
      const token = getAuthToken();

      if (!token) {
        setCompanies([]);
        setWatchlistCompanyIds([]);
        setIsLoading(false);
        return;
      }

      try {
        const [companiesData, watchlistData] = await Promise.all([
          apiRequest<Company[]>("/companies", {
            token,
          }),
          apiRequest<WatchlistItem[]>("/dashboard/watchlist", {
            token,
          }),
        ]);

        setCompanies(companiesData);

        const ids = watchlistData
          .map((item) => item.company_id)
          .filter((id): id is number => typeof id === "number");

        setWatchlistCompanyIds(ids);
      } catch {
        setMessage("Unable to load companies right now.");
        setMessageType("error");
      } finally {
        setIsLoading(false);
      }
    }

    loadCompaniesPageData();
  }, []);

  const sectors = useMemo(() => {
    const uniqueSectors = Array.from(
      new Set(
        companies
          .map((company) => company.sector)
          .filter((sector): sector is string => Boolean(sector))
      )
    );

    return ["All", ...uniqueSectors];
  }, [companies]);

  const filteredCompanies = useMemo(() => {
    const normalizedQuery = searchQuery.toLowerCase().trim();

    return companies.filter((company) => {
      const matchesSearch =
        company.symbol.toLowerCase().includes(normalizedQuery) ||
        company.name.toLowerCase().includes(normalizedQuery) ||
        company.exchange.toLowerCase().includes(normalizedQuery) ||
        company.sector?.toLowerCase().includes(normalizedQuery) ||
        company.industry?.toLowerCase().includes(normalizedQuery);

      const matchesSector =
        selectedSector === "All" || company.sector === selectedSector;

      return matchesSearch && matchesSector;
    });
  }, [companies, searchQuery, selectedSector]);

  const activeCompaniesCount = useMemo(
    () => companies.filter((company) => company.is_active).length,
    [companies]
  );

  async function handleAddToWatchlist(companyId: number) {
    const token = getAuthToken();

    if (!token) {
      setMessage("Please log in again to update your watchlist.");
      setMessageType("error");
      return;
    }

    if (watchlistCompanyIds.includes(companyId)) {
      setMessage("This company is already in your watchlist.");
      setMessageType("info");
      return;
    }

    setAddingCompanyId(companyId);
    setMessage("");

    try {
      await apiRequest(`/watchlist/${companyId}`, {
        method: "POST",
        token,
      });

      setWatchlistCompanyIds((currentIds) => [...currentIds, companyId]);
      setMessage("Company added to your watchlist.");
      setMessageType("success");
    } catch {
      setMessage("Could not add company. It may already be in your watchlist.");
      setMessageType("error");
    } finally {
      setAddingCompanyId(null);
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
                  Company Universe
                </div>

                <h1 className="text-3xl font-bold tracking-tight">
                  Companies
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                  Browse tracked companies, filter by sector, and add companies
                  to your personal MarketPulse watchlist.
                </p>
              </div>

              <Link
                href="/"
                className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/[0.08] hover:text-white"
              >
                Back to Dashboard
              </Link>
            </div>

            <section className="mb-6 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <div className="text-sm text-slate-400">Total Companies</div>
                <div className="mt-3 text-3xl font-bold">
                  {companies.length}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <div className="text-sm text-slate-400">Active Companies</div>
                <div className="mt-3 text-3xl font-bold">
                  {activeCompaniesCount}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <div className="text-sm text-slate-400">In Your Watchlist</div>
                <div className="mt-3 text-3xl font-bold">
                  {watchlistCompanyIds.length}
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

            <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <div className="mb-5 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
                <div>
                  <h2 className="text-xl font-semibold">Available Companies</h2>
                  <p className="mt-1 text-sm text-slate-400">
                    Add companies here to personalize your dashboard watchlist.
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <input
                    suppressHydrationWarning
                    autoComplete="off"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Search symbol, company, sector..."
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-400/40 sm:w-80"
                  />

                  <select
                    suppressHydrationWarning
                    value={selectedSector}
                    onChange={(event) => setSelectedSector(event.target.value)}
                    className="rounded-2xl border border-white/10 bg-[#0b0f19] px-4 py-3 text-sm text-slate-300 outline-none focus:border-cyan-400/40"
                  >
                    {sectors.map((sector) => (
                      <option key={sector} value={sector}>
                        {sector}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {isLoading ? (
                <div className="rounded-xl border border-white/10 bg-[#0b0f19] p-6 text-sm text-slate-400">
                  Loading companies...
                </div>
              ) : companies.length === 0 ? (
                <div className="rounded-xl border border-dashed border-white/10 bg-[#0b0f19] p-6 text-sm leading-6 text-slate-400">
                  No companies found yet. Add companies through the backend API
                  first, then they will appear here.
                </div>
              ) : filteredCompanies.length === 0 ? (
                <div className="rounded-xl border border-dashed border-white/10 bg-[#0b0f19] p-6 text-sm leading-6 text-slate-400">
                  No companies match your current search or sector filter.
                </div>
              ) : (
                <div className="overflow-hidden rounded-xl border border-white/10">
                  <div className="grid grid-cols-5 bg-white/[0.04] px-4 py-3 text-xs font-medium uppercase tracking-wide text-slate-400">
                    <div>Symbol</div>
                    <div>Company</div>
                    <div>Exchange</div>
                    <div>Sector</div>
                    <div>Action</div>
                  </div>

                  {filteredCompanies.map((company) => {
                    const alreadyAdded = watchlistCompanyIds.includes(
                      company.id
                    );

                    return (
                      <div
                        key={company.id}
                        className="grid grid-cols-5 items-center border-t border-white/10 px-4 py-4 text-sm"
                      >
                        <div className="font-semibold text-white">
                          {company.symbol}
                        </div>

                        <div className="text-slate-300">{company.name}</div>

                        <div className="text-slate-400">
                          {company.exchange}
                        </div>

                        <div className="text-slate-400">
                          {company.sector || "Not specified"}
                        </div>

                        <button
                          suppressHydrationWarning
                          onClick={() => handleAddToWatchlist(company.id)}
                          disabled={
                            addingCompanyId === company.id || alreadyAdded
                          }
                          className={`w-fit rounded-xl px-4 py-2 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${
                            alreadyAdded
                              ? "border border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                              : "bg-cyan-400 text-slate-950 hover:bg-cyan-300"
                          }`}
                        >
                          {alreadyAdded
                            ? "Added"
                            : addingCompanyId === company.id
                              ? "Adding..."
                              : "Add to Watchlist"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </section>
        </div>
      </main>
    </AuthGuard>
  );
}