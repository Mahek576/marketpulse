import IntelligenceFeed from "@/components/IntelligenceFeed";
import MetricCard from "@/components/MetricCard";
import RiskRadar from "@/components/RiskRadar";
import Sidebar from "@/components/Sidebar";
import WatchlistTable from "@/components/WatchlistTable";

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
        <Sidebar />

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
              <MetricCard
                key={card.title}
                title={card.title}
                value={card.value}
                change={card.change}
              />
            ))}
          </section>

          <section className="mt-6 grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
            <WatchlistTable watchlist={watchlist} />
            <RiskRadar />
          </section>

          <IntelligenceFeed news={news} />
        </section>
      </div>
    </main>
  );
}