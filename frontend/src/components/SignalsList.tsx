import SignalCard from "@/components/SignalCard";
import type { MarketSignalItem } from "@/lib/types";

type SignalsListProps = {
  signals: MarketSignalItem[];
  onCreateAlert?: (signalId: number) => void;
  creatingAlertSignalId?: number | null;
};

export default function SignalsList({
  signals,
  onCreateAlert,
  creatingAlertSignalId,
}: SignalsListProps) {
  if (signals.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.03] p-8 text-sm leading-6 text-slate-400">
        No market signals yet. Once articles are processed, MarketPulse will
        generate risk, opportunity, and monitoring signals here.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {signals.map((signal) => (
        <SignalCard
          key={signal.id}
          signal={signal}
          onCreateAlert={onCreateAlert}
          creatingAlertSignalId={creatingAlertSignalId}
        />
      ))}
    </div>
  );
}