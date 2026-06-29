import type { AlertItem } from "@/lib/types";

type AlertCardProps = {
  alert: AlertItem;
  onMarkRead: (alertId: number) => void;
  markingAlertId: number | null;
};

function getSeverityStyle(severity: string) {
  const normalizedSeverity = severity.toLowerCase();

  if (normalizedSeverity.includes("high") || normalizedSeverity.includes("critical")) {
    return "border-rose-400/20 bg-rose-400/10 text-rose-300";
  }

  if (normalizedSeverity.includes("medium")) {
    return "border-amber-400/20 bg-amber-400/10 text-amber-300";
  }

  return "border-cyan-400/20 bg-cyan-400/10 text-cyan-300";
}

export default function AlertCard({
  alert,
  onMarkRead,
  markingAlertId,
}: AlertCardProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <div className="mb-4 flex flex-col justify-between gap-3 md:flex-row md:items-start">
        <div>
          <div
            className={`mb-3 inline-flex rounded-full border px-3 py-1 text-xs font-medium ${getSeverityStyle(
              alert.severity
            )}`}
          >
            {alert.severity}
          </div>

          <h3 className="text-lg font-semibold text-white">{alert.title}</h3>

          <p className="mt-2 text-sm leading-6 text-slate-400">
            {alert.message}
          </p>
        </div>

        <div
          className={`w-fit rounded-full border px-3 py-1 text-xs ${
            alert.is_read
              ? "border-white/10 bg-white/[0.04] text-slate-400"
              : "border-cyan-400/20 bg-cyan-400/10 text-cyan-300"
          }`}
        >
          {alert.is_read ? "Read" : "Unread"}
        </div>
      </div>

      <div className="flex flex-col justify-between gap-3 border-t border-white/10 pt-4 text-xs text-slate-500 md:flex-row md:items-center">
        <div>
          Type: {alert.alert_type} · Created:{" "}
          {new Date(alert.created_at).toLocaleString()}
        </div>

        {!alert.is_read ? (
          <button
            suppressHydrationWarning
            onClick={() => onMarkRead(alert.id)}
            disabled={markingAlertId === alert.id}
            className="w-fit rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs font-medium text-cyan-300 transition hover:bg-cyan-400/15 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {markingAlertId === alert.id ? "Marking..." : "Mark as read"}
          </button>
        ) : null}
      </div>
    </div>
  );
}