"""Authentication schemas: register, login, refresh and token responses."""
from typing import Literal

from pydantic import BaseModel, EmailStr, Field, field_validator

from app.schemas.user import UserRead


def _check_strength(value: str) -> str:
    if not any(ch.isdigit() for ch in value) or not any(ch.isalpha() for ch in value):
        raise ValueError("Password must contain at least one letter and one digit")
    return value


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=72)
    full_name: str = Field(min_length=1, max_length=150)
    # Admin accounts cannot be self-registered; they are created with app/create_admin.py.
    role: Literal["renter", "landlord"] = "renter"

    @field_validator("password")
    @classmethod
    def password_strength(cls, value: str) -> str:
        return _check_strength(value)

    @field_validator("full_name")
    @classmethod
    def strip_name(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("Full name must not be blank")
        return value


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1, max_length=72)


class RefreshRequest(BaseModel):
    refresh_token: str = Field(min_length=10)


class ChangePasswordRequest(BaseModel):
    current_password: str = Field(min_length=1, max_length=72)
    new_password: str = Field(min_length=8, max_length=72)

    @field_validator("new_password")
    @classmethod
    def password_strength(cls, value: str) -> str:
        return _check_strength(value)


class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int


class AuthResponse(Token):
    user: UserRead
