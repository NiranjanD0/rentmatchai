import logging
from typing import Literal
import socket
import urllib3.util.connection as urllib3_conn

# Force IPv4 socket connection to prevent IPv6 DNS/connect timeouts when validating Google tokens
urllib3_conn.allowed_gai_family = lambda: socket.AF_INET

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy import select, func

from requests.adapters import HTTPAdapter
from google.auth.exceptions import GoogleAuthError, TransportError
from google.oauth2 import id_token
from google.auth.transport import requests

class TimeoutHTTPAdapter(HTTPAdapter):
    def send(self, request, **kwargs):
        kwargs.setdefault('timeout', 10)
        return super().send(request, **kwargs)

# Import your database connection and security logic
from app.core.config import settings
from app.core.database import get_db
from app.core.security import get_password_hash, verify_password, create_access_token

# Import your partner's models and your schemas
from app.db.models import User, UserRole
from app.schemas.user import UserCreate, UserResponse
from app.schemas.auth import Token

router = APIRouter()
logger = logging.getLogger(__name__)


class GoogleAuthRequest(BaseModel):
    token: str
    role: Literal["tenant", "landlord"] = "tenant"


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
    if not user or not user.password_hash or not verify_password(form_data.password, user.password_hash):
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

@router.post("/logout")
def logout():
    return {"message": "Successfully logged out. The frontend client must now delete the JWT token from local storage."}

@router.post("/google", response_model=Token)
def google_auth(auth_in: GoogleAuthRequest, db: Session = Depends(get_db)):
    client_id = settings.GOOGLE_CLIENT_ID
    if not client_id:
        raise HTTPException(status_code=500, detail="Server OAuth configuration missing")

    try:
        session = requests.requests.Session()
        session.mount('https://', TimeoutHTTPAdapter())
        req = requests.Request(session=session)
        idinfo = id_token.verify_oauth2_token(
            auth_in.token,
            req,
            client_id
        )
    except TransportError as e:
        logger.warning("Google token verification unavailable: %s", e)
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Could not reach Google to verify the sign-in. Please try again.",
        ) from e
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid or expired Google token: {str(e)}",
        ) from e
    except GoogleAuthError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid or expired Google token: {str(e)}",
        ) from e
    except Exception as e:
        logger.exception("Unexpected error while verifying Google sign-in")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred while verifying Google sign-in.",
        ) from e

    email = idinfo.get("email")
    google_sub = idinfo.get("sub")
    if (
        not isinstance(email, str)
        or not email.strip()
        or idinfo.get("email_verified") is not True
        or not isinstance(google_sub, str)
        or not google_sub
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Google account must have a verified email address",
        )

    user = db.execute(
        select(User).where(User.google_sub == google_sub)
    ).scalar_one_or_none()
    if user is None:
        user = db.execute(
            select(User).where(func.lower(User.email) == email.lower())
        ).scalar_one_or_none()

    if user and user.google_sub and user.google_sub != google_sub:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="This email is already linked to another Google account",
        )
    if user and not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Inactive user account",
        )

    display_name = idinfo.get("name", "")
    name_parts = display_name.split() if isinstance(display_name, str) else []
    first_name = (idinfo.get("given_name") or (name_parts[0] if name_parts else email.split("@", 1)[0]))
    last_name = idinfo.get("family_name") or (" ".join(name_parts[1:]) if len(name_parts) > 1 else "")

    if not user:
        user = User(
            email=email.lower(),
            password_hash=None,
            google_sub=google_sub,
            first_name=first_name.strip()[:100] or "Google",
            last_name=last_name.strip()[:100],
            phone=None,
        )
        db.add(user)
        db.flush()
        db.add(UserRole(user_id=user.id, role=auth_in.role))
        db.commit()
        db.refresh(user)
    else:
        changed = False
        if not user.google_sub:
            user.google_sub = google_sub
            changed = True
        # If user previously had placeholder "User" as last name, clean it up
        if user.last_name == "User" and (not idinfo.get("family_name") or len(name_parts) <= 1):
            user.last_name = last_name.strip()[:100]
            changed = True
        if changed:
            db.commit()
            db.refresh(user)

    access_token = create_access_token(subject=str(user.id))
    return {"access_token": access_token, "token_type": "bearer"}