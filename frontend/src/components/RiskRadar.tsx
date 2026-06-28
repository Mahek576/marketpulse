const riskSignals = [
  {
    title: "High Volatility",
    description: "IT sector showing negative sentiment acceleration.",
    style: "border-rose-400/20 bg-rose-400/10 text-rose-300",
  },
  {
    title: "Earnings Watch",
    description: "Banking names may react to upcoming quarterly updates.",
    style: "border-amber-400/20 bg-amber-400/10 text-amber-300",
  },
  {
    title: "Positive Momentum",
    description: "Energy and infrastructure news flow remains strong.",
    style: "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
  },
];

export default function RiskRadar() {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      <h2 className="text-xl font-semibold">Risk Radar</h2>
      <p className="mt-1 text-sm text-slate-400">
        Priority signals detected by MarketPulse.
      </p>

      <div className="mt-6 space-y-4">
        {riskSignals.map((signal) => (
          <div
            key={signal.title}
            className={`rounded-xl border p-4 ${signal.style}`}
          >
            <div className="text-sm font-semibold">{signal.title}</div>
            <div className="mt-2 text-sm text-slate-300">
              {signal.description}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}