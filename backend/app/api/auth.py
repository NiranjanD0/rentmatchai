"""/api/v1/auth: register, login (JSON + OAuth2 form), refresh, logout, profile and preferences."""
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy import func, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.api.deps import CurrentAdmin, CurrentUser, DbSession
from app.core.config import settings
from app.core.security import (
    REFRESH_TOKEN_TYPE,
    TokenError,
    create_access_token,
    create_refresh_token,
    decode_token,
    hash_password,
    verify_password,
)
from app.models.user import User, UserPreference
from app.schemas.auth import AuthResponse, ChangePasswordRequest, LoginRequest, RefreshRequest, RegisterRequest, Token
from app.schemas.user import UserPreferenceRead, UserPreferenceUpdate, UserRead, UserUpdate

router = APIRouter(prefix="/auth", tags=["auth"])


def _issue_tokens(user: User) -> AuthResponse:
    return AuthResponse(
        access_token=create_access_token(user.id, user.role),
        refresh_token=create_refresh_token(user.id),
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        user=UserRead.model_validate(user),
    )


def _authenticate(db: Session, email: str, password: str) -> User:
    user = db.scalar(select(User).where(func.lower(User.email) == email.strip().lower()))
    if user is None or not verify_password(password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Account is deactivated")
    return user


def _get_or_create_preference(db: Session, user: User) -> UserPreference:
    pref = db.scalar(select(UserPreference).where(UserPreference.user_id == user.id))
    if pref is None:
        pref = UserPreference(user_id=user.id, preferred_localities=[], property_types=[])
        db.add(pref)
        db.commit()
        db.refresh(pref)
    return pref


@router.post("/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
def register(payload: RegisterRequest, db: DbSession) -> AuthResponse:
    email = payload.email.lower()
    if db.scalar(select(User.id).where(func.lower(User.email) == email)) is not None:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email is already registered")
    user = User(
        email=email,
        hashed_password=hash_password(payload.password),
        full_name=payload.full_name,
        role=payload.role,
        is_active=True,
    )
    db.add(user)
    try:
        db.commit()
    except IntegrityError as exc:  # concurrent registration with the same email
        db.rollback()
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email is already registered") from exc
    db.refresh(user)
    return _issue_tokens(user)


@router.post("/login", response_model=AuthResponse)
def login(payload: LoginRequest, db: DbSession) -> AuthResponse:
    return _issue_tokens(_authenticate(db, payload.email, payload.password))


@router.post("/token", response_model=Token, summary="OAuth2 password flow (used by Swagger 'Authorize')")
def token(form: Annotated[OAuth2PasswordRequestForm, Depends()], db: DbSession) -> Token:
    issued = _issue_tokens(_authenticate(db, form.username, form.password))
    return Token(access_token=issued.access_token, refresh_token=issued.refresh_token, expires_in=issued.expires_in)


@router.post("/refresh", response_model=AuthResponse)
def refresh(payload: RefreshRequest, db: DbSession) -> AuthResponse:
    try:
        data = decode_token(payload.refresh_token, REFRESH_TOKEN_TYPE)
    except TokenError as exc:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(exc)) from exc
    user = db.get(User, int(data["sub"]))
    if user is None or not user.is_active:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found or inactive")
    return _issue_tokens(user)


@router.post("/logout")
def logout(_user: CurrentUser) -> dict[str, str]:
    # JWTs are stateless: the client deletes both tokens. Short access-token lifetimes limit exposure.
    return {"detail": "Logged out. Discard your access and refresh tokens on the client."}


@router.get("/me", response_model=UserRead)
def read_me(user: CurrentUser) -> User:
    return user


@router.patch("/me", response_model=UserRead)
def update_me(payload: UserUpdate, user: CurrentUser, db: DbSession) -> User:
    user.full_name = payload.full_name
    db.commit()
    db.refresh(user)
    return user


@router.post("/me/change-password")
def change_password(payload: ChangePasswordRequest, user: CurrentUser, db: DbSession) -> dict[str, str]:
    if not verify_password(payload.current_password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Current password is incorrect")
    user.hashed_password = hash_password(payload.new_password)
    db.commit()
    return {"detail": "Password updated"}


@router.get("/me/preferences", response_model=UserPreferenceRead)
def read_preferences(user: CurrentUser, db: DbSession) -> UserPreference:
    return _get_or_create_preference(db, user)


@router.put("/me/preferences", response_model=UserPreferenceRead)
def replace_preferences(payload: UserPreferenceUpdate, user: CurrentUser, db: DbSession) -> UserPreference:
    pref = _get_or_create_preference(db, user)
    for field, value in payload.model_dump().items():
        setattr(pref, field, value)
    db.commit()
    db.refresh(pref)
    return pref


@router.get("/users", response_model=list[UserRead], summary="List users (admin only)")
def list_users(
    db: DbSession,
    _admin: CurrentAdmin,
    role: str | None = None,
    skip: Annotated[int, Query(ge=0)] = 0,
    limit: Annotated[int, Query(ge=1, le=200)] = 50,
) -> list[User]:
    stmt = select(User).order_by(User.id)
    if role:
        stmt = stmt.where(User.role == role)
    return list(db.scalars(stmt.offset(skip).limit(limit)).all())
