# MarketPulse API Documentation

This document describes the current backend API for MarketPulse.

MarketPulse is a FastAPI-based market intelligence backend that supports authentication, company tracking, personalized watchlists, article ingestion, market signal generation, user alerts, background ingestion jobs, and a personalized intelligence feed.

---

## Base URLs

Local development:

```text
http://127.0.0.1:8000
```

Swagger UI:

```text
http://127.0.0.1:8000/docs
```

ReDoc:

```text
http://127.0.0.1:8000/redoc
```

---

## Authentication

Most endpoints are protected using JWT authentication.

Login returns an access token:

```json
{
  "access_token": "jwt-token",
  "token_type": "bearer"
}
```

For protected requests, send:

```http
Authorization: Bearer <access_token>
```

In Swagger UI:

1. Run `POST /auth/login`
2. Copy only the token value
3. Click **Authorize**
4. Paste only the token, without writing `Bearer`
5. Execute protected APIs

---

## Standard Error Format

Custom error responses follow this structure:

```json
{
  "success": false,
  "error": {
    "type": "http_error",
    "message": "Error message",
    "path": "/endpoint-path"
  }
}
```

Validation errors follow this structure:

```json
{
  "success": false,
  "error": {
    "type": "validation_error",
    "message": "Invalid request data",
    "path": "/endpoint-path",
    "details": []
  }
}
```

---

# 1. Health APIs

Health APIs are used to verify service, database, and cache availability.

---

## GET /

Checks whether the backend is running.

### Response

```json
{
  "message": "MarketPulse backend is running",
  "environment": "development",
  "version": "0.1.0"
}
```

---

## GET /health

Checks general API health.

### Response

```json
{
  "status": "healthy",
  "service": "marketpulse-api",
  "environment": "development",
  "version": "0.1.0"
}
```

---

## GET /health/db

Checks database connectivity.

### Response

```json
{
  "status": "healthy",
  "database": "connected"
}
```

---

## GET /health/cache

Checks Redis cache connectivity.

### Response when Redis is connected

```json
{
  "status": "healthy",
  "cache": "connected"
}
```

### Response when Redis is unavailable

```json
{
  "status": "disabled_or_unavailable",
  "cache": "not_connected"
}
```

---

# 2. Auth APIs

Auth APIs manage registration, login, and current user identity.

---

## POST /auth/register

Registers a new user.

### Request

```json
{
  "email": "test@example.com",
  "full_name": "Test User",
  "password": "test1234"
}
```

### Response

```json
{
  "id": 1,
  "email": "test@example.com",
  "full_name": "Test User",
  "is_active": true,
  "created_at": "2026-06-27T10:00:00"
}
```

### Duplicate Email Error

```json
{
  "success": false,
  "error": {
    "type": "http_error",
    "message": "Email is already registered",
    "path": "/auth/register"
  }
}
```

---

## POST /auth/login

Logs in a user and returns a JWT access token.

### Request

```json
{
  "email": "test@example.com",
  "password": "test1234"
}
```

### Response

```json
{
  "access_token": "jwt-token",
  "token_type": "bearer"
}
```

### Invalid Login Error

```json
{
  "success": false,
  "error": {
    "type": "http_error",
    "message": "Invalid email or password",
    "path": "/auth/login"
  }
}
```

---

## GET /auth/me

Returns the currently logged-in user.

### Authentication

Required.

### Response

```json
{
  "id": 1,
  "email": "test@example.com",
  "full_name": "Test User",
  "is_active": true,
  "created_at": "2026-06-27T10:00:00"
}
```

---

# 3. Company APIs

Company APIs manage companies tracked by the platform.

---

## POST /companies

Creates a company.

### Authentication

Required.

### Request

```json
{
  "symbol": "PAYTM",
  "name": "One97 Communications",
  "exchange": "NSE",
  "sector": "Fintech",
  "industry": "Digital Payments",
  "country": "India"
}
```

### Response

