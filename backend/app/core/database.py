"""SQLAlchemy 2.0 engine, session factory and the FastAPI get_db dependency."""
from collections.abc import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

from app.core.config import settings


class Base(DeclarativeBase):
    """Declarative base shared by all ORM models."""


engine = create_engine(settings.DATABASE_URL, echo=settings.DB_ECHO, pool_pre_ping=True)
SessionLocal = sessionmaker(bind=engine, autoflush=False, expire_on_commit=False, class_=Session)


def get_db() -> Generator[Session, None, None]:
    """Open one session per request and always close it afterwards."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
