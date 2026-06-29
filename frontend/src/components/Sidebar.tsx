import {
  Activity,
  Bell,
  Building2,
  LayoutDashboard,
  Newspaper,
  Settings,
  Sparkles,
  Star,
} from "lucide-react";

const navItems = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    active: true,
  },
  {
    label: "Watchlist",
    icon: Star,
    active: false,
  },
  {
    label: "News Intelligence",
    icon: Newspaper,
    active: false,
  },
  {
    label: "Alerts",
    icon: Bell,
    active: false,
  },
  {
    label: "Companies",
    icon: Building2,
    active: false,
  },
  {
    label: "Settings",
    icon: Settings,
    active: false,
  },
];

export default function Sidebar() {
  return (
    <aside className="hidden w-72 border-r border-white/10 bg-[#0b0f19] px-5 py-6 lg:flex lg:flex-col">
      <div className="mb-8 flex items-center gap-3 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-400 text-slate-950">
          <Activity size={22} />
        </div>

        <div>
          <div className="text-xl font-bold tracking-tight">MarketPulse</div>
          <div className="text-xs text-slate-400">AI market intelligence</div>
        </div>
      </div>

      <nav className="space-y-2 text-sm">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 transition ${
                item.active
                  ? "bg-cyan-400/10 text-cyan-300"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </div>
          );
        })}
      </nav>

      <div className="mt-auto rounded-2xl border border-white/10 bg-white/[0.03] p-4">
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
          <Sparkles size={17} className="text-cyan-300" />
          AI Signal Layer
        </div>

        <p className="text-xs leading-5 text-slate-400">
          News, sentiment, and company movement signals are converted into
          actionable market intelligence.
        </p>
      </div>
    </aside>
  );
}