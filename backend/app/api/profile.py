from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.deps import get_current_user
from app.db.models import User, RentalPreference
from app.schemas.user import UserResponse
from app.schemas.profile import ProfileUpdate, PreferenceBase, PreferenceResponse

router = APIRouter()

@router.get("/", response_model=UserResponse)
def get_profile(current_user: User = Depends(get_current_user)):
    return current_user

@router.put("/", response_model=UserResponse)
def update_profile(profile_in: ProfileUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if profile_in.first_name: current_user.first_name = profile_in.first_name
    if profile_in.last_name: current_user.last_name = profile_in.last_name
    if profile_in.phone: current_user.phone = profile_in.phone
    db.commit()
    db.refresh(current_user)
    return current_user

@router.get("/preferences", response_model=PreferenceResponse)
def get_preferences(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    pref = db.query(RentalPreference).filter(RentalPreference.user_id == current_user.id).first()
    if not pref:
        return PreferenceResponse()
    return pref

@router.put("/preferences", response_model=PreferenceResponse)
def update_preferences(pref_in: PreferenceBase, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    pref = db.query(RentalPreference).filter(RentalPreference.user_id == current_user.id).first()
    if not pref:
        pref = RentalPreference(user_id=current_user.id)
        db.add(pref)
    
    if pref_in.property_type is not None: pref.property_type = pref_in.property_type
    if pref_in.budget_min is not None: pref.budget_min = pref_in.budget_min
    if pref_in.budget_max is not None: pref.budget_max = pref_in.budget_max
    if pref_in.city is not None: pref.city = pref_in.city
    if pref_in.furnishing_status is not None: pref.furnishing_status = pref_in.furnishing_status
    
    db.commit()
    db.refresh(pref)
    return pref