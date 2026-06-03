import uuid
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.models import TrustScore, Transaction


def compute_trust_score(user_id: str, db: Session) -> float:
    """
    Heuristic trust scorer — 3 signals:
      1. Total contributions (consistency)     → up to +200 pts
      2. Average contribution amount (capacity) → up to +100 pts
      3. Recent activity in last 30 days        → +50 pts bonus
    Range: 300 – 900
    """
    contributions = (
        db.query(Transaction)
        .filter(Transaction.user_id == user_id, Transaction.tx_type == "contribution")
        .all()
    )

    base = 500.0

    if contributions:
        # Signal 1: consistency — each payment adds 15 pts, capped at +200
        base += min(len(contributions) * 15, 200)

        # Signal 2: average amount — ₹500 avg = +20, ₹2000 avg = +100
        avg_amount = sum(t.amount for t in contributions) / len(contributions)
        base += min((avg_amount / 2000) * 100, 100)

        # Signal 3: paid in last 30 days → +50 bonus
        recent_cutoff = datetime.utcnow() - timedelta(days=30)
        recent = [t for t in contributions if t.created_at and t.created_at >= recent_cutoff]
        if recent:
            base += 50

    return round(min(max(base, 300), 900), 2)


def save_trust_score(user_id: str, score: float, db: Session, model_version: str = "v1") -> TrustScore:
    record = TrustScore(
        id=str(uuid.uuid4()),
        user_id=user_id,
        score=score,
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
