import type { MetricCardData } from "@/lib/types";

export default function MetricCard({ title, value, change }: MetricCardData) {
  return (
    <div className="group rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.07] to-white/[0.025] p-5 shadow-2xl shadow-black/20 transition hover:-translate-y-0.5 hover:border-cyan-400/30 hover:bg-white/[0.06]">
      <div className="flex items-center justify-between">
        <div className="text-sm text-slate-400">{title}</div>
        <div className="h-2 w-2 rounded-full bg-cyan-300 shadow-lg shadow-cyan-300/50" />
      </div>

      <div className="mt-4 text-3xl font-bold tracking-tight">{value}</div>

      <div className="mt-3 inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-300">
        {change}
      </div>
    </div>
  );
}