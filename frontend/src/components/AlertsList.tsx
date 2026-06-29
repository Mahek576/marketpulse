import AlertCard from "@/components/AlertCard";
import type { AlertItem } from "@/lib/types";

type AlertsListProps = {
  alerts: AlertItem[];
  onMarkRead: (alertId: number) => void;
  markingAlertId: number | null;
};

export default function AlertsList({
  alerts,
  onMarkRead,
  markingAlertId,
}: AlertsListProps) {
  if (alerts.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.03] p-8 text-sm leading-6 text-slate-400">
        No alerts yet. Once MarketPulse detects important signals for companies
        in your watchlist, alerts will appear here.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {alerts.map((alert) => (
        <AlertCard
          key={alert.id}
          alert={alert}
          onMarkRead={onMarkRead}
          markingAlertId={markingAlertId}
        />
      ))}
    </div>
  );
}