"""Shared dependencies: DB session, current user from the OAuth2 bearer token, role guards (NFR-04)."""
from collections.abc import Callable
from typing import Annotated

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.database import get_db
from app.core.security import ACCESS_TOKEN_TYPE, TokenError, decode_token
from app.models.user import User

# tokenUrl points at the form-based endpoint so Swagger's "Authorize" button works.
oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_PREFIX}/auth/token")

DbSession = Annotated[Session, Depends(get_db)]


def get_current_user(db: DbSession, token: Annotated[str, Depends(oauth2_scheme)]) -> User:
    try:
        payload = decode_token(token, ACCESS_TOKEN_TYPE)
    except TokenError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail=str(exc), headers={"WWW-Authenticate": "Bearer"}
        ) from exc
    user = db.get(User, int(payload["sub"]))
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="User no longer exists",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Account is deactivated")
    return user


CurrentUser = Annotated[User, Depends(get_current_user)]


def require_roles(*roles: str) -> Callable[[User], User]:
    """Dependency factory for role-based access control, e.g. Depends(require_roles("admin"))."""

    def checker(user: CurrentUser) -> User:
        if user.role not in roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN, detail=f"Requires role: {' or '.join(roles)}"
            )
        return user

    return checker


CurrentAdmin = Annotated[User, Depends(require_roles("admin"))]
