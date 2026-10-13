from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from sqlalchemy import select, func

# Import your database connection and security logic
from app.core.database import get_db
from app.core.security import get_password_hash, verify_password, create_access_token

# Import your partner's models and your schemas
from app.db.models import User, UserRole
from app.schemas.user import UserCreate, UserResponse
from app.schemas.auth import Token

router = APIRouter()

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    # 1. Check if email already exists using the lowercase index your partner built
    stmt = select(User).where(func.lower(User.email) == user_in.email.lower())
    existing_user = db.execute(stmt).scalar_one_or_none()
    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="A user with this email already exists.",
        )
    
    # 2. Create the User record matching his columns
    db_user = User(
        email=user_in.email,
        password_hash=get_password_hash(user_in.password),
        first_name=user_in.first_name,
        last_name=user_in.last_name,
        phone=user_in.phone
    )
    db.add(db_user)
    db.flush() # Flushes to Supabase to generate the UUID without fully committing yet
    
    # 3. Create the Role record in his secondary table
    db_role = UserRole(
        user_id=db_user.id,
        role=user_in.role
    )
    db.add(db_role)
    
    # 4. Save both to Supabase safely
    db.commit()
    db.refresh(db_user)
    
    return db_user


@router.post("/login", response_model=Token)
def login(db: Session = Depends(get_db), form_data: OAuth2PasswordRequestForm = Depends()):
    # 1. Find user by email
    stmt = select(User).where(func.lower(User.email) == form_data.username.lower())
    user = db.execute(stmt).scalar_one_or_none()
    
    # 2. Verify existence and password
    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Incorrect email or password"
        )
        
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Inactive user account"
        )
        
    # 3. Generate JWT Token
    access_token = create_access_token(subject=str(user.id))
    return {"access_token": access_token, "token_type": "bearer"}