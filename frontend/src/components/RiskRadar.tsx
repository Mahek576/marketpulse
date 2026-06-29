import type { RiskSignal } from "@/lib/types";

type RiskRadarProps = {
  signals: RiskSignal[];
};

function getSignalStyle(severity: RiskSignal["severity"]) {
  if (severity === "high") {
    return "border-rose-400/20 bg-rose-400/10 text-rose-300";
  }

  if (severity === "medium") {
    return "border-amber-400/20 bg-amber-400/10 text-amber-300";
  }

  return "border-emerald-400/20 bg-emerald-400/10 text-emerald-300";
}

export default function RiskRadar({ signals }: RiskRadarProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      <h2 className="text-xl font-semibold">Risk Radar</h2>
      <p className="mt-1 text-sm text-slate-400">
        Priority signals detected by MarketPulse.
      </p>

      {signals.length === 0 ? (
        <div className="mt-6 rounded-xl border border-dashed border-white/10 bg-[#0b0f19] p-5 text-sm leading-6 text-slate-400">
          No active market risk signals yet. Once MarketPulse generates signals
          from articles, the highest-priority risks and opportunities will appear
          here.
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {signals.map((signal) => (
            <div
              key={signal.title}
              className={`rounded-xl border p-4 ${getSignalStyle(
                signal.severity
              )}`}
            >
              <div className="text-sm font-semibold">{signal.title}</div>
              <div className="mt-2 text-sm text-slate-300">
                {signal.description}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}