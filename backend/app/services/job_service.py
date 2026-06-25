import json
from datetime import datetime
from pathlib import Path

from sqlalchemy.orm import Session

from app.db.database import SessionLocal
from app.models.ingestion_job import IngestionJob
from app.services.news_ingestion_service import ingest_articles


BASE_DIR = Path(__file__).resolve().parents[2]
SAMPLE_ARTICLES_FILE = BASE_DIR / "sample_data" / "articles.json"


def create_ingestion_job(
    db: Session,
    user_id: int,
    job_type: str,
    source: str | None = None,
) -> IngestionJob:
    job = IngestionJob(
        user_id=user_id,
        job_type=job_type,
        source=source,
        status="queued",
    )

    db.add(job)
    db.commit()
    db.refresh(job)

    return job


def get_job_by_id(
    db: Session,
    job_id: int,
) -> IngestionJob | None:
    return db.query(IngestionJob).filter(IngestionJob.id == job_id).first()


def get_user_jobs(
    db: Session,
    user_id: int,
    skip: int = 0,
    limit: int = 50,
) -> list[IngestionJob]:
    return (
        db.query(IngestionJob)
        .filter(IngestionJob.user_id == user_id)
        .order_by(IngestionJob.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )


def run_sample_article_ingestion_job(job_id: int) -> None:
    db = SessionLocal()

    try:
        job = get_job_by_id(db=db, job_id=job_id)

        if not job:
            return

        job.status = "running"
        job.started_at = datetime.utcnow()
        db.commit()

        if not SAMPLE_ARTICLES_FILE.exists():
            raise FileNotFoundError(
                f"Sample articles file not found: {SAMPLE_ARTICLES_FILE}"
            )

        with SAMPLE_ARTICLES_FILE.open("r", encoding="utf-8") as file:
            articles = json.load(file)

        result = ingest_articles(
            db=db,
            articles=articles,
        )

        job.total_records = len(articles)
        job.created_count = result["created"]
        job.skipped_count = result["skipped"]
        job.missing_company_count = result["missing_company"]
        job.status = "completed"
        job.finished_at = datetime.utcnow()

        db.commit()

    except Exception as exc:
        db.rollback()

        job = get_job_by_id(db=db, job_id=job_id)

        if job:
            job.status = "failed"
            job.error_message = str(exc)
            job.finished_at = datetime.utcnow()
            db.commit()

    finally:
        db.close()