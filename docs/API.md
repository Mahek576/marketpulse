\# MarketPulse API Documentation



MarketPulse is a backend API for company tracking, user watchlists, and future market intelligence signals.



\## Base URL



Local development:



```text

http://127.0.0.1:8000
Swagger documentation:

http://127.0.0.1:8000/docs
Health Endpoints
GET /

Checks whether the backend is running.

GET /health

Returns service health information.
GET /health/db

Checks database connectivity.

Auth Endpoints
POST /auth/register

Registers a new user.

Request:

{
  "email": "test@example.com",
  "full_name": "Test User",
  "password": "test1234"
}
POST /auth/login

Logs in a user and returns a JWT access token.

Request:
{
  "email": "test@example.com",
  "password": "test1234"
}

Response:

{
  "access_token": "jwt-token",
  "token_type": "bearer"
}
GET /auth/me

Returns the currently logged-in user.

Requires JWT authentication.

Company Endpoints
POST /companies
Creates a company.

Requires JWT authentication.

Request:

{
  "symbol": "PAYTM",
  "name": "One97 Communications",
  "exchange": "NSE",
  "sector": "Fintech",
  "industry": "Digital Payments",
  "country": "India"
}
GET /companies

Returns all active companies.

Requires JWT authentication.

GET /companies/{company_id}

Returns details for one company.

Requires JWT authentication.
Watchlist Endpoints
POST /watchlist/{company_id}

Adds a company to the current user's watchlist.

Requires JWT authentication.

GET /watchlist

Returns the current user's watchlist.

Requires JWT authentication.

DELETE /watchlist/{company_id}

Removes a company from the current user's watchlist.

Requires JWT authentication.

Authentication Format

In Swagger, click Authorize and paste only the JWT token.

In raw HTTP requests, use:
Authorization: Bearer <token>
Current Database

The project currently uses SQLite for fast local development.

Current database URL:

sqlite:///./marketpulse.db

The next planned upgrade is PostgreSQL with Alembic migrations.

