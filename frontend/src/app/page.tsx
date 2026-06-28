const marketCards = [
  {
    title: "Tracked Companies",
    value: "24",
    change: "+6 this week",
  },
  {
    title: "Market Alerts",
    value: "12",
    change: "4 high priority",
  },
  {
    title: "News Signals",
    value: "186",
    change: "Last 24 hours",
  },
  {
    title: "Avg Sentiment",
    value: "Bullish",
    change: "+18% momentum",
  },
];

const watchlist = [
  {
    symbol: "RELIANCE",
    name: "Reliance Industries",
    sentiment: "Bullish",
    impact: "High",
  },
  {
    symbol: "TCS",
    name: "Tata Consultancy Services",
    sentiment: "Neutral",
    impact: "Medium",
  },
  {
    symbol: "INFY",
    name: "Infosys",
    sentiment: "Bearish",
    impact: "Medium",
  },
  {
    symbol: "HDFCBANK",
    name: "HDFC Bank",
    sentiment: "Bullish",
    impact: "High",
  },
];

const news = [
  {
    title: "Reliance gains attention after energy expansion update",
    source: "MarketPulse Intelligence",
    tag: "Positive",
  },
  {
    title: "IT sector sentiment weakens amid global demand concerns",
    source: "AI News Monitor",
    tag: "Caution",
  },
  {
    title: "Banking stocks remain active as rate outlook stabilizes",
    source: "Financial Signals",
    tag: "Neutral",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#080b12] text-white">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 border-r border-white/10 bg-[#0b0f19] px-6 py-8 lg:block">
          <div className="mb-10">
            <div className="text-2xl font-bold tracking-tight">MarketPulse</div>
            <div className="mt-2 text-sm text-slate-400">
              AI-powered market intelligence
            </div>
          </div>

          <nav className="space-y-2 text-sm">
            {[
              "Dashboard",
              "Watchlist",
              "News Intelligence",
              "Alerts",
              "Companies",
              "Settings",
            ].map((item, index) => (
              <div
                key={item}
                className={`rounded-xl px-4 py-3 ${
                  index === 0
                    ? "bg-cyan-400/10 text-cyan-300"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                {item}
              </div>
            ))}
          </nav>
        </aside>

        <section className="flex-1 px-5 py-6 md:px-8 lg:px-10">
          <header className="mb-8 flex flex-col justify-between gap-5 border-b border-white/10 pb-6 md:flex-row md:items-center">
            <div>
              <div className="mb-2 inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-300">
                Live Market Intelligence Dashboard
              </div>

              <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                MarketPulse Command Center
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
                Track companies, monitor financial news, detect sentiment shifts,
                and surface market-moving signals from one intelligent dashboard.
              </p>
            </div>

            <button className="rounded-xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-400/20 transition hover:bg-cyan-300">
              Add Company
            </button>
          </header>

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {marketCards.map((card) => (
              <div
                key={card.title}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 shadow-2xl shadow-black/20"
              >
                <div className="text-sm text-slate-400">{card.title}</div>
                <div className="mt-3 text-3xl font-bold">{card.value}</div>
                <div className="mt-2 text-sm text-cyan-300">{card.change}</div>
              </div>
            ))}
          </section>

          <section className="mt-6 grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <div className="mb-5">
                <h2 className="text-xl font-semibold">Company Watchlist</h2>
                <p className="mt-1 text-sm text-slate-400">
                  AI-ranked companies based on news impact and sentiment.
                </p>
              </div>

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
                    <div
                      className={
                        item.sentiment === "Bullish"
                          ? "text-emerald-300"
                          : item.sentiment === "Bearish"
                            ? "text-rose-300"
                            : "text-slate-300"
                      }
                    >
                      {item.sentiment}
                    </div>
                    <div className="text-cyan-300">{item.impact}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <h2 className="text-xl font-semibold">Risk Radar</h2>
              <p className="mt-1 text-sm text-slate-400">
                Priority signals detected by MarketPulse.
              </p>

              <div className="mt-6 space-y-4">
                <div className="rounded-xl border border-rose-400/20 bg-rose-400/10 p-4">
                  <div className="text-sm font-semibold text-rose-300">
                    High Volatility
                  </div>
                  <div className="mt-2 text-sm text-slate-300">
                    IT sector showing negative sentiment acceleration.
                  </div>
                </div>

                <div className="rounded-xl border border-amber-400/20 bg-amber-400/10 p-4">
                  <div className="text-sm font-semibold text-amber-300">
                    Earnings Watch
                  </div>
                  <div className="mt-2 text-sm text-slate-300">
                    Banking names may react to upcoming quarterly updates.
                  </div>
                </div>

                <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-4">
                  <div className="text-sm font-semibold text-emerald-300">
                    Positive Momentum
                  </div>
                  <div className="mt-2 text-sm text-slate-300">
                    Energy and infrastructure news flow remains strong.
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <div className="mb-5">
              <h2 className="text-xl font-semibold">Latest Intelligence Feed</h2>
              <p className="mt-1 text-sm text-slate-400">
                Market-moving news converted into actionable signals.
              </p>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              {news.map((item) => (
                <div
                  key={item.title}
                  className="rounded-xl border border-white/10 bg-[#0b0f19] p-5"
                >
                  <div className="mb-4 inline-flex rounded-full border border-cyan-400/20 px-3 py-1 text-xs text-cyan-300">
                    {item.tag}
                  </div>
                  <h3 className="text-base font-semibold leading-6">
                    {item.title}
                  </h3>
                  <p className="mt-4 text-sm text-slate-500">{item.source}</p>
                </div>
              ))}
            </div>
          </section>
        </section>
      </div>
    </main>
  );
}