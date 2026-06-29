import type { WatchlistItem } from "@/lib/types";

type WatchlistTableProps = {
  watchlist: WatchlistItem[];
};

function getSentimentColor(sentiment: WatchlistItem["sentiment"]) {
  if (sentiment === "Bullish") {
    return "text-emerald-300";
  }

  if (sentiment === "Bearish") {
    return "text-rose-300";
  }

  return "text-slate-300";
}

export default function WatchlistTable({ watchlist }: WatchlistTableProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      <div className="mb-5">
        <h2 className="text-xl font-semibold">Company Watchlist</h2>
        <p className="mt-1 text-sm text-slate-400">
          AI-ranked companies based on news impact and sentiment.
        </p>
      </div>

      {watchlist.length === 0 ? (
        <div className="rounded-xl border border-dashed border-white/10 bg-[#0b0f19] p-6 text-sm leading-6 text-slate-400">
          No companies available yet. Once companies are added or users start
          building watchlists, MarketPulse will show tracked companies here.
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-white/10">
          <div className="grid grid-cols-4 bg-white/[0.04] px-4 py-3 text-xs font-medium uppercase tracking-wide text-slate-400">
            <div>Symbol</div>
            <div>Company</div>
            <div>Sentiment</div>
            <div>Impact</div>
          </div>

          {watchlist.map((item) => (
            <div
              key={item.symbol}
              className="grid grid-cols-4 border-t border-white/10 px-4 py-4 text-sm"
            >
              <div className="font-semibold text-white">{item.symbol}</div>
              <div className="text-slate-300">{item.name}</div>
              <div className={getSentimentColor(item.sentiment)}>
                {item.sentiment}
              </div>
              <div className="text-cyan-300">{item.impact}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}