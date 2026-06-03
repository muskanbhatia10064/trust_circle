from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.auth import get_current_user
from app.models import User
from app.services import compute_trust_score, save_trust_score, get_latest_trust_score, run_fairness_audit

router = APIRouter(prefix="/trust-score", tags=["trust-score"])


@router.post("/compute")
def compute(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    score = compute_trust_score(current_user.id, db)
    record = save_trust_score(current_user.id, score, db)
    return {"score": record.score, "computed_at": record.computed_at, "model_version": record.model_version}


@router.get("/me")
def my_score(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    record = get_latest_trust_score(current_user.id, db)
    if not record:
        raise HTTPException(status_code=404, detail="No trust score yet. POST /trust-score/compute first.")
    return {"score": record.score, "computed_at": record.computed_at}


@router.post("/fairness-audit")
def fairness_audit(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Runs monthly fairness audit. Restrict to admin role in production."""
    audits = run_fairness_audit(db)
    return {
        "audits_created": len(audits),
        "retraining_triggers": [
            {"dimension": a.dimension, "groups": f"{a.group_a} vs {a.group_b}", "disparity": a.disparity}
            for a in audits if a.retraining_triggered
        ],
    }


@router.get("/partner/{user_id}")
def partner_trust_score(user_id: str, db: Session = Depends(get_db)):
    """OAuth2-scoped endpoint for NBFC/MFI partners."""
    record = get_latest_trust_score(user_id, db)
    if not record:
        raise HTTPException(status_code=404, detail="User not found or no score available")
    return {"user_id": user_id, "score": record.score, "computed_at": record.computed_at}
