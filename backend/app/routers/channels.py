from fastapi import APIRouter, Form, Query
from fastapi.responses import PlainTextResponse
from app.services.ussd_gateway import handle_ussd
from app.services.ivr import build_ivr_response

router = APIRouter(tags=["channels"])


@router.post("/ussd", response_class=PlainTextResponse)
def ussd_endpoint(
    sessionId: str = Form(...),
    phoneNumber: str = Form(...),
    text: str = Form(""),
    serviceCode: str = Form(""),
):
    """
    *99# USSD gateway callback.
    Works on any feature phone — no internet required on the device side.
    """
    response_text = handle_ussd(sessionId, phoneNumber, text)
    return PlainTextResponse(content=response_text)


@router.post("/ivr/inbound")
def ivr_inbound(lang: str = Query("en"), action: str = Query("welcome")):
    """Exotel/Ozonetel inbound call webhook."""
    return build_ivr_response(lang, action, {})


@router.post("/ivr/menu")
def ivr_menu(digit: str = Form(""), lang: str = Query("en")):
    """Handles digit press from IVR menu."""
    action_map = {"1": "trust_score", "2": "circles", "9": "exit"}
    action = action_map.get(digit, "exit")
    return build_ivr_response(lang, action, {})