```json
{
  "id": 1,
  "symbol": "PAYTM",
  "name": "One97 Communications",
  "exchange": "NSE",
  "sector": "Fintech",
  "industry": "Digital Payments",
  "country": "India",
  "is_active": true,
  "created_at": "2026-06-27T10:00:00"
}
```

### Duplicate Company Error

```json
{
  "success": false,
  "error": {
    "type": "http_error",
    "message": "Company with this symbol already exists",
    "path": "/companies"
  }
}
```

---

## GET /companies

Returns active companies.

### Authentication

Required.

### Query Parameters

| Parameter | Type    | Default | Description               |
| --------- | ------- | ------- | ------------------------- |
| skip      | integer | 0       | Number of records to skip |
| limit     | integer | 50      | Maximum records to return |

### Response

```json
[
  {
    "id": 1,
    "symbol": "PAYTM",
    "name": "One97 Communications",
    "exchange": "NSE",
    "sector": "Fintech",
    "industry": "Digital Payments",
    "country": "India",
    "is_active": true,
    "created_at": "2026-06-27T10:00:00"
  }
]
```

---

## GET /companies/{company_id}

Returns one company by ID.

### Authentication

Required.

### Response

```json
{
  "id": 1,
  "symbol": "PAYTM",
  "name": "One97 Communications",
  "exchange": "NSE",
  "sector": "Fintech",
  "industry": "Digital Payments",
  "country": "India",
  "is_active": true,
  "created_at": "2026-06-27T10:00:00"
}
```

---

# 4. Watchlist APIs

Watchlist APIs allow each user to track companies personally.

---

## POST /watchlist/{company_id}

Adds a company to the current user's watchlist.

### Authentication

Required.

### Response

```json
{
  "id": 1,
  "symbol": "PAYTM",
  "name": "One97 Communications",
  "exchange": "NSE",
  "sector": "Fintech",
  "industry": "Digital Payments",
  "country": "India",
  "is_active": true,
  "created_at": "2026-06-27T10:00:00"
}
```

### Duplicate Watchlist Error

```json
{
  "success": false,
  "error": {
    "type": "http_error",
    "message": "Company already exists in your watchlist",
    "path": "/watchlist/1"
  }
}
```

---

## GET /watchlist

Returns the current user's watchlist.

### Authentication

Required.

### Response

```json
[
  {
    "id": 1,
    "symbol": "PAYTM",
    "name": "One97 Communications",
    "exchange": "NSE",
    "sector": "Fintech",
    "industry": "Digital Payments",
    "country": "India",
    "is_active": true,
    "created_at": "2026-06-27T10:00:00"
  }
]
```

---

## DELETE /watchlist/{company_id}

Removes a company from the current user's watchlist.

### Authentication

Required.

### Response

```json
{
  "message": "Company removed from watchlist",
  "company_id": 1
}
```

---

# 5. Article APIs

Article APIs store and retrieve news or market updates linked to companies.

---

## POST /articles

Creates an article.

### Authentication

Required.

### Request

```json
{
  "company_id": 1,
  "title": "Sample regulatory update for Paytm",
  "url": "https://example.com/paytm-sample-regulatory-update",
  "source": "Example News",
  "author": "MarketPulse Demo",
  "published_at": "2026-06-25T10:00:00",
  "summary": "This is a sample article used for testing MarketPulse article ingestion.",
  "content": "This sample content represents a market update linked to Paytm.",
  "sentiment_label": "neutral",
  "importance_score": 60
}
```

### Response

```json
{
  "id": 1,
  "company_id": 1,
  "title": "Sample regulatory update for Paytm",
  "url": "https://example.com/paytm-sample-regulatory-update",
  "source": "Example News",
  "author": "MarketPulse Demo",
  "published_at": "2026-06-25T10:00:00",
  "summary": "This is a sample article used for testing MarketPulse article ingestion.",
  "content": "This sample content represents a market update linked to Paytm.",
  "sentiment_label": "neutral",
  "importance_score": 60,
  "is_processed": false,
  "created_at": "2026-06-27T10:00:00"
}
```

