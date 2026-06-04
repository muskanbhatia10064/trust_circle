import random
import string
import base64
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.database import get_db
from app.auth import get_current_user
from app.models import User, Circle, Membership, Transaction
from app.services import apply_reinsurance
from app.services.trust_score import compute_trust_score, save_trust_score, get_latest_trust_score

router = APIRouter(prefix="/circles", tags=["circles"])


class CreateCircleRequest(BaseModel):
    name: str
    contribution_amount: float
    cycle_days: int = 30
    upi_id: str = ""


class UpiIdRequest(BaseModel):
    upi_id: str


class ContributeRequest(BaseModel):
    amount: float


class InviteRequest(BaseModel):
    phone: str


class TicketRequest(BaseModel):
    against_user_id: int
    reason: str


def _circle_dict(circle):
    return {
        "id": circle.id,
        "name": circle.name,
        "code": circle.code,
        "contribution_amount": float(circle.contribution_amount),
        "cycle_days": circle.cycle_days,
        "frequency": circle.frequency.value if hasattr(circle.frequency, "value") else circle.frequency,
        "max_members": circle.max_members,
        "current_member_count": circle.current_member_count,
        "current_round": circle.current_round,
        "pool_balance": circle.pool_balance,
        "reinsurance_balance": circle.reinsurance_balance,
        "status": circle.status.value if hasattr(circle.status, "value") else circle.status,
        "created_by": circle.created_by,
        "upi_id": circle.upi_id,
        "upi_qr_image": circle.upi_qr_image,
        "current_payout_receiver_id": circle.current_payout_receiver_id,
        "payout_receiver_confirmed": circle.payout_receiver_confirmed,
        "created_at": circle.created_at.isoformat(),
    }


def _gen_code():
    return "TC-" + "".join(random.choices(string.ascii_uppercase + string.digits, k=6))


