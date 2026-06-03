import uuid
from datetime import datetime
from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.database import get_db
from app.auth import get_current_user
from app.models import User, ConsentRecord, TrustScore, Circle, CircleMember

router = APIRouter(prefix="/consent", tags=["consent"])

VALID_PURPOSES = ["trust_score", "partner_api", "marketing", "analytics", "data_portability"]


class ConsentRequest(BaseModel):
    purpose: str
    granted: bool


@router.post("/")
def update_consent(body: ConsentRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    record = db.query(ConsentRecord).filter(
        ConsentRecord.user_id == current_user.id,
        ConsentRecord.purpose == body.purpose
    ).first()
    now = datetime.utcnow()
    if record:
        record.granted = body.granted
        record.granted_at = now if body.granted else record.granted_at
        record.revoked_at = now if not body.granted else None
    else:
        record = ConsentRecord(
            id=str(uuid.uuid4()),
            user_id=current_user.id,
            purpose=body.purpose,
            granted=body.granted,
            granted_at=now if body.granted else None,
        )
        db.add(record)
    db.commit()
    return {"purpose": body.purpose, "granted": body.granted}


@router.get("/")
def list_consents(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    records = db.query(ConsentRecord).filter(ConsentRecord.user_id == current_user.id).all()
    return [{"purpose": r.purpose, "granted": r.granted, "granted_at": r.granted_at, "revoked_at": r.revoked_at} for r in records]


@router.get("/export")
def export_financial_passport(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Financial Passport — full data portability export per DPDP Act 2023."""
    scores = db.query(TrustScore).filter(TrustScore.user_id == current_user.id).all()
    memberships = db.query(CircleMember).filter(CircleMember.user_id == current_user.id).all()
    passport = {
        "user": {"id": current_user.id, "phone": current_user.phone, "name": current_user.name},
        "trust_scores": [{"score": s.score, "computed_at": str(s.computed_at)} for s in scores],
        "circles": [{"circle_id": m.circle_id, "joined_at": str(m.joined_at)} for m in memberships],
        "exported_at": str(datetime.utcnow()),
    }
    return JSONResponse(content=passport, headers={"Content-Disposition": "attachment; filename=financial_passport.json"})
