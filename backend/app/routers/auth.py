from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User, UserRole
from app.auth import (
    hash_password,
    verify_password,
    create_access_token,
    create_refresh_token,
    verify_refresh_token,
    get_current_user,
    get_current_admin,
    Token,
)
import uuid

router = APIRouter(prefix="/auth", tags=["Authentication"])

# =====================================================================
# Legacy register schema (phone-based, for Person 3 USSD compatibility)
# =====================================================================
from pydantic import BaseModel

class RegisterRequest(BaseModel):
    phone: str
    name: str
    password: str
    language: str = "en"
    gender: Optional[str] = None
    state: Optional[str] = None
    district: Optional[str] = None
    # Person 1 extended fields
    full_name: Optional[str] = None
    email: Optional[str] = None
    phone_number: Optional[str] = None

class RefreshTokenRequest(BaseModel):
    refresh_token: str

# =====================================================================
# Endpoints
# =====================================================================
@router.post("/register", status_code=201)
def register(body: RegisterRequest, db: Session = Depends(get_db)):
    """Register a new user. Accepts both phone-based and email-based payloads."""
    phone_val = body.phone_number or body.phone
    name_val = body.full_name or body.name
    email_val = body.email or f"{phone_val}@trustcircle.local"

    if db.scalar(select(User).where(User.phone_number == phone_val)):
        raise HTTPException(status_code=400, detail="Phone already registered")

    user = User(
        full_name=name_val,
        email=email_val,
        phone_number=phone_val,
        phone=phone_val,
        name=name_val,
        hashed_password=hash_password(body.password),
        role=UserRole.MEMBER,
        language=body.language,
        gender=body.gender,
        state=body.state,
        district=body.district,
        is_verified=False,
        is_active=True,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return {"id": user.id, "phone": user.phone_number, "name": user.full_name}


@router.post("/login")
def login(form: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """Login with phone or email as username."""
    # Try email first, then phone
    user = db.scalar(select(User).where(User.email == form.username))
    if not user:
        user = db.scalar(select(User).where(User.phone_number == form.username))
    if not user or not verify_password(form.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Account deactivated")

    access_token = create_access_token({"sub": user.email, "role": user.role.value})
    refresh_token = create_refresh_token({"sub": user.email, "role": user.role.value})
    return Token(access_token=access_token, refresh_token=refresh_token)


@router.post("/refresh")
def refresh(request_data: RefreshTokenRequest, db: Session = Depends(get_db)):
    """Exchange a refresh token for a new token pair."""
    user = verify_refresh_token(request_data.refresh_token, db)
    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Account deactivated")
    access_token = create_access_token({"sub": user.email, "role": user.role.value})
    new_refresh = create_refresh_token({"sub": user.email, "role": user.role.value})
    return Token(access_token=access_token, refresh_token=new_refresh)


@router.get("/me")
def get_me(current_user: User = Depends(get_current_user)):
    """Return the currently authenticated user's profile."""
    return {
        "id": current_user.id,
        "full_name": current_user.full_name,
        "email": current_user.email,
        "phone_number": current_user.phone_number,
        "role": current_user.role.value,
        "current_trust_score": float(current_user.current_trust_score),
        "is_verified": current_user.is_verified,
        "is_active": current_user.is_active,
    }


@router.get("/admin")
def get_admin(current_admin: User = Depends(get_current_admin)):
    """Admin-only endpoint."""
    return {
        "message": "Welcome, Administrator.",
        "admin": current_admin.full_name
    }
