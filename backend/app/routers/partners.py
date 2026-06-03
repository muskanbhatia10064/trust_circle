import uuid
import hmac
import hashlib
from fastapi import APIRouter, Depends, HTTPException, Header, Request
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.database import get_db
from app.config import settings
from app.models import PartnerWebhook
from app.services import get_latest_trust_score

router = APIRouter(prefix="/partners", tags=["partners"])

PRICE_PER_CALL_PAISE = 100   # ₹1 per API call


class RegisterPartnerRequest(BaseModel):
    partner_name: str
    endpoint_url: str
    scopes: list[str]


@router.post("/register", status_code=201)
def register_partner(body: RegisterPartnerRequest, db: Session = Depends(get_db)):
    partner = PartnerWebhook(
        id=str(uuid.uuid4()),
        partner_name=body.partner_name,
        endpoint_url=body.endpoint_url,
        scopes=body.scopes,
    )
    db.add(partner)
    db.commit()
    return {"partner_id": partner.id, "message": "Partner registered. Use partner_id as API key."}


@router.get("/trust-score/{user_id}")
def partner_fetch_score(
    user_id: str,
    x_partner_id: str = Header(...),
    db: Session = Depends(get_db),
):
    partner = db.query(PartnerWebhook).filter(PartnerWebhook.id == x_partner_id).first()
    if not partner:
        raise HTTPException(status_code=401, detail="Unknown partner")
    if "trust_score" not in (partner.scopes or []):
        raise HTTPException(status_code=403, detail="Scope 'trust_score' not granted")

    record = get_latest_trust_score(user_id, db)
    if not record:
        raise HTTPException(status_code=404, detail="Score not found")

    partner.api_calls += 1
    partner.revenue_paise += PRICE_PER_CALL_PAISE
    db.add(partner)
    db.commit()

    return {"user_id": user_id, "score": record.score, "computed_at": record.computed_at}


@router.post("/webhook/inbound")
async def inbound_webhook(request: Request, x_signature: str = Header(None)):
    """Validates HMAC signature from partners and processes event."""
    body = await request.body()
    expected = hmac.new(settings.PARTNER_WEBHOOK_SECRET.encode(), body, hashlib.sha256).hexdigest()
    if not hmac.compare_digest(expected, x_signature or ""):
        raise HTTPException(status_code=401, detail="Invalid signature")
    return {"status": "received"}
