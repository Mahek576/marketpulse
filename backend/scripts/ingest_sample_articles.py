import json
import sys
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.append(str(BASE_DIR))

from app.db.database import SessionLocal
from app.services.news_ingestion_service import ingest_articles


SAMPLE_ARTICLES_FILE = BASE_DIR / "sample_data" / "articles.json"


def main():
    if not SAMPLE_ARTICLES_FILE.exists():
        raise FileNotFoundError(
            f"Sample articles file not found: {SAMPLE_ARTICLES_FILE}"
        )

    with SAMPLE_ARTICLES_FILE.open("r", encoding="utf-8") as file:
        articles = json.load(file)

    db = SessionLocal()

    try:
        result = ingest_articles(db=db, articles=articles)

        print("\nArticle ingestion completed successfully.")
        print(f"Created: {result['created']}")
        print(f"Skipped: {result['skipped']}")
        print(f"Missing company: {result['missing_company']}")

    except Exception:
        db.rollback()
        print("\nArticle ingestion failed. Database rolled back.")
        raise

    finally:
        db.close()


if __name__ == "__main__":
    main()