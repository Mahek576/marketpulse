import { Bell, Search, ShieldCheck, UserCircle } from "lucide-react";

export default function TopBar() {
  return (
    <div className="mb-6 flex flex-col gap-4 border-b border-white/10 pb-5 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <ShieldCheck size={16} className="text-cyan-300" />
          <span>MarketPulse Intelligence Engine</span>
        </div>

        <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
          Command Center
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
          Monitor market-moving news, company sentiment, risk alerts, and
          watchlist signals from one AI-powered dashboard.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-slate-400">
          <Search size={17} />
          <input
            className="w-56 bg-transparent outline-none placeholder:text-slate-500"
            placeholder="Search company or news..."
          />
        </div>

        <button className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-slate-300 transition hover:bg-white/[0.08] hover:text-white">
          <Bell size={18} />
        </button>

        <button className="flex items-center gap-2 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 text-sm font-medium text-cyan-300 transition hover:bg-cyan-400/15">
          <UserCircle size={18} />
          Analyst
        </button>
      </div>
    </div>
  );
}