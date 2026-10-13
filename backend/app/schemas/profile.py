from pydantic import BaseModel
from typing import Optional
from decimal import Decimal

class ProfileUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None

class PreferenceBase(BaseModel):
    property_type: Optional[str] = None
    budget_min: Optional[Decimal] = None
    budget_max: Optional[Decimal] = None
    city: Optional[str] = None
    furnishing_status: Optional[str] = None

class PreferenceResponse(PreferenceBase):
    class Config:
        from_attributes = True