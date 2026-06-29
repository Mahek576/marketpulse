import type { ArticleItem } from "@/lib/types";

type NewsCardProps = {
  article: ArticleItem;
  onCreateSignal?: (articleId: number) => void;
  creatingSignalArticleId?: number | null;
};

function getSentimentStyle(sentiment: string | null) {
  const normalizedSentiment = sentiment?.toLowerCase() || "";

  if (
    normalizedSentiment.includes("positive") ||
    normalizedSentiment.includes("bullish")
  ) {
    return "border-emerald-400/20 bg-emerald-400/10 text-emerald-300";
  }

  if (
    normalizedSentiment.includes("negative") ||
    normalizedSentiment.includes("bearish")
  ) {
    return "border-rose-400/20 bg-rose-400/10 text-rose-300";
  }

  return "border-cyan-400/20 bg-cyan-400/10 text-cyan-300";
}

export default function NewsCard({
  article,
  onCreateSignal,
  creatingSignalArticleId,
}: NewsCardProps) {
  return (
    <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-cyan-400/20 hover:bg-white/[0.05]">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div
          className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${getSentimentStyle(
            article.sentiment_label
          )}`}
        >
          {article.sentiment_label || "Neutral"}
        </div>

        <div className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-slate-400">
          Importance {article.importance_score}/100
        </div>

        {article.is_processed ? (
          <div className="inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-300">
            Processed
          </div>
        ) : (
          <div className="inline-flex rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-xs text-amber-300">
            Pending
          </div>
        )}
      </div>

      <h3 className="text-lg font-semibold leading-7 text-white">
        {article.title}
      </h3>

      <p className="mt-3 text-sm leading-6 text-slate-400">
        {article.summary ||
          "No summary available yet. Once MarketPulse processes this article, a concise intelligence summary will appear here."}
      </p>

      <div className="mt-5 flex flex-col justify-between gap-3 border-t border-white/10 pt-4 text-xs text-slate-500 md:flex-row md:items-center">
        <div>
          {article.source}
          {article.author ? ` · ${article.author}` : ""}
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          {onCreateSignal ? (
            <button
              suppressHydrationWarning
              onClick={() => onCreateSignal(article.id)}
              disabled={creatingSignalArticleId === article.id}
              className="w-fit rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-xs font-medium text-emerald-300 transition hover:bg-emerald-400/15 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {creatingSignalArticleId === article.id
                ? "Creating signal..."
                : "Create Signal"}
            </button>
          ) : null}

          <a
            href={article.url}
            target="_blank"
            rel="noreferrer"
            className="w-fit rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs font-medium text-cyan-300 transition hover:bg-cyan-400/15"
          >
            Open source
          </a>
        </div>
      </div>
    </article>
  );
}