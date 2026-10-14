import uuid
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field

class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8)
    first_name: str = Field(min_length=1)
    last_name: str = Field(min_length=1)
    phone: Optional[str] = None
    role: str = Field(default="tenant", pattern="^(tenant|landlord)$")

class UserResponse(BaseModel):
    id: uuid.UUID
    first_name: str
    last_name: str
    email: EmailStr
    phone: Optional[str] = None
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True