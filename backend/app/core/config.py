"""Application settings, loaded from environment variables and the backend/.env file."""
from functools import lru_cache
from pathlib import Path
from typing import Annotated

from pydantic import field_validator
from pydantic_settings import BaseSettings, NoDecode, SettingsConfigDict

BACKEND_DIR = Path(__file__).resolve().parents[2]


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=str(BACKEND_DIR / ".env"),
        env_file_encoding="utf-8",
        extra="ignore",
        case_sensitive=False,
    )

    PROJECT_NAME: str = "RentMatch AI"
    API_V1_PREFIX: str = "/api/v1"
    ENVIRONMENT: str = "development"
    CORS_ORIGINS: Annotated[list[str], NoDecode] = ["http://localhost:5173", "http://localhost:3000"]

    DATABASE_URL: str = "postgresql+psycopg2://rentmatch:rentmatch@localhost:5432/rentmatch"
    TEST_DATABASE_URL: str = "postgresql+psycopg2://rentmatch:rentmatch@localhost:5432/rentmatch_test"
    DB_ECHO: bool = False

    SECRET_KEY: str = "change-me-in-production-use-a-long-random-string"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def split_origins(cls, value):
        if isinstance(value, str):
            return [origin.strip() for origin in value.split(",") if origin.strip()]
        return value

    @field_validator("DATABASE_URL", "TEST_DATABASE_URL")
    @classmethod
    def use_psycopg2_driver(cls, value: str) -> str:
        # Supabase/Heroku style "postgres://" or plain "postgresql://" URLs -> explicit SQLAlchemy driver.
        if value.startswith("postgres://"):
            value = "postgresql://" + value[len("postgres://"):]
        if value.startswith("postgresql://"):
            value = "postgresql+psycopg2://" + value[len("postgresql://"):]
        return value


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
