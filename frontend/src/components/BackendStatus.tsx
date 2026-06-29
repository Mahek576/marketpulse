"use client";

import { useEffect, useState } from "react";
import { Activity } from "lucide-react";
import { getApiBaseUrl } from "@/lib/apiClient";

type BackendStatus = "checking" | "online" | "offline";

export default function BackendStatus() {
  const [status, setStatus] = useState<BackendStatus>("checking");

  useEffect(() => {
    async function checkBackend() {
      try {
        const response = await fetch(`${getApiBaseUrl()}/health`, {
          method: "GET",
        });

        setStatus(response.ok ? "online" : "offline");
      } catch {
        setStatus("offline");
      }
    }

    checkBackend();
  }, []);

  const label =
    status === "checking"
      ? "Checking backend"
      : status === "online"
        ? "Backend online"
        : "Backend offline";

  const dotClass =
    status === "online"
      ? "bg-emerald-300 shadow-emerald-300/50"
      : status === "offline"
        ? "bg-rose-300 shadow-rose-300/50"
        : "bg-amber-300 shadow-amber-300/50";

  return (
    <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-slate-300">
      <Activity size={17} className="text-cyan-300" />
      <span className={`h-2 w-2 rounded-full shadow-lg ${dotClass}`} />
      <span>{label}</span>
    </div>
  );
}