---

## GET /articles

Returns articles.

### Authentication

Required.

### Query Parameters

| Parameter  | Type    | Default | Description                |
| ---------- | ------- | ------- | -------------------------- |
| company_id | integer | null    | Filter articles by company |
| skip       | integer | 0       | Number of records to skip  |
| limit      | integer | 50      | Maximum records to return  |

---

## GET /articles/{article_id}

Returns one article by ID.

### Authentication

Required.

---

# 6. Signal APIs

Signal APIs generate and retrieve market signals based on articles.

---

## POST /signals/from-article/{article_id}

Generates a market signal from an article.

### Authentication

Required.

### Response

```json
{
  "id": 1,
  "company_id": 1,
  "article_id": 1,
  "signal_type": "risk",
  "severity": "high",
  "score": 90,
  "title": "Risk signal: Paytm faces renewed regulatory attention in digital payments",
  "description": "Paytm is facing renewed attention around compliance and digital payment operations.",
  "reason": "Article sentiment is negative. Risk-related keywords detected: regulatory, compliance.",
  "why_it_matters": "This may indicate higher business, compliance, operational, or investor risk for the company.",
  "is_active": true,
  "created_at": "2026-06-27T10:00:00"
}
```

### Duplicate Signal Error

```json
{
  "success": false,
  "error": {
    "type": "http_error",
    "message": "Signal already exists for this article",
    "path": "/signals/from-article/1"
  }
}
```

---

## GET /signals

Returns market signals.

### Authentication

Required.

### Query Parameters

| Parameter  | Type    | Default | Description               |
| ---------- | ------- | ------- | ------------------------- |
| company_id | integer | null    | Filter signals by company |
| skip       | integer | 0       | Number of records to skip |
| limit      | integer | 50      | Maximum records to return |

---

## GET /signals/{signal_id}

Returns one market signal by ID.

### Authentication

Required.

---

# 7. Alert APIs

Alert APIs generate and manage user-specific alerts.

---

## POST /alerts/from-signal/{signal_id}

Creates an alert from a signal for the current user.

The user must have the signal's company in their watchlist.

### Authentication

Required.

### Response

```json
{
  "id": 1,
  "user_id": 1,
  "company_id": 1,
  "signal_id": 1,
  "alert_type": "risk",
  "severity": "high",
  "title": "High Risk Alert",
  "message": "Risk signal: Paytm faces renewed regulatory attention. Reason: Article sentiment is negative. Why it matters: This may indicate higher business, compliance, operational, or investor risk for the company.",
  "is_read": false,
  "created_at": "2026-06-27T10:00:00"
}
```

### Company Not In Watchlist Error

```json
{
  "success": false,
  "error": {
    "type": "http_error",
    "message": "Company is not in your watchlist",
    "path": "/alerts/from-signal/1"
  }
}
```

---

## GET /alerts

Returns current user's alerts.

### Authentication

Required.

### Query Parameters

| Parameter   | Type    | Default | Description               |
| ----------- | ------- | ------- | ------------------------- |
| unread_only | boolean | false   | Return only unread alerts |
| skip        | integer | 0       | Number of records to skip |
| limit       | integer | 50      | Maximum records to return |

---

## PATCH /alerts/{alert_id}/read

Marks an alert as read.

### Authentication

Required.

### Response

```json
{
  "id": 1,
  "user_id": 1,
  "company_id": 1,
  "signal_id": 1,
  "alert_type": "risk",
  "severity": "high",
  "title": "High Risk Alert",
  "message": "Risk signal message",
  "is_read": true,
  "created_at": "2026-06-27T10:00:00"
}
```

---

# 8. Feed API

The feed API combines watchlist, articles, signals, and alerts into one personalized dashboard response.

---

## GET /feed

Returns the logged-in user's personalized intelligence feed.

### Authentication

Required.

### Query Parameters

