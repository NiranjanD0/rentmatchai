"""User profile and rental-preference schemas (FR-01, FR-02)."""
from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator, model_validator

PropertyType = Literal["apartment", "house", "villa", "studio", "pg", "room"]

PROPERTY_TYPE_ALIASES = {
    "flat": "apartment",
    "apartment": "apartment",
    "house": "house",
    "independent house": "house",
    "villa": "villa",
    "bungalow": "villa",
    "studio": "studio",
    "1rk": "studio",
    "pg": "pg",
    "paying guest": "pg",
    "hostel": "pg",
    "room": "room",
}


class UserRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    email: EmailStr
    full_name: str
    role: str
    is_active: bool
    created_at: datetime


class UserUpdate(BaseModel):
    full_name: str = Field(min_length=1, max_length=150)

    @field_validator("full_name")
    @classmethod
    def strip_name(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("Full name must not be blank")
        return value


class UserPreferenceBase(BaseModel):
    min_budget: float | None = Field(default=None, ge=0, le=10_000_000)
    max_budget: float | None = Field(default=None, ge=0, le=10_000_000)
    preferred_localities: list[str] = Field(default_factory=list, max_length=20)
    property_types: list[PropertyType] = Field(default_factory=list)
    min_bedrooms: int | None = Field(default=None, ge=0, le=20)

    @field_validator("preferred_localities", mode="before")
    @classmethod
    def clean_localities(cls, value):
        seen: list[str] = []
        for item in value or []:
            if isinstance(item, str):
                cleaned = " ".join(item.split()).title()
                if cleaned and cleaned not in seen:
                    seen.append(cleaned)
        return seen

    @field_validator("property_types", mode="before")
    @classmethod
    def normalize_property_types(cls, value):
        result: list[str] = []
        for item in value or []:
            if isinstance(item, str):
                key = " ".join(item.strip().lower().split())
                normalized = PROPERTY_TYPE_ALIASES.get(key, key)
                if normalized not in result:
                    result.append(normalized)
        return result

    @model_validator(mode="after")
    def check_budget_range(self):
        if self.min_budget is not None and self.max_budget is not None and self.min_budget > self.max_budget:
            raise ValueError("min_budget cannot be greater than max_budget")
        return self


class UserPreferenceUpdate(UserPreferenceBase):
    """Full replacement of the saved preferences (used by PUT)."""


class UserPreferenceRead(UserPreferenceBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    updated_at: datetime
