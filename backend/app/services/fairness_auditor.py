import pandas as pd
from datetime import datetime
from itertools import combinations
from sqlalchemy.orm import Session
from app.models import TrustScore, User, FairnessAudit
from app.config import settings


def run_fairness_audit(db: Session) -> list[FairnessAudit]:
    """
    Monthly bias check on Trust Scores across gender and geography.
    Triggers retraining flag if disparity > FAIRNESS_DISPARITY_THRESHOLD.
    """
    rows = (
        db.query(TrustScore.score, User.gender, User.state)
        .join(User, User.id == TrustScore.user_id)
        .all()
    )
    if not rows:
        return []

    df = pd.DataFrame(rows, columns=["score", "gender", "state"])
    audits = []

    for dimension, col in [("gender", "gender"), ("geography", "state")]:
        group_means = df.groupby(col)["score"].mean().dropna()
        if len(group_means) < 2:
            continue
        for (g_a, mean_a), (g_b, mean_b) in combinations(group_means.items(), 2):
            if mean_a == 0:
                continue
            disparity = abs(mean_a - mean_b) / mean_a
            triggered = disparity > settings.FAIRNESS_DISPARITY_THRESHOLD
            audit = FairnessAudit(
                audit_date=datetime.utcnow(),
                dimension=dimension,
                group_a=str(g_a),
                group_b=str(g_b),
                mean_score_a=round(mean_a, 2),
                mean_score_b=round(mean_b, 2),
                disparity=round(disparity, 4),
                retraining_triggered=triggered,
                notes="Auto-triggered retraining" if triggered else None,
            )
            db.add(audit)
            audits.append(audit)

    db.commit()
    return audits
