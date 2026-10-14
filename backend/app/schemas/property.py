from pydantic import BaseModel, ConfigDict
from typing import Optional
from uuid import UUID
from decimal import Decimal
from datetime import date, datetime

class PropertyBase(BaseModel):
    title: str
    description: str
    property_type: str
    listing_type: Optional[str] = 'rent'
    monthly_rent: Decimal
    security_deposit: Optional[Decimal] = None
    bedrooms: int = 1
    bathrooms: Decimal = Decimal('1.0')
    area_sqft: Optional[Decimal] = None
    furnishing_status: Optional[str] = None
    address_line: Optional[str] = None
    locality: Optional[str] = None
    city: str
    state: str
    postal_code: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    available_from: Optional[date] = None

class PropertyCreate(PropertyBase):
    pass

class PropertyUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    property_type: Optional[str] = None
    listing_type: Optional[str] = None
    monthly_rent: Optional[Decimal] = None
    security_deposit: Optional[Decimal] = None
    bedrooms: Optional[int] = None
    bathrooms: Optional[Decimal] = None
    area_sqft: Optional[Decimal] = None
    furnishing_status: Optional[str] = None
    address_line: Optional[str] = None
    locality: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    postal_code: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    status: Optional[str] = None
    available_from: Optional[date] = None

class PropertyResponse(PropertyBase):
    id: UUID
    owner_id: UUID
    status: str
    created_at: datetime
    updated_at: datetime
    
    model_config = ConfigDict(from_attributes=True)