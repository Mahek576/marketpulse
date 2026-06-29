import DashboardIntelligenceFeed from "@/components/DashboardIntelligenceFeed";
import DashboardMetrics from "@/components/DashboardMetrics";
import DashboardWatchlist from "@/components/DashboardWatchlist";
import RiskRadar from "@/components/RiskRadar";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#070a12] text-white">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.12),transparent_35%),radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.12),transparent_30%)]" />

      <div className="flex min-h-screen">
        <Sidebar />

        <section className="flex-1 px-5 py-6 md:px-8 lg:px-10">
          <TopBar />

          <DashboardMetrics />

          <section className="mt-6 grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
            <DashboardWatchlist />
            <RiskRadar />
          </section>

          <DashboardIntelligenceFeed />
        </section>
      </div>
    </main>
  );
}