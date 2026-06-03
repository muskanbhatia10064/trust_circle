import uuid
from sqlalchemy.orm import Session
from app.models import TrustScore, User, Transaction


def compute_trust_score(user_id: str, db: Session) -> float:
    """
    Lightweight heuristic trust scorer.
    Replace with trained ML model in production.
    Features: repayment rate, circle tenure, contribution consistency.
    """
    transactions = db.query(Transaction).filter(Transaction.user_id == user_id).all()
    contributions = [t for t in transactions if t.tx_type == "contribution"]

    base_score = 500.0
    if contributions:
        base_score += min(len(contributions) * 10, 200)   # up to +200 for consistency

    # Penalise missed cycles (no contributions in last 30 days placeholder)
    score = min(max(base_score, 300), 900)
    return round(score, 2)


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
