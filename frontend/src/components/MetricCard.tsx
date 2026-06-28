type MetricCardProps = {
  title: string;
  value: string;
  change: string;
};

export default function MetricCard({ title, value, change }: MetricCardProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 shadow-2xl shadow-black/20">
      <div className="text-sm text-slate-400">{title}</div>
      <div className="mt-3 text-3xl font-bold">{value}</div>
      <div className="mt-2 text-sm text-cyan-300">{change}</div>
    </div>
  );
}