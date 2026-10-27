from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from sqlalchemy import select, func

import os
import secrets
from google.oauth2 import id_token
from google.auth.transport import requests

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

from pydantic import BaseModel

class GoogleAuthRequest(BaseModel):
    token: str

@router.post("/logout")
def logout():
    return {"message": "Successfully logged out. The frontend client must now delete the JWT token from local storage."}

@router.post("/google", response_model=Token)
def google_auth(auth_in: GoogleAuthRequest, db: Session = Depends(get_db)):
    client_id = os.getenv("GOOGLE_CLIENT_ID")
    if not client_id:
        raise HTTPException(status_code=500, detail="Server OAuth configuration missing")

    try:
        # 1. Verify the token signature with Google
        idinfo = id_token.verify_oauth2_token(
            auth_in.token, 
            requests.Request(), 
            client_id
        )
        
        email = idinfo.get("email")
        first_name = idinfo.get("given_name", "")
        last_name = idinfo.get("family_name", "")
        
        # 2. Check if the user already exists in your database
        stmt = select(User).where(func.lower(User.email) == email.lower())
        user = db.execute(stmt).scalar_one_or_none()
        
        if not user:
            # 3. Create a new user record for first-time Google Sign-In
            # We generate a random secure string for the password hash since they use Google
            dummy_password = secrets.token_urlsafe(32)
            
            user = User(
                email=email,
                password_hash=get_password_hash(dummy_password),
                first_name=first_name,
                last_name=last_name,
                phone=""  # Default empty string
            )
            db.add(user)
            db.flush()
            
            # Assign a default role
            db_role = UserRole(user_id=user.id, role="tenant")
            db.add(db_role)
            
            db.commit()
            db.refresh(user)
            
        elif not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, 
                detail="Inactive user account"
            )
        
        # 4. Generate your application's JWT Token using the user's ID
        access_token = create_access_token(subject=str(user.id))
        return {"access_token": access_token, "token_type": "bearer"}
        
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Invalid or expired Google token"
        )