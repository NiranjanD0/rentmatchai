"""FastAPI application entry point: CORS, router inclusion and health check."""
from contextlib import asynccontextmanager
import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from app.api import auth
from app.core import database
from app.core.config import settings
from app.api import auth, profile, properties

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s: %(message)s")
logger = logging.getLogger("rentmatch")


@asynccontextmanager
async def lifespan(_app: FastAPI):
    try:
        with database.SessionLocal() as db:
            db.execute(text("SELECT 1"))
        logger.info("Database connection OK")
    except Exception as exc:  # noqa: BLE001 - the API still starts; /health reports the problem
        logger.error("Database not reachable at startup: %s", exc)
    yield


app = FastAPI(
    title=f"{settings.PROJECT_NAME} — Sprint 1 (Auth and users)",
    version="0.1.0",
    description="Registration, JWT login, user profile and rental preferences.",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix=settings.API_V1_PREFIX)
from app.api import auth, profile

# Existing auth router
app.include_router(auth.router, prefix=settings.API_V1_PREFIX)
# New profile router
app.include_router(profile.router, prefix=f"{settings.API_V1_PREFIX}/profile", tags=["profile"])


@app.get("/", tags=["meta"])
def root() -> dict[str, str]:
    return {"name": settings.PROJECT_NAME, "docs": "/docs", "api": settings.API_V1_PREFIX}


@app.get("/health", tags=["meta"])
def health() -> dict[str, str]:
    try:
        with database.SessionLocal() as db:
            db.execute(text("SELECT 1"))
        return {"status": "ok", "database": "ok"}
    except Exception as exc:  # noqa: BLE001
        return {"status": "degraded", "database": f"error: {exc.__class__.__name__}"}
    
app.include_router(properties.router, prefix=f"{settings.API_V1_PREFIX}/properties", tags=["properties"])