@router.post("/", status_code=201)
def create_circle(body: CreateCircleRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    circle = Circle(
        name=body.name,
        code=_gen_code(),
        contribution_amount=body.contribution_amount,
        cycle_days=body.cycle_days,
        frequency="monthly",
        max_members=20,
        created_by=current_user.id,
        facilitator_id=current_user.id,
        upi_id=body.upi_id or None,
    )
    db.add(circle)
    db.flush()
    member = Membership(circle_id=circle.id, user_id=current_user.id)
    db.add(member)
    db.commit()
    db.refresh(circle)
    return _circle_dict(circle)


@router.get("/")
def list_circles(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    memberships = db.query(Membership).filter(Membership.user_id == current_user.id).all()
    circle_ids = [m.circle_id for m in memberships]
    circles = db.query(Circle).filter(Circle.id.in_(circle_ids)).all()
    return [_circle_dict(c) for c in circles]


@router.post("/{circle_id}/join")
def join_circle(circle_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    circle = db.query(Circle).filter(Circle.id == circle_id).first()
    if not circle:
        raise HTTPException(status_code=404, detail="Circle not found")
    existing = db.query(Membership).filter(
        Membership.circle_id == circle_id, Membership.user_id == current_user.id
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Already a member")
    member = Membership(circle_id=circle_id, user_id=current_user.id)
    db.add(member)
    db.commit()
    return {"status": "joined", "circle_id": circle_id}


@router.post("/{circle_id}/contribute")
def contribute(
    circle_id: int,
    body: ContributeRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    circle = db.query(Circle).filter(Circle.id == circle_id).first()
    if not circle:
        raise HTTPException(status_code=404, detail="Circle not found")

    net = apply_reinsurance(circle, body.amount, db)

    tx = Transaction(
        circle_id=circle_id,
        user_id=current_user.id,
        amount=body.amount,
        tx_type="contribution",
    )
    db.add(tx)
    db.commit()

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
    return list_circles(current_user, db)


@router.post("/{circle_id}/leave")
def leave_circle(circle_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    member = db.query(Membership).filter(
        Membership.circle_id == circle_id, Membership.user_id == current_user.id
    ).first()
    if not member:
        raise HTTPException(status_code=404, detail="You are not in this circle")
    if member.received_payout:
        raise HTTPException(status_code=400, detail="Cannot leave after receiving payout")
    db.delete(member)
    db.commit()
    return {"status": "left", "circle_id": circle_id}


@router.get("/{circle_id}")
def get_circle(circle_id: int, db: Session = Depends(get_db)):
    circle = db.query(Circle).filter(Circle.id == circle_id).first()
    if not circle:
        raise HTTPException(status_code=404, detail="Circle not found")
    return _circle_dict(circle)


@router.post("/{circle_id}/upload-qr")
async def upload_qr(
    circle_id: int,
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    circle = db.query(Circle).filter(Circle.id == circle_id).first()
    if not circle:
        raise HTTPException(status_code=404, detail="Circle not found")
    allowed = circle.current_payout_receiver_id == current_user.id or \
              (circle.current_payout_receiver_id is None and circle.created_by == current_user.id)
    if not allowed:
        raise HTTPException(status_code=403, detail="Only the current payout receiver can upload QR")
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    contents = await file.read()
    if len(contents) > 2 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="Image too large. Max 2MB.")
    b64 = base64.b64encode(contents).decode("utf-8")
    circle.upi_qr_image = f"data:{file.content_type};base64,{b64}"
    db.commit()
    return {"message": "QR uploaded successfully"}


@router.post("/{circle_id}/upi-id")
def update_upi_id(
    circle_id: int,
    body: UpiIdRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    circle = db.query(Circle).filter(Circle.id == circle_id).first()
    if not circle:
        raise HTTPException(status_code=404, detail="Circle not found")
    if circle.created_by != current_user.id:
        raise HTTPException(status_code=403, detail="Only the circle creator can update UPI ID")
    circle.upi_id = body.upi_id
    db.commit()
    return {"message": "UPI ID updated", "upi_id": circle.upi_id}


@router.get("/{circle_id}/payout-status")
def get_payout_status(circle_id: int, db: Session = Depends(get_db)):
    circle = db.query(Circle).filter(Circle.id == circle_id).first()
    if not circle:
        raise HTTPException(status_code=404, detail="Circle not found")
    receiver = None
    if circle.current_payout_receiver_id:
        u = db.query(User).filter(User.id == circle.current_payout_receiver_id).first()
        if u:
            receiver = {"id": u.id, "name": u.full_name or u.name, "phone": u.phone_number}
    return {
        "current_receiver": receiver,
        "upi_qr_image": circle.upi_qr_image,
        "upi_id": circle.upi_id,
        "confirmed": circle.payout_receiver_confirmed,
        "round": circle.current_round,
    }


@router.post("/{circle_id}/assign-receiver")
def assign_receiver(
    circle_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    circle = db.query(Circle).filter(Circle.id == circle_id).first()
    if not circle:
        raise HTTPException(status_code=404, detail="Circle not found")
    if circle.created_by != current_user.id:
        raise HTTPException(status_code=403, detail="Only creator can assign receiver")
    pending = db.query(Membership).filter(
        Membership.circle_id == circle_id,
        Membership.received_payout == False
    ).all()
    if not pending:
        raise HTTPException(status_code=400, detail="All members have received payout. Circle complete!")
    chosen = random.choice(pending)
    circle.current_payout_receiver_id = chosen.user_id
    circle.upi_qr_image = None
    circle.upi_id = None
    circle.payout_receiver_confirmed = False
    db.commit()
    receiver = db.query(User).filter(User.id == chosen.user_id).first()
    return {
        "message": f"{receiver.full_name or receiver.name} selected as this month's receiver",
        "receiver_id": chosen.user_id,
        "receiver_name": receiver.full_name or receiver.name,
    }


@router.post("/{circle_id}/confirm-received")
def confirm_received(
    circle_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    circle = db.query(Circle).filter(Circle.id == circle_id).first()
    if not circle:
        raise HTTPException(status_code=404, detail="Circle not found")
    if circle.current_payout_receiver_id != current_user.id:
        raise HTTPException(status_code=403, detail="Only the current receiver can confirm")
    other_members = db.query(Membership).filter(
        Membership.circle_id == circle_id,
        Membership.user_id != current_user.id,
        Membership.status == "active"
    ).all()
    non_payers = [
        m.user_id for m in other_members
        if not db.query(Transaction).filter(
            Transaction.circle_id == circle_id,
            Transaction.user_id == m.user_id,
            Transaction.tx_type == "contribution"
        ).first()
    ]
    if non_payers:
        raise HTTPException(
            status_code=400,
            detail=f"{len(non_payers)} member(s) haven't paid yet. Cannot confirm until all members pay."
        )
    membership = db.query(Membership).filter(
        Membership.circle_id == circle_id,
        Membership.user_id == current_user.id
    ).first()
    if membership:
        membership.received_payout = True
    circle.upi_qr_image = None
    circle.upi_id = None
    circle.payout_receiver_confirmed = True
    circle.current_payout_receiver_id = None
    circle.current_round += 1
    db.commit()
    return {"message": "Payout confirmed! QR removed. Next round ready.", "round": circle.current_round}


@router.post("/{circle_id}/invite")
def invite_member(
    circle_id: int,
    body: InviteRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Admin adds a member by phone number."""
    circle = db.query(Circle).filter(Circle.id == circle_id).first()
    if not circle:
        raise HTTPException(status_code=404, detail="Circle not found")
    if circle.created_by != current_user.id:
        raise HTTPException(status_code=403, detail="Only the circle admin can invite members")
    target = db.query(User).filter(User.phone_number == body.phone).first()
    if not target:
        raise HTTPException(status_code=404, detail=f"No user found with phone {body.phone}")
    existing = db.query(Membership).filter(
        Membership.circle_id == circle_id, Membership.user_id == target.id
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="User is already in this circle")
    db.add(Membership(circle_id=circle_id, user_id=target.id))
    db.commit()
    return {"message": f"{target.full_name or target.name} added to circle", "user_id": target.id}


@router.get("/{circle_id}/invite-link")
def get_invite_link(
    circle_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Returns the circle join code/link for sharing."""
    circle = db.query(Circle).filter(Circle.id == circle_id).first()
    if not circle:
        raise HTTPException(status_code=404, detail="Circle not found")
    if circle.created_by != current_user.id:
        raise HTTPException(status_code=403, detail="Only the circle admin can get the invite link")
    return {"code": circle.code, "link": f"Join TrustCircle '{circle.name}' using code: {circle.code}"}


@router.post("/{circle_id}/raise-ticket")
def raise_ticket(
    circle_id: int,
    body: TicketRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Admin raises a dispute ticket against a non-paying member."""
    from datetime import datetime
    circle = db.query(Circle).filter(Circle.id == circle_id).first()
    if not circle:
        raise HTTPException(status_code=404, detail="Circle not found")
    if circle.created_by != current_user.id:
        raise HTTPException(status_code=403, detail="Only the circle admin can raise tickets")
    target = db.query(User).filter(User.id == body.against_user_id).first()
    if not target:
        raise HTTPException(status_code=404, detail="User not found")
    membership = db.query(Membership).filter(
        Membership.circle_id == circle_id, Membership.user_id == body.against_user_id
    ).first()
    if not membership:
        raise HTTPException(status_code=404, detail="User is not in this circle")
    from sqlalchemy import text
    db.execute(text(
        "INSERT INTO dispute_tickets (circle_id, raised_by, against_user_id, reason) VALUES (:c, :r, :a, :reason)"
    ), {"c": circle_id, "r": current_user.id, "a": body.against_user_id, "reason": body.reason})
    db.commit()
    return {
        "message": f"Ticket raised against {target.full_name or target.name}",
        "against": target.full_name or target.name,
        "reason": body.reason,
    }


@router.get("/{circle_id}/tickets")
def get_tickets(
    circle_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get all dispute tickets for a circle (admin only)."""
    circle = db.query(Circle).filter(Circle.id == circle_id).first()
    if not circle:
        raise HTTPException(status_code=404, detail="Circle not found")
    if circle.created_by != current_user.id:
        raise HTTPException(status_code=403, detail="Only the circle admin can view tickets")
    from sqlalchemy import text
    rows = db.execute(text(
        "SELECT dt.id, dt.against_user_id, dt.reason, dt.status, dt.created_at, u.full_name, u.phone_number "
        "FROM dispute_tickets dt JOIN users u ON u.id = dt.against_user_id "
        "WHERE dt.circle_id = :c ORDER BY dt.created_at DESC"
    ), {"c": circle_id}).fetchall()
    return [{"id": r[0], "against_user_id": r[1], "reason": r[2], "status": r[3], "created_at": str(r[4]), "name": r[5], "phone": r[6]} for r in rows]


@router.get("/{circle_id}/members")
def get_members(circle_id: int, db: Session = Depends(get_db)):
    members = db.query(Membership).filter(Membership.circle_id == circle_id).all()
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
            "name": user.full_name or user.name if user else "Unknown",
            "district": user.district if user else None,
            "state": user.state if user else None,
            "trust_score": score_record.score if score_record else None,
            "payment_status": "paid" if last_tx else "pending",
            "last_paid_amount": float(last_tx.amount) if last_tx else None,
            "last_paid_at": last_tx.created_at.isoformat() if last_tx else None,
        })
    return result
