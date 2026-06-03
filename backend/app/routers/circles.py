import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.database import get_db
from app.auth import get_current_user
from app.models import User, Circle, CircleMember, Transaction
from app.services import apply_reinsurance

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
    db.commit()
    db.refresh(circle)
    return circle


@router.get("/")
def list_circles(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    memberships = db.query(CircleMember).filter(CircleMember.user_id == current_user.id).all()
    circle_ids = [m.circle_id for m in memberships]
    return db.query(Circle).filter(Circle.id.in_(circle_ids)).all()


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
def contribute(circle_id: str, body: ContributeRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    circle = db.query(Circle).filter(Circle.id == circle_id).first()
    if not circle:
        raise HTTPException(status_code=404, detail="Circle not found")
    net = apply_reinsurance(circle, body.amount, db)
    tx = Transaction(
        id=str(uuid.uuid4()),
        circle_id=circle_id,
        user_id=current_user.id,
        amount=body.amount,
        tx_type="contribution",
    )
    db.add(tx)
    db.commit()
    return {"net_to_pool": net, "pool_balance": circle.pool_balance, "reinsurance_balance": circle.reinsurance_balance}


@router.get("/{circle_id}")
def get_circle(circle_id: str, db: Session = Depends(get_db)):
    circle = db.query(Circle).filter(Circle.id == circle_id).first()
    if not circle:
        raise HTTPException(status_code=404, detail="Circle not found")
    return circle
