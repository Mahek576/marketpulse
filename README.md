# MarketPulse

MarketPulse is a backend system I built to explore how market data can be structured into something actually useful. Instead of jumping between news sites, company updates, and scattered sources, this project focuses on bringing everything into one place and turning raw information into signals and alerts.

It’s built using FastAPI with a production-style setup — authentication, PostgreSQL, Redis, Docker, background jobs, and automated testing — to reflect how a real backend service would be designed.

---

## Project Status

Backend MVP is complete.

Current capabilities:

* User authentication (JWT-based)
* Company tracking
* Personal watchlists
* Article ingestion (sample + API-ready)
* Signal generation from articles
* User-specific alerts
* Personalized feed
* PostgreSQL database with migrations
* Redis-ready caching layer
* Docker setup
* Automated tests with CI

---

## Problem Statement

Market information is fragmented. News, company updates, and policy changes are spread across multiple platforms, making it hard to track what actually matters.

This project is an attempt to solve that by:

1. Letting users track companies they care about
2. Collecting relevant articles
3. Converting those into structured signals
4. Generating alerts based on user interest
5. Providing a single feed with everything that matters

---

## Key Features

### Authentication

* Register and login
* JWT-based auth
* Protected routes
* Current user endpoint

### Company Tracking

* Create company records
* List companies
* View company details
* Seed sample companies from JSON

### Watchlist System

* Add companies to personal watchlist
* View personal watchlist
* Remove companies from watchlist
* Duplicate watchlist protection

### Article Ingestion

* Store news/articles linked to companies
* Ingest sample articles from JSON
* Prepare integration for real external news APIs
* Duplicate article detection by URL

### Market Signal Generation

* Generate signals from articles
* Detect basic risk/opportunity/monitoring signals
* Use sentiment, importance score, and keywords
* Store generated signals in PostgreSQL

### Alert System

* Generate alerts from market signals
* Alerts are user-specific
* Alerts depend on watchlisted companies
* Mark alerts as read
* View unread alerts

### Personalized Feed

* Combined dashboard API
* Watchlist companies
* Latest articles
* Latest signals
* Latest alerts
* Unread alert count

### Background Job Tracking

* Start ingestion jobs
* Track job status
* Store created/skipped/missing-company counts
* Prepare foundation for future scheduled jobs

### Redis Cache Layer

* Optional Redis integration
* Cache health endpoint
* Company list caching
* Safe fallback if Redis is unavailable

### Docker Support

* Dockerized FastAPI backend
* Dockerized PostgreSQL
* Dockerized Redis
* Docker Compose orchestration
* Alembic migrations run inside container startup

### Testing and CI

* Pytest-based backend tests
* Tests for health, auth, companies, and watchlist flows
* GitHub Actions workflow for automated backend testing

---

## Tech Stack

| Layer            | Technology             |
| ---------------- | ---------------------- |
| Backend          | FastAPI                |
| Language         | Python 3.11            |
| Database         | PostgreSQL             |
| ORM              | SQLAlchemy             |
| Migrations       | Alembic                |
| Cache            | Redis                  |
| Auth             | JWT                    |
| Password Hashing | Argon2 via pwdlib      |
| Validation       | Pydantic               |
| HTTP Client      | HTTPX                  |
| Testing          | Pytest                 |
| Containerization | Docker, Docker Compose |
| CI               | GitHub Actions         |

---

## Project Structure

```text
marketpulse/
├── backend/
│   ├── alembic/
│   ├── app/
│   │   ├── api/
│   │   ├── cache/
│   │   ├── db/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── config.py
│   │   └── main.py
│   ├── sample_data/
│   ├── scripts/
│   ├── tests/
│   ├── Dockerfile
│   ├── requirements.txt
│   └── .env.example
├── docs/
│   └── API.md
├── .github/
│   └── workflows/
│       └── backend-tests.yml
├── docker-compose.yml
├── README.md
└── .gitignore
```

---

## API Modules

### Health

```http
GET /
GET /health
GET /health/db
GET /health/cache
```

### Auth

```http
POST /auth/register
POST /auth/login
GET /auth/me
```

### Companies

```http
POST /companies
GET /companies
GET /companies/{company_id}
```

### Watchlist

```http
POST /watchlist/{company_id}
GET /watchlist
DELETE /watchlist/{company_id}
```

