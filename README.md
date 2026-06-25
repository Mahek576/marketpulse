# MarketPulse

MarketPulse is a production-grade market intelligence backend built with FastAPI.

The platform allows users to register, log in, create company records, and maintain a personal company watchlist. It is designed to later support market news ingestion, policy tracking, AI-generated summaries, risk signals, and alerting.

## Current Status

Backend MVP foundation completed.

## Current Features

- FastAPI backend
- Environment-based configuration using `.env`
- SQLAlchemy database layer
- SQLite local database
- User registration
- Secure password hashing
- JWT login
- Protected current-user endpoint
- Company creation API
- Company listing API
- Company detail API
- User-specific watchlist API
- Swagger API documentation
- Basic error response formatting
- Sample company data

## Tech Stack

- Python 3.11
- FastAPI
- SQLAlchemy
- Pydantic
- Pydantic Settings
- SQLite
- JWT
- Uvicorn
- Git

## Planned Upgrades

- PostgreSQL
- Alembic migrations
- Redis caching
- Background jobs
- News ingestion
- Policy update ingestion
- AI-generated market intelligence summaries
- Alert engine
- Docker
- Deployment

## Project Structure

```text
marketpulse/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── db/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── config.py
│   │   └── main.py
│   ├── sample_data/
│   ├── requirements.txt
│   └── .env.example
├── docs/
│   └── API.md
├── README.md
└── .gitignore