import NewsCard from "@/components/NewsCard";
import type { ArticleItem } from "@/lib/types";

type NewsListProps = {
  articles: ArticleItem[];
  onCreateSignal?: (articleId: number) => void;
  creatingSignalArticleId?: number | null;
};

export default function NewsList({
  articles,
  onCreateSignal,
  creatingSignalArticleId,
}: NewsListProps) {
  if (articles.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.03] p-8 text-sm leading-6 text-slate-400">
        No news intelligence items yet. Once articles are ingested and linked to
        your watchlist, MarketPulse will show relevant market-moving news here.
      </div>
    );
  }

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      {articles.map((article) => (
        <NewsCard
          key={article.id}
          article={article}
          onCreateSignal={onCreateSignal}
          creatingSignalArticleId={creatingSignalArticleId}
        />
      ))}
    </div>
  );
}