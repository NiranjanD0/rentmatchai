from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from uuid import UUID
from decimal import Decimal

from app.core.database import get_db
from app.api.deps import get_current_user
from app.db.models import Property, User
from app.schemas.property import PropertyCreate, PropertyUpdate, PropertyResponse

router = APIRouter()

@router.get("/", response_model=List[PropertyResponse])
def get_properties(
    db: Session = Depends(get_db),
    skip: int = Query(0, ge=0, description="Pagination offset"),
    limit: int = Query(10, ge=1, le=100, description="Pagination limit"),
    city: Optional[str] = None,
    property_type: Optional[str] = None,
    budget_min: Optional[Decimal] = None,
    budget_max: Optional[Decimal] = None,
    status: Optional[str] = "published"
):
    """Fetch a list of properties with optional filters and pagination."""
    query = db.query(Property)
    
    if status:
        query = query.filter(Property.status == status)
    if city:
        query = query.filter(Property.city.ilike(f"%{city}%"))
    if property_type:
        query = query.filter(Property.property_type == property_type)
    if budget_min is not None:
        query = query.filter(Property.monthly_rent >= budget_min)
    if budget_max is not None:
        query = query.filter(Property.monthly_rent <= budget_max)
        
    return query.offset(skip).limit(limit).all()

@router.get("/{property_id}", response_model=PropertyResponse)
def get_property(property_id: UUID, db: Session = Depends(get_db)):
    """Fetch a single property by its UUID."""
    prop = db.query(Property).filter(Property.id == property_id).first()
    if not prop:
        raise HTTPException(status_code=404, detail="Property not found")
    return prop

@router.post("/", response_model=PropertyResponse, status_code=status.HTTP_201_CREATED)
def create_property(
    property_in: PropertyCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new property listing. Requires login."""
    new_prop = Property(**property_in.model_dump(), owner_id=current_user.id, status="published")
    db.add(new_prop)
    db.commit()
    db.refresh(new_prop)
    return new_prop

@router.put("/{property_id}", response_model=PropertyResponse)
def update_property(
    property_id: UUID,
    property_in: PropertyUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update an existing property listing. Only the owner can do this."""
    prop = db.query(Property).filter(Property.id == property_id).first()
    if not prop:
        raise HTTPException(status_code=404, detail="Property not found")
    if prop.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to edit this property")
        
    update_data = property_in.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(prop, key, value)
        
    db.commit()
    db.refresh(prop)
    return prop

@router.delete("/{property_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_property(
    property_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a property listing. Only the owner can do this."""
    prop = db.query(Property).filter(Property.id == property_id).first()
    if not prop:
        raise HTTPException(status_code=404, detail="Property not found")
    if prop.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this property")
        
    db.delete(prop)
    db.commit()
    return None