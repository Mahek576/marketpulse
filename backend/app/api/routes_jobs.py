from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_user
from app.db.database import get_db
from app.models.user import User
from app.schemas.job_schema import IngestionJobResponse
from app.services.job_service import (
    create_ingestion_job,
    get_job_by_id,
    get_user_jobs,
    run_sample_article_ingestion_job,
)


router = APIRouter(
    prefix="/jobs",
    tags=["Jobs"],
)


@router.post(
    "/ingest-sample-articles",
    response_model=IngestionJobResponse,
    status_code=status.HTTP_202_ACCEPTED,
)
def start_sample_article_ingestion_job(
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    job = create_ingestion_job(
        db=db,
        user_id=current_user.id,
        job_type="sample_article_ingestion",
        source="sample_data/articles.json",
    )

    background_tasks.add_task(
        run_sample_article_ingestion_job,
        job.id,
    )

    return job


@router.get(
    "",
    response_model=list[IngestionJobResponse],
)
def list_my_jobs(
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=50, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_user_jobs(
        db=db,
        user_id=current_user.id,
        skip=skip,
        limit=limit,
    )


@router.get(
    "/{job_id}",
    response_model=IngestionJobResponse,
)
def get_my_job(
    job_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    job = get_job_by_id(
        db=db,
        job_id=job_id,
    )

    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found",
        )

    if job.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have access to this job",
        )

    return job