| Parameter | Type    | Default | Description                      |
| --------- | ------- | ------- | -------------------------------- |
| limit     | integer | 10      | Maximum records per feed section |

### Response

```json
{
  "user_id": 1,
  "watchlist_count": 1,
  "unread_alert_count": 1,
  "latest_articles_count": 1,
  "latest_signals_count": 1,
  "latest_alerts_count": 1,
  "watchlist_companies": [],
  "latest_articles": [],
  "latest_signals": [],
  "latest_alerts": []
}
```

---

# 9. Ingestion APIs

Ingestion APIs prepare the system for external news API integration.

---

## POST /ingestion/news/company/{company_id}

Fetches news for a company using the configured external news API.

### Authentication

Required.

### Query Parameters

| Parameter | Type    | Default | Description                     |
| --------- | ------- | ------- | ------------------------------- |
| page_size | integer | 5       | Number of articles to fetch     |
| dry_run   | boolean | true    | Preview articles without saving |

### Missing API Key Error

```json
{
  "success": false,
  "error": {
    "type": "http_error",
    "message": "NEWS_API_KEY is missing. Add your NewsAPI key to the .env file.",
    "path": "/ingestion/news/company/1"
  }
}
```

### Dry Run Response

```json
{
  "company_id": 1,
  "company_symbol": "PAYTM",
  "query": "\"One97 Communications\" OR PAYTM",
  "dry_run": true,
  "fetched": 5,
  "created": 0,
  "skipped": 0,
  "articles": [
    {
      "title": "Example article title",
      "url": "https://example.com/article",
      "source": "Example News",
      "published_at": "2026-06-27T10:00:00"
    }
  ]
}
```

---

# 10. Job APIs

Job APIs track background ingestion jobs.

---

## POST /jobs/ingest-sample-articles

Starts a background job that ingests sample articles.

### Authentication

Required.

### Response

```json
{
  "id": 1,
  "user_id": 1,
  "job_type": "sample_article_ingestion",
  "status": "queued",
  "source": "sample_data/articles.json",
  "total_records": 0,
  "created_count": 0,
  "skipped_count": 0,
  "missing_company_count": 0,
  "error_message": null,
  "started_at": null,
  "finished_at": null,
  "created_at": "2026-06-27T10:00:00"
}
```

---

## GET /jobs

Returns the current user's ingestion jobs.

### Authentication

Required.

### Query Parameters

| Parameter | Type    | Default | Description               |
| --------- | ------- | ------- | ------------------------- |
| skip      | integer | 0       | Number of records to skip |
| limit     | integer | 50      | Maximum records to return |

---

## GET /jobs/{job_id}

Returns one job by ID.

### Authentication

Required.

---

# Recommended Demo Flow

Use this sequence to demonstrate the backend:

1. Register user

```http
POST /auth/register
```

2. Login and authorize

```http
POST /auth/login
```

3. Seed sample companies

```powershell
python scripts\seed_companies.py
```

4. View companies

```http
GET /companies
```

5. Add a company to watchlist

```http
POST /watchlist/1
```

6. Ingest sample articles

```powershell
python scripts\ingest_sample_articles.py
```

7. View articles

```http
GET /articles
```

8. Generate signal from article

```http
POST /signals/from-article/1
```

9. Generate alert from signal

```http
POST /alerts/from-signal/1
```

10. View personalized feed

```http
GET /feed
```

---

# Docker Demo Flow

Start Docker services:

```powershell
docker compose up --build
```

Seed companies inside Docker:

```powershell
docker compose exec api python scripts/seed_companies.py
```

Open Swagger:

```text
http://127.0.0.1:8000/docs
```

Stop Docker services:

```powershell
docker compose down
```

---

# Notes

* The `.env` file should not be committed.
* External news API integration is prepared but requires a real API key.
* Redis is optional locally, but available through Docker Compose.
* Docker PostgreSQL runs separately from local PostgreSQL.
* Alembic migrations run automatically in the Docker API container.
