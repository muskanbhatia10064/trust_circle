from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.models import TrustScore, Transaction


def compute_trust_score(user_id: str, db: Session) -> float:
    """
    Trust Score algorithm (matches spec):
      base(100) + onTimeBonus + completionBonus + participationBonus - missPenalty

      onTimeBonus       = onTimePayments     x 40  (max 600)
      completionBonus   = circlesCompleted   x 80  (max 240)
      participationBonus= circlesJoined      x 10  (max  60)
      missPenalty       = missedPayments     x 60

    Result clamped to [0, 1000]
    """
    from app.models import Membership

    contributions = (
        db.query(Transaction)
        .filter(Transaction.user_id == user_id, Transaction.tx_type == "contribution")
        .all()
    )

    recent_cutoff = datetime.utcnow() - timedelta(days=30)
    on_time = len([t for t in contributions if t.created_at and t.created_at >= recent_cutoff])
    missed  = max(0, len(contributions) // 3)   # heuristic: 1 miss per 3 payments

    memberships    = db.query(Membership).filter(Membership.user_id == user_id).count()
    completed      = db.query(Membership).filter(
        Membership.user_id == user_id, Membership.received_payout == True
    ).count()

    score = (
        100
        + min(on_time  * 40, 600)
        + min(completed * 80, 240)
        + min(memberships * 10, 60)
        - (missed * 60)
    )
    return round(float(min(max(score, 0), 1000)), 2)


def get_score_band(score: float) -> str:
    if score >= 800: return "EXCELLENT"
    if score >= 600: return "GOOD"
    if score >= 400: return "FAIR"
    return "POOR"


def save_trust_score(user_id: str, score: float, db: Session, model_version: str = "v1") -> TrustScore:
    prev = get_latest_trust_score(user_id, db)
    prev_score = prev.score if prev else score
    record = TrustScore(
        user_id=user_id,
        score=score,
        previous_score=min(max(round(prev_score / 10, 2), 0), 100),
        new_score=min(max(round(score / 10, 2), 0), 100),
        reason="auto-computed",
        model_version=model_version,
        features={"raw_score": score},
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return record


def get_latest_trust_score(user_id: str, db: Session) -> TrustScore | None:
    return (
        db.query(TrustScore)
        .filter(TrustScore.user_id == user_id)
        .order_by(TrustScore.computed_at.desc())
        .first()
    )


def get_previous_trust_score(user_id: str, db: Session) -> TrustScore | None:
    """Returns the second-latest score — used by frontend to animate ring from old → new."""
    records = (
        db.query(TrustScore)
        .filter(TrustScore.user_id == user_id)
        .order_by(TrustScore.computed_at.desc())
        .limit(2)
        .all()
    )
    return records[1] if len(records) >= 2 else None
