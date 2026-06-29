"use client";

import { useEffect, useState } from "react";
import RiskRadar from "@/components/RiskRadar";
import { apiRequest } from "@/lib/apiClient";
import { riskSignals as fallbackRiskSignals } from "@/lib/mockData";
import type { RiskSignal } from "@/lib/types";

export default function DashboardRiskRadar() {
  const [signals, setSignals] = useState<RiskSignal[]>(fallbackRiskSignals);

  useEffect(() => {
    async function loadRiskRadar() {
      try {
        const data = await apiRequest<RiskSignal[]>("/dashboard/risk-radar");
        setSignals(data);
      } catch {
        setSignals(fallbackRiskSignals);
      }
    }

    loadRiskRadar();
  }, []);

  return <RiskRadar signals={signals} />;
}