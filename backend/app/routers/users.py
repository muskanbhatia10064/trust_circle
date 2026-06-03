from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.database import get_db
from app.auth import get_current_user
from app.models import User
from app.services.trust_score import get_latest_trust_score, get_score_band

router = APIRouter(prefix="/users", tags=["users"])


class UpdateProfileRequest(BaseModel):
    name: str | None = None
    language: str | None = None


@router.get("/me")
def get_me(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Full profile + latest trust score + band in one call."""
    score_record = get_latest_trust_score(current_user.id, db)
    return {
        "id": current_user.id,
        "phone": current_user.phone,
        "name": current_user.name,
        "gender": current_user.gender,
        "state": current_user.state,
        "district": current_user.district,
        "language": current_user.language,
        "is_facilitator": current_user.is_facilitator,
        "created_at": current_user.created_at,
        "trust_score": {
            "score": score_record.score if score_record else None,
            "band": get_score_band(score_record.score) if score_record else None,
            "computed_at": score_record.computed_at if score_record else None,
        },
    }


@router.patch("/me")
def update_me(body: UpdateProfileRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if body.name:
        current_user.name = body.name
    if body.language:
        current_user.language = body.language
    db.add(current_user)
    db.commit()
    return {"id": current_user.id, "name": current_user.name, "language": current_user.language}


@router.delete("/me", status_code=204)
def delete_me(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    db.delete(current_user)
    db.commit()


@router.get("/:id")
def get_user(id: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    score_record = get_latest_trust_score(user.id, db)
    return {
        "id": user.id,
        "name": user.name,
        "district": user.district,
        "state": user.state,
        "trust_score": score_record.score if score_record else None,
        "band": get_score_band(score_record.score) if score_record else None,
    }
