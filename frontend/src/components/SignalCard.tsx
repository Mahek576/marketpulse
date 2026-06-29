import type { MarketSignalItem } from "@/lib/types";

type SignalCardProps = {
  signal: MarketSignalItem;
  onCreateAlert?: (signalId: number) => void;
  creatingAlertSignalId?: number | null;
};

function getSeverityStyle(severity: string) {
  const normalizedSeverity = severity.toLowerCase();

  if (
    normalizedSeverity.includes("high") ||
    normalizedSeverity.includes("critical") ||
    normalizedSeverity.includes("risk")
  ) {
    return "border-rose-400/20 bg-rose-400/10 text-rose-300";
  }

  if (
    normalizedSeverity.includes("positive") ||
    normalizedSeverity.includes("opportunity") ||
    normalizedSeverity.includes("bullish")
  ) {
    return "border-emerald-400/20 bg-emerald-400/10 text-emerald-300";
  }

  return "border-amber-400/20 bg-amber-400/10 text-amber-300";
}

export default function SignalCard({
  signal,
  onCreateAlert,
  creatingAlertSignalId,
}: SignalCardProps) {
  return (
    <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-cyan-400/20 hover:bg-white/[0.05]">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div
          className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${getSeverityStyle(
            signal.severity
          )}`}
        >
          {signal.severity}
        </div>

        <div className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-slate-400">
          Score {signal.score}/100
        </div>

        <div
          className={`inline-flex rounded-full border px-3 py-1 text-xs ${
            signal.is_active
              ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
              : "border-white/10 bg-white/[0.04] text-slate-400"
          }`}
        >
          {signal.is_active ? "Active" : "Inactive"}
        </div>
      </div>

      <h3 className="text-lg font-semibold leading-7 text-white">
        {signal.title}
      </h3>

      {signal.description ? (
        <p className="mt-3 text-sm leading-6 text-slate-400">
          {signal.description}
        </p>
      ) : null}

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-[#0b0f19] p-4">
          <div className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">
            Reason
          </div>
          <p className="text-sm leading-6 text-slate-300">{signal.reason}</p>
        </div>

        <div className="rounded-xl border border-white/10 bg-[#0b0f19] p-4">
          <div className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">
            Why it matters
          </div>
          <p className="text-sm leading-6 text-slate-300">
            {signal.why_it_matters}
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-col justify-between gap-3 border-t border-white/10 pt-4 text-xs text-slate-500 md:flex-row md:items-center">
        <div>
          Type: {signal.signal_type} · Created:{" "}
          {new Date(signal.created_at).toLocaleString()}
        </div>

        {onCreateAlert ? (
          <button
            suppressHydrationWarning
            onClick={() => onCreateAlert(signal.id)}
            disabled={
              creatingAlertSignalId === signal.id ||
              !signal.is_active ||
              signal.company_id === null
            }
            className="w-fit rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs font-medium text-cyan-300 transition hover:bg-cyan-400/15 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {creatingAlertSignalId === signal.id
              ? "Creating alert..."
              : "Create Alert"}
          </button>
        ) : null}
      </div>
    </article>
  );
}