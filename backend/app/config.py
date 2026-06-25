from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "MarketPulse API"
    app_version: str = "0.1.0"
    environment: str = "development"
    debug: bool = True

    database_url: str = "sqlite:///./marketpulse.db"

    secret_key: str = "marketpulse-dev-secret-change-this-later"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30

    news_api_key: str | None = None
    news_api_base_url: str = "https://newsapi.org/v2/everything"
    news_api_default_language: str = "en"
    news_api_default_sort_by: str = "publishedAt"

    enable_cache: bool = True
    redis_url: str = "redis://localhost:6379/0"
    cache_ttl_seconds: int = 300

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
    )


settings = Settings()