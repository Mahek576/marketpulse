import redis

from app.config import settings


def get_redis_client():
    if not settings.enable_cache:
        return None

    try:
        client = redis.Redis.from_url(
            settings.redis_url,
            decode_responses=True,
        )

        client.ping()

        return client

    except redis.RedisError:
        return None