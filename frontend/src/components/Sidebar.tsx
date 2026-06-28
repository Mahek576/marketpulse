const navItems = [
  "Dashboard",
  "Watchlist",
  "News Intelligence",
  "Alerts",
  "Companies",
  "Settings",
];

export default function Sidebar() {
  return (
    <aside className="hidden w-72 border-r border-white/10 bg-[#0b0f19] px-6 py-8 lg:block">
      <div className="mb-10">
        <div className="text-2xl font-bold tracking-tight">MarketPulse</div>
        <div className="mt-2 text-sm text-slate-400">
          AI-powered market intelligence
        </div>
      </div>

      <nav className="space-y-2 text-sm">
        {navItems.map((item, index) => (
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
  );
}