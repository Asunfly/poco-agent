from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # Service configuration
    app_name: str = Field(default="Executor Manager")
    app_version: str = Field(default="0.1.0")
    host: str = Field(default="0.0.0.0")
    port: int = Field(default=8001)
    debug: bool = Field(default=False, alias="DEBUG")
    cors_origins: list[str] = Field(default=["http://localhost:3000"])

    # External service URLs
    backend_url: str = Field(default="http://localhost:8000")
    executor_url: str = Field(default="http://localhost:8080")
    callback_base_url: str = Field(default="http://localhost:8001")

    # Scheduler configuration
    max_concurrent_tasks: int = Field(default=5)
    task_timeout_seconds: int = Field(default=3600)
    retry_attempts: int = Field(default=3)
    retry_delay_seconds: int = Field(default=60)
    callback_token: str = Field(default="change-this-token-in-production")

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )


@lru_cache
def get_settings() -> Settings:
    return Settings()
