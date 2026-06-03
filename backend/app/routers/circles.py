import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.database import get_db
from app.auth import get_current_user
from app.models import User, Circle, CircleMember, Transaction
from app.services import apply_reinsurance
from app.services.trust_score import compute_trust_score, save_trust_score, get_latest_trust_score

router = APIRouter(prefix="/circles", tags=["circles"])


class CreateCircleRequest(BaseModel):
    name: str
    contribution_amount: float
    cycle_days: int = 30


class ContributeRequest(BaseModel):
    amount: float


@router.post("/", status_code=201)
def create_circle(body: CreateCircleRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    circle = Circle(
        id=str(uuid.uuid4()),
        name=body.name,
        contribution_amount=body.contribution_amount,
        cycle_days=body.cycle_days,
        facilitator_id=current_user.id,
    )
    db.add(circle)
    # Auto-join creator as first member
    db.flush()
    member = CircleMember(id=str(uuid.uuid4()), circle_id=circle.id, user_id=current_user.id)
    db.add(member)
    db.commit()
    db.refresh(circle)
    return circle


@router.get("/")
def list_circles(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    memberships = db.query(CircleMember).filter(CircleMember.user_id == current_user.id).all()
    circle_ids = [m.circle_id for m in memberships]
    circles = db.query(Circle).filter(Circle.id.in_(circle_ids)).all()
    return circles


@router.post("/{circle_id}/join")
def join_circle(circle_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    circle = db.query(Circle).filter(Circle.id == circle_id).first()
    if not circle:
        raise HTTPException(status_code=404, detail="Circle not found")
    existing = db.query(CircleMember).filter(
        CircleMember.circle_id == circle_id, CircleMember.user_id == current_user.id
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Already a member")
    member = CircleMember(id=str(uuid.uuid4()), circle_id=circle_id, user_id=current_user.id)
    db.add(member)
    db.commit()
    return {"status": "joined", "circle_id": circle_id}


@router.post("/{circle_id}/contribute")
def contribute(
    circle_id: str,
    body: ContributeRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    circle = db.query(Circle).filter(Circle.id == circle_id).first()
    if not circle:
        raise HTTPException(status_code=404, detail="Circle not found")

    # 1. Deduct reinsurance buffer (0.5%) and update pool
    net = apply_reinsurance(circle, body.amount, db)

    # 2. Record transaction
    tx = Transaction(
        id=str(uuid.uuid4()),
        circle_id=circle_id,
        user_id=current_user.id,
        amount=body.amount,
        tx_type="contribution",
    )
    db.add(tx)
    db.commit()

    # 3. Auto-recompute trust score after payment — this is what makes the ring animate
    prev = get_latest_trust_score(current_user.id, db)
    new_score = compute_trust_score(current_user.id, db)
    save_trust_score(current_user.id, new_score, db)

    return {
        "net_to_pool": net,
        "pool_balance": circle.pool_balance,
        "reinsurance_balance": circle.reinsurance_balance,
        "trust_score": {
            "previous": prev.score if prev else new_score,
            "updated": new_score,
            "delta": round(new_score - (prev.score if prev else new_score), 2),
        },
    }


@router.get("/my")
def my_circles(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Alias: circles the current user belongs to."""
    return list_circles(current_user, db)


@router.post("/{circle_id}/leave")
def leave_circle(circle_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    member = db.query(CircleMember).filter(
        CircleMember.circle_id == circle_id, CircleMember.user_id == current_user.id
    ).first()
    if not member:
        raise HTTPException(status_code=404, detail="You are not in this circle")
    if member.received_payout:
        raise HTTPException(status_code=400, detail="Cannot leave after receiving payout")
    db.delete(member)
    db.commit()
    return {"status": "left", "circle_id": circle_id}


@router.get("/{circle_id}")
def get_circle(circle_id: str, db: Session = Depends(get_db)):
    circle = db.query(Circle).filter(Circle.id == circle_id).first()
    if not circle:
        raise HTTPException(status_code=404, detail="Circle not found")
    return circle


@router.get("/{circle_id}/members")
def get_members(circle_id: str, db: Session = Depends(get_db)):
    """Returns all members with their latest trust score and payment status."""
    members = db.query(CircleMember).filter(CircleMember.circle_id == circle_id).all()
    result = []
    for m in members:
        user = db.query(User).filter(User.id == m.user_id).first()
        score_record = get_latest_trust_score(m.user_id, db)
        last_tx = (
            db.query(Transaction)
            .filter(Transaction.user_id == m.user_id, Transaction.circle_id == circle_id)
            .order_by(Transaction.created_at.desc())
            .first()
        )
        result.append({
            "user_id": m.user_id,
            "name": user.name if user else "Unknown",
            "district": user.district if user else None,
            "state": user.state if user else None,
            "trust_score": score_record.score if score_record else None,
            "payment_status": "paid" if last_tx else "pending",
            "last_paid_amount": last_tx.amount if last_tx else None,
            "last_paid_at": last_tx.created_at if last_tx else None,
        })
    return result
