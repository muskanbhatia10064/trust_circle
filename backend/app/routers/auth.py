import uuid
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.database import get_db
from app.models import User
from app.auth import hash_password, verify_password, create_access_token, get_current_user
from app.config import settings
from jose import jwt, JWTError

router = APIRouter(prefix="/auth", tags=["auth"])

# In-memory refresh token store — swap for DB/Redis in production
_refresh_tokens: dict[str, str] = {}  # token → user_id


class RegisterRequest(BaseModel):
    phone: str
    name: str
    password: str
    language: str = "en"
    gender: str | None = None
    state: str | None = None
    district: str | None = None


class RefreshRequest(BaseModel):
    refresh_token: str


def _make_refresh_token(user_id: str) -> str:
    expire = datetime.utcnow() + timedelta(days=7)
    token = jwt.encode({"sub": user_id, "exp": expire, "type": "refresh"}, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    _refresh_tokens[token] = user_id
    return token


@router.post("/register", status_code=201)
def register(body: RegisterRequest, db: Session = Depends(get_db)):
    if db.query(User).filter(User.phone == body.phone).first():
        raise HTTPException(status_code=400, detail="Phone already registered")
    user = User(
        id=str(uuid.uuid4()),
        phone=body.phone,
        name=body.name,
        gender=body.gender,
        state=body.state,
        district=body.district,
        language=body.language,
        hashed_password=hash_password(body.password),
    )
    db.add(user)
    db.commit()
    return {"id": user.id, "phone": user.phone}


@router.post("/login")
def login(form: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.phone == form.username).first()
    if not user or not verify_password(form.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    access_token = create_access_token({"sub": user.id})
    refresh_token = _make_refresh_token(user.id)
    return {"access_token": access_token, "refresh_token": refresh_token, "token_type": "bearer"}


@router.post("/refresh")
def refresh(body: RefreshRequest):
    user_id = _refresh_tokens.get(body.refresh_token)
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid or expired refresh token")
    try:
        jwt.decode(body.refresh_token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
    except JWTError:
        _refresh_tokens.pop(body.refresh_token, None)
        raise HTTPException(status_code=401, detail="Refresh token expired")
    # Rotate both tokens
    _refresh_tokens.pop(body.refresh_token)
    new_access = create_access_token({"sub": user_id})
    new_refresh = _make_refresh_token(user_id)
    return {"access_token": new_access, "refresh_token": new_refresh, "token_type": "bearer"}


@router.post("/logout")
def logout(body: RefreshRequest):
    _refresh_tokens.pop(body.refresh_token, None)
    return {"message": "Logged out"}


@router.post("/logout-all")
def logout_all(current_user: User = Depends(get_current_user)):
    to_remove = [t for t, uid in _refresh_tokens.items() if uid == current_user.id]
    for t in to_remove:
        _refresh_tokens.pop(t)
    return {"message": f"Revoked {len(to_remove)} session(s)"}


@router.get("/me")
def auth_me(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "phone": current_user.phone,
        "name": current_user.name,
        "language": current_user.language,
        "is_facilitator": current_user.is_facilitator,
    }
