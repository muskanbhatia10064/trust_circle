from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.auth import get_current_user
from app.models import User, TrustScore, Circle, CircleMember
from app.services import compute_trust_score, save_trust_score, get_latest_trust_score, get_previous_trust_score, run_fairness_audit

router = APIRouter(prefix="/trust-score", tags=["trust-score"])


@router.post("/compute")
def compute(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    score = compute_trust_score(current_user.id, db)
    record = save_trust_score(current_user.id, score, db)
    return {"score": record.score, "computed_at": record.computed_at, "model_version": record.model_version}


@router.get("/me")
def my_score(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """
    Returns current score + previous score.
    Frontend uses both to animate the ring from old value → new value.
    """
    record = get_latest_trust_score(current_user.id, db)
    if not record:
        raise HTTPException(status_code=404, detail="No trust score yet. POST /trust-score/compute first.")
    prev = get_previous_trust_score(current_user.id, db)
    return {
        "score": record.score,
        "previous_score": prev.score if prev else record.score,
        "computed_at": record.computed_at,
        "model_version": record.model_version,
    }


@router.post("/fairness-audit")
def fairness_audit(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
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
    record = get_latest_trust_score(user_id, db)
    if not record:
        raise HTTPException(status_code=404, detail="Score not found")
    return {"user_id": user_id, "score": record.score, "computed_at": record.computed_at}


@router.get("/admin/stats")
def admin_stats(db: Session = Depends(get_db)):
    """
    Powers the live impact counter on the demo dashboard.
    Returns: users_count, total_pooled, circles_count
    """
    users_count = db.query(User).count()
    circles_count = db.query(Circle).count()
    total_pooled = db.query(Circle).with_entities(
        __import__('sqlalchemy').func.sum(Circle.pool_balance)
    ).scalar() or 0.0
    return {
        "credit_identities_created": users_count,
        "total_pooled": round(total_pooled, 2),
        "active_circles": circles_count,
    }