### Articles

```http
POST /articles
GET /articles
GET /articles/{article_id}
```

### Signals

```http
POST /signals/from-article/{article_id}
GET /signals
GET /signals/{signal_id}
```

### Alerts

```http
POST /alerts/from-signal/{signal_id}
GET /alerts
PATCH /alerts/{alert_id}/read
```

### Feed

```http
GET /feed
```

### Ingestion

```http
POST /ingestion/news/company/{company_id}
```

### Jobs

```http
POST /jobs/ingest-sample-articles
GET /jobs
GET /jobs/{job_id}
```

---

## Local Development Setup

Go to the backend folder:

```powershell
cd C:\PROJECTS\marketpulse\backend
```

Create and activate virtual environment:

```powershell
python -m venv venv
venv\Scripts\activate
```

Install dependencies:

```powershell
pip install -r requirements.txt
```

Create `.env` from `.env.example` and update values if needed.

Run Alembic migrations:

```powershell
alembic upgrade head
```

Run the backend:

```powershell
uvicorn app.main:app --reload
```

Open Swagger documentation:

```text
http://127.0.0.1:8000/docs
```

---

## Docker Setup

From the project root:

```powershell
cd C:\PROJECTS\marketpulse
docker compose up --build
```

This starts:

* FastAPI backend
* PostgreSQL database
* Redis cache

Open:

```text
http://127.0.0.1:8000/docs
```

Stop containers:

```powershell
docker compose down
```

Stop containers and delete Docker volumes:

```powershell
docker compose down -v
```

---

## Seed Sample Companies

Run locally:

```powershell
cd C:\PROJECTS\marketpulse\backend
python scripts\seed_companies.py
```

Run inside Docker:

```powershell
cd C:\PROJECTS\marketpulse
docker compose exec api python scripts/seed_companies.py
```

The seed script is idempotent. Existing companies are skipped based on their stock symbol.

---

## Ingest Sample Articles

Run locally:

```powershell
cd C:\PROJECTS\marketpulse\backend
python scripts\ingest_sample_articles.py
```

This loads sample company-related articles into the database.

---

## Run Tests

From the backend folder:

```powershell
cd C:\PROJECTS\marketpulse\backend
pytest -q
```

Expected output:

```text
4 passed
```

---

## GitHub Actions CI

The project includes a GitHub Actions workflow:

```text
.github/workflows/backend-tests.yml
```

It automatically runs backend tests on:

* Push to `main`
* Pull request to `main`

---

## Environment Variables

Example backend environment variables:

```env
APP_NAME=MarketPulse API
APP_VERSION=0.1.0
ENVIRONMENT=development
DEBUG=true

DATABASE_URL=postgresql+psycopg://marketpulse:marketpulse@localhost:5432/marketpulse

SECRET_KEY=change-this-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

NEWS_API_KEY=your-news-api-key
NEWS_API_BASE_URL=https://newsapi.org/v2/everything
NEWS_API_DEFAULT_LANGUAGE=en
NEWS_API_DEFAULT_SORT_BY=publishedAt

ENABLE_CACHE=true
REDIS_URL=redis://localhost:6379/0
CACHE_TTL_SECONDS=300
```

Do not commit the real `.env` file.

---

## How It Works

```text
Company → Watchlist → Articles → Signals → Alerts → Feed
```

Example:

```text
PAYTM is added to watchlist
↓
Article about regulatory attention is ingested
↓
Risk signal is generated
↓
Alert is created for the user
↓
Alert appears in personalized feed
```

---

## Roadmap

Planned future upgrades:

* Real NewsAPI key integration
* Scheduled news ingestion
* Redis/Celery worker system
* AI-generated article summaries
* Advanced sentiment analysis
* Company-level risk scoring
* Frontend dashboard
* Deployment to cloud platform
* Role-based admin APIs
* Pagination and filtering improvements
* Observability and structured logging

---

## Resume Summary

Built a production-grade market intelligence backend using FastAPI, PostgreSQL, Redis, SQLAlchemy, Alembic, Docker, JWT authentication, and Pytest. Implemented company tracking, personalized watchlists, article ingestion, rule-based market signal generation, alerting, background job tracking, and a personalized intelligence feed with automated CI testing.

---

## License

This project is currently for educational and portfolio use.
