import IntelligenceFeed from "@/components/IntelligenceFeed";
import MetricCard from "@/components/MetricCard";
import RiskRadar from "@/components/RiskRadar";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
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
    <main className="min-h-screen bg-[#070a12] text-white">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.12),transparent_35%),radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.12),transparent_30%)]" />

      <div className="flex min-h-screen">
        <Sidebar />

        <section className="flex-1 px-5 py-6 md:px-8 lg:px-10">
          <TopBar />

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