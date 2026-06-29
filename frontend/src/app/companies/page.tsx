"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import AuthGuard from "@/components/AuthGuard";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import { apiRequest } from "@/lib/apiClient";
import { getAuthToken } from "@/lib/auth";
import type { Company } from "@/lib/types";

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [addingCompanyId, setAddingCompanyId] = useState<number | null>(null);

  useEffect(() => {
    async function loadCompanies() {
      const token = getAuthToken();

      if (!token) {
        setCompanies([]);
        setIsLoading(false);
        return;
      }

      try {
        const data = await apiRequest<Company[]>("/companies", {
          token,
        });

        setCompanies(data);
      } catch {
        setMessage("Unable to load companies right now.");
      } finally {
        setIsLoading(false);
      }
    }

    loadCompanies();
  }, []);

  async function handleAddToWatchlist(companyId: number) {
    const token = getAuthToken();

    if (!token) {
      setMessage("Please log in again to update your watchlist.");
      return;
    }

    setAddingCompanyId(companyId);
    setMessage("");

    try {
      await apiRequest(`/watchlist/${companyId}`, {
        method: "POST",
        token,
      });

      setMessage("Company added to your watchlist.");
    } catch {
      setMessage("Could not add company. It may already be in your watchlist.");
    } finally {
      setAddingCompanyId(null);
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
                  Company Universe
                </div>

                <h1 className="text-3xl font-bold tracking-tight">
                  Companies
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                  Browse tracked companies and add them to your personal
                  MarketPulse watchlist.
                </p>
              </div>

              <Link
                href="/"
                className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/[0.08] hover:text-white"
              >
                Back to Dashboard
              </Link>
            </div>

            {message ? (
              <div className="mb-5 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 text-sm text-cyan-200">
                {message}
              </div>
            ) : null}

            <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">Available Companies</h2>
                  <p className="mt-1 text-sm text-slate-400">
                    Add companies here to personalize your dashboard watchlist.
                  </p>
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
              ) : (
                <div className="overflow-hidden rounded-xl border border-white/10">
                  <div className="grid grid-cols-5 bg-white/[0.04] px-4 py-3 text-xs font-medium uppercase tracking-wide text-slate-400">
                    <div>Symbol</div>
                    <div>Company</div>
                    <div>Exchange</div>
                    <div>Sector</div>
                    <div>Action</div>
                  </div>

                  {companies.map((company) => (
                    <div
                      key={company.id}
                      className="grid grid-cols-5 items-center border-t border-white/10 px-4 py-4 text-sm"
                    >
                      <div className="font-semibold text-white">
                        {company.symbol}
                      </div>

                      <div className="text-slate-300">{company.name}</div>

                      <div className="text-slate-400">{company.exchange}</div>

                      <div className="text-slate-400">
                        {company.sector || "Not specified"}
                      </div>

                      <button
                        suppressHydrationWarning
                        onClick={() => handleAddToWatchlist(company.id)}
                        disabled={addingCompanyId === company.id}
                        className="w-fit rounded-xl bg-cyan-400 px-4 py-2 text-xs font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {addingCompanyId === company.id
                          ? "Adding..."
                          : "Add to Watchlist"}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </section>
        </div>
      </main>
    </AuthGuard>
  );
}