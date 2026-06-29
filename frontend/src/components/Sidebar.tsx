"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
    href: "/",
    icon: LayoutDashboard,
  },
  {
    label: "Watchlist",
    href: "/",
    icon: Star,
  },
  {
  label: "News Intelligence",
  href: "/news",
  icon: Newspaper,
  },
  {
  label: "Alerts",
  href: "/alerts",
  icon: Bell,
  },
  {
    label: "Companies",
    href: "/companies",
    icon: Building2,
  },
  {
    label: "Settings",
    href: "/",
    icon: Settings,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

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
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 transition ${
                isActive
                  ? "bg-cyan-400/10 text-cyan-300"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </Link>
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