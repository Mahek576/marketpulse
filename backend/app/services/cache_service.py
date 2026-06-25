import json
from typing import Any

from app.cache.redis_client import get_redis_client
from app.config import settings


def get_cached_value(key: str) -> Any | None:
    client = get_redis_client()

    if not client:
        return None

    cached_data = client.get(key)

    if not cached_data:
        return None

    return json.loads(cached_data)


def set_cached_value(
    key: str,
    value: Any,
    ttl_seconds: int | None = None,
) -> None:
    client = get_redis_client()

    if not client:
        return

    ttl = ttl_seconds or settings.cache_ttl_seconds

    client.setex(
        key,
        ttl,
        json.dumps(value),
    )


def delete_cached_value(key: str) -> None:
    client = get_redis_client()

    if not client:
        return

    client.delete(key)


def build_companies_cache_key(skip: int, limit: int) -> str:
    return f"companies:list:skip={skip}:limit={limit}"


def clear_companies_cache() -> None:
    client = get_redis_client()

    if not client:
        return

    keys = client.keys("companies:list:*")

    if keys:
        client.delete(*keys)