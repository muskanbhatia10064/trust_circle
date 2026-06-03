from app.config import settings
from app.models import Circle
from sqlalchemy.orm import Session


def apply_reinsurance(circle: Circle, contribution: float, db: Session) -> float:
    """
    Deducts REINSURANCE_RATE from contribution, credits circle.reinsurance_balance.
    Returns the net amount added to pool_balance.
    """
    buffer = round(contribution * settings.REINSURANCE_RATE, 2)
    net = round(contribution - buffer, 2)
    circle.reinsurance_balance = round((circle.reinsurance_balance or 0) + buffer, 2)
    circle.pool_balance = round((circle.pool_balance or 0) + net, 2)
    db.add(circle)
    db.commit()
    return net
