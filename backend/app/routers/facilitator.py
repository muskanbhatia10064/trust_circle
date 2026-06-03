from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.database import get_db
from app.auth import get_current_user
from app.models import User, Membership, Transaction, Circle
from app.services import apply_reinsurance

router = APIRouter(prefix="/facilitator", tags=["facilitator"])


def require_facilitator(current_user: User = Depends(get_current_user)):
    if not current_user.is_facilitator:
        raise HTTPException(status_code=403, detail="Facilitator role required")
    return current_user


class ProxyContributionRequest(BaseModel):
    member_phone: str
    circle_id: int
    amount: float


class AddOfflineMemberRequest(BaseModel):
    phone: str
    name: str
    circle_id: int


@router.post("/add-member", status_code=201)
def add_offline_member(
    body: AddOfflineMemberRequest,
    facilitator: User = Depends(require_facilitator),
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(User.phone == body.phone).first()
    if not user:
        user = User(
            phone=body.phone,
            name=body.name,
            full_name=body.name,
            email=f"{body.phone}@offline.local",
            phone_number=body.phone,
            hashed_password="OFFLINE_USER",
        )
        db.add(user)
        db.flush()

    circle = db.query(Circle).filter(Circle.id == body.circle_id).first()
    if not circle:
        raise HTTPException(status_code=404, detail="Circle not found")

    existing = db.query(Membership).filter(
        Membership.circle_id == body.circle_id, Membership.user_id == user.id
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="User already in circle")

    member = Membership(circle_id=body.circle_id, user_id=user.id)
    db.add(member)
    db.commit()
    return {"status": "member_added", "user_id": user.id}


@router.post("/proxy-contribution")
def proxy_contribution(
    body: ProxyContributionRequest,
    facilitator: User = Depends(require_facilitator),
    db: Session = Depends(get_db),
):
    member = db.query(User).filter(User.phone == body.member_phone).first()
    if not member:
        raise HTTPException(status_code=404, detail="Member not found")
    circle = db.query(Circle).filter(Circle.id == body.circle_id).first()
    if not circle:
        raise HTTPException(status_code=404, detail="Circle not found")

    net = apply_reinsurance(circle, body.amount, db)
    tx = Transaction(
        circle_id=body.circle_id,
        user_id=member.id,
        amount=body.amount,
        tx_type="contribution",
    )
    db.add(tx)
    db.commit()
    return {"net_to_pool": net, "recorded_by_facilitator": facilitator.id}
