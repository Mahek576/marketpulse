from sqlalchemy.orm import Session

from app.models.article import Article
from app.schemas.article_schema import ArticleCreate


def get_article_by_id(db: Session, article_id: int) -> Article | None:
    return db.query(Article).filter(Article.id == article_id).first()


def get_article_by_url(db: Session, url: str) -> Article | None:
    return db.query(Article).filter(Article.url == str(url)).first()


def get_articles(
    db: Session,
    company_id: int | None = None,
    skip: int = 0,
    limit: int = 50,
) -> list[Article]:
    query = db.query(Article)

    if company_id is not None:
        query = query.filter(Article.company_id == company_id)

    return (
        query.order_by(
            Article.published_at.desc().nullslast(),
            Article.created_at.desc(),
        )
        .offset(skip)
        .limit(limit)
        .all()
    )


def create_article(db: Session, article_data: ArticleCreate) -> Article:
    article = Article(
        company_id=article_data.company_id,
        title=article_data.title.strip(),
        url=str(article_data.url),
        source=article_data.source.strip(),
        author=article_data.author.strip() if article_data.author else None,
        published_at=article_data.published_at,
        summary=article_data.summary.strip() if article_data.summary else None,
        content=article_data.content.strip() if article_data.content else None,
        sentiment_label=(
            article_data.sentiment_label.strip().lower()
            if article_data.sentiment_label
            else None
        ),
        importance_score=article_data.importance_score,
    )

    db.add(article)
    db.commit()
    db.refresh(article)

    return article