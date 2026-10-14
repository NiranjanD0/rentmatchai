"""Fixtures: a dedicated PostgreSQL test database built with the real Alembic migration, a TestClient
wired to it, and helpers that create users with ready-made auth headers.

TEST_DATABASE_URL (default postgresql+psycopg2://rentmatch:rentmatch@localhost:5432/rentmatch_test) is
created automatically if it does not exist. Its tables are dropped and recreated at the start of the run.
"""
from pathlib import Path

from alembic import command
from alembic.config import Config
from fastapi.testclient import TestClient
import pytest
from sqlalchemy import create_engine, text
from sqlalchemy.engine import make_url
from sqlalchemy.orm import sessionmaker

from app.core import database
from app.core.config import settings
from app.core.database import get_db
from app.core.security import create_access_token, hash_password
from app.main import app
from app.models.user import User

BACKEND_DIR = Path(__file__).resolve().parents[1]
TEST_URL = settings.TEST_DATABASE_URL


def _ensure_database_exists(url: str) -> None:
    parsed = make_url(url)
    admin_engine = create_engine(parsed.set(database="postgres"), isolation_level="AUTOCOMMIT")
    with admin_engine.connect() as conn:
        exists = conn.scalar(text("SELECT 1 FROM pg_database WHERE datname = :name"), {"name": parsed.database})
        if not exists:
            conn.execute(text(f'CREATE DATABASE "{parsed.database}"'))
    admin_engine.dispose()


@pytest.fixture(scope="session")
def engine():
    _ensure_database_exists(TEST_URL)
    eng = create_engine(TEST_URL)
    with eng.begin() as conn:
        conn.execute(text("DROP TABLE IF EXISTS user_preferences, users, alembic_version CASCADE"))
    cfg = Config(str(BACKEND_DIR / "alembic.ini"))
    cfg.set_main_option("script_location", str(BACKEND_DIR / "migrations"))
    cfg.attributes["sqlalchemy.url"] = TEST_URL
    cfg.attributes["skip_logging"] = True
    command.upgrade(cfg, "head")  # build the schema with the real migration
    yield eng
    eng.dispose()


@pytest.fixture(scope="session")
def session_factory(engine):
    return sessionmaker(bind=engine, autoflush=False, expire_on_commit=False)


@pytest.fixture(autouse=True)
def clean_tables(engine):
    yield
    with engine.begin() as conn:
        conn.execute(text("TRUNCATE user_preferences, users RESTART IDENTITY CASCADE"))


@pytest.fixture
def db(session_factory):
    session = session_factory()
    try:
        yield session
    finally:
        session.close()


@pytest.fixture
def client(session_factory, monkeypatch):
    def override_get_db():
        session = session_factory()
        try:
            yield session
        finally:
            session.close()

    app.dependency_overrides[get_db] = override_get_db
    monkeypatch.setattr(database, "SessionLocal", session_factory)  # used by /health and startup check
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


@pytest.fixture
def make_user(db):
    """Insert a user directly and return (user, {"Authorization": "Bearer <token>"})."""

    def _make(role: str = "renter", email: str | None = None, password: str = "Passw0rd!", full_name: str = "Test User"):
        user = User(
            email=email or f"{role}{db.query(User).count() + 1}@example.com",
            hashed_password=hash_password(password),
            full_name=full_name,
            role=role,
            is_active=True,
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        return user, {"Authorization": f"Bearer {create_access_token(user.id, user.role)}"}

    return _make
