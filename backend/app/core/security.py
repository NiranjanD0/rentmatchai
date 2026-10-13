"""Password hashing (PassLib + bcrypt) and JWT access/refresh tokens (NFR-04)."""
from datetime import datetime, timedelta, timezone
from typing import Any
import uuid

import jwt
from passlib.context import CryptContext

from app.core.config import settings

ACCESS_TOKEN_TYPE = "access"
REFRESH_TOKEN_TYPE = "refresh"

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto", bcrypt__rounds=12)


class TokenError(Exception):
    """Raised when a token is malformed, expired, badly signed or of the wrong type."""


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str | None) -> bool:
    if not hashed_password:
        return False
    try:
        return pwd_context.verify(plain_password, hashed_password)
    except ValueError:
        return False


def _create_token(subject: str, token_type: str, expires_delta: timedelta, extra: dict[str, Any] | None = None) -> str:
    now = datetime.now(timezone.utc)
    payload: dict[str, Any] = {
        "sub": subject,
        "type": token_type,
        "iat": int(now.timestamp()),
        "exp": int((now + expires_delta).timestamp()),
        "jti": uuid.uuid4().hex,
    }
    if extra:
        payload.update(extra)
    return jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.JWT_ALGORITHM)


def create_access_token(user_id: int, role: str, expires_delta: timedelta | None = None) -> str:
    return _create_token(
        str(user_id),
        ACCESS_TOKEN_TYPE,
        expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES),
        {"role": role},
    )


def create_refresh_token(user_id: int, expires_delta: timedelta | None = None) -> str:
    return _create_token(
        str(user_id), REFRESH_TOKEN_TYPE, expires_delta or timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    )


def decode_token(token: str, expected_type: str) -> dict[str, Any]:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
    except jwt.ExpiredSignatureError as exc:
        raise TokenError("Token has expired") from exc
    except jwt.PyJWTError as exc:
        raise TokenError("Invalid token") from exc
    if payload.get("type") != expected_type:
        raise TokenError(f"Expected a {expected_type} token")
    if not str(payload.get("sub", "")).isdigit():
        raise TokenError("Invalid token subject")
    return payload
