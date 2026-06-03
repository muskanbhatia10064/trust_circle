from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app.auth import get_current_user
from app.models import User, TrustScore, Circle, CircleMember
from app.services import compute_trust_score, save_trust_score, get_latest_trust_score, get_previous_trust_score, run_fairness_audit
from app.services.trust_score import get_score_band

router = APIRouter(prefix="/trust-score", tags=["trust-score"])


def _score_response(record: TrustScore, previous: TrustScore | None) -> dict:
    return {
        "score": record.score,
        "band": get_score_band(record.score),
        "previous_score": previous.score if previous else record.score,
        "computed_at": record.computed_at,
        "model_version": record.model_version,
    }


@router.post("/recalculate")
def recalculate(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    score = compute_trust_score(current_user.id, db)
    record = save_trust_score(current_user.id, score, db)
    prev = get_previous_trust_score(current_user.id, db)
    return _score_response(record, prev)


@router.post("/compute")  # alias kept for backward compat
def compute(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return recalculate(current_user, db)


@router.get("/me")
def my_score(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    record = get_latest_trust_score(current_user.id, db)
    if not record:
        raise HTTPException(status_code=404, detail="No trust score yet. POST /trust-score/recalculate first.")
    prev = get_previous_trust_score(current_user.id, db)
    return _score_response(record, prev)


@router.get("/leaderboard")
def leaderboard(db: Session = Depends(get_db)):
    """Top 10 trust scores across all users."""
    subq = (
        db.query(TrustScore.user_id, func.max(TrustScore.computed_at).label("latest"))
        .group_by(TrustScore.user_id)
        .subquery()
    )
    records = (
        db.query(TrustScore)
        .join(subq, (TrustScore.user_id == subq.c.user_id) & (TrustScore.computed_at == subq.c.latest))
        .order_by(TrustScore.score.desc())
        .limit(10)
        .all()
    )
    result = []
    for r in records:
        user = db.query(User).filter(User.id == r.user_id).first()
        result.append({
            "rank": len(result) + 1,
            "name": user.name if user else "Unknown",
            "district": user.district if user else None,
            "score": r.score,
            "band": get_score_band(r.score),
        })
    return result


@router.get("/user/{user_id}")
def user_score(user_id: str, db: Session = Depends(get_db)):
    record = get_latest_trust_score(user_id, db)
    if not record:
        raise HTTPException(status_code=404, detail="Score not found")
    return {"user_id": user_id, "score": record.score, "band": get_score_band(record.score), "computed_at": record.computed_at}


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


@router.get("/admin/stats")
def admin_stats(db: Session = Depends(get_db)):
    users_count  = db.query(User).count()
    circles_count = db.query(Circle).count()
    total_pooled = db.query(func.sum(Circle.pool_balance)).scalar() or 0.0
    return {
        "credit_identities_created": users_count,
        "total_pooled": round(total_pooled, 2),
        "active_circles": circles_count,
    }
