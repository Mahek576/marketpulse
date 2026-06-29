import type { NewsItem } from "@/lib/types";

type IntelligenceFeedProps = {
  news: NewsItem[];
};

export default function IntelligenceFeed({ news }: IntelligenceFeedProps) {
  return (
    <section className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      <div className="mb-5">
        <h2 className="text-xl font-semibold">Latest Intelligence Feed</h2>
        <p className="mt-1 text-sm text-slate-400">
          Market-moving news converted into actionable signals.
        </p>
      </div>

      {news.length === 0 ? (
        <div className="rounded-xl border border-dashed border-white/10 bg-[#0b0f19] p-6 text-sm text-slate-400">
          No intelligence feed items yet. Once articles are ingested and
          processed, MarketPulse will surface the most important signals here.
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-3">
          {news.map((item) => (
            <div
              key={item.title}
              className="rounded-xl border border-white/10 bg-[#0b0f19] p-5"
            >
              <div className="mb-4 inline-flex rounded-full border border-cyan-400/20 px-3 py-1 text-xs text-cyan-300">
                {item.tag}
              </div>
              <h3 className="text-base font-semibold leading-6">
                {item.title}
              </h3>
              <p className="mt-4 text-sm text-slate-500">{item.source}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}