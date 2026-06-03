"""
USSD Gateway handler for *99# sessions.
Provider posts: sessionId, serviceCode, phoneNumber, text
"""
from fastapi import Request
from fastapi.responses import PlainTextResponse

MENU_ROOT = (
    "CON Welcome to TrustCircle\n"
    "1. My Trust Score\n"
    "2. My Circles\n"
    "3. Pay Contribution\n"
    "4. Help"
)

LANGUAGES = {
    "1": "English", "2": "Hindi", "3": "Tamil",
    "4": "Telugu", "5": "Marathi", "6": "Bengali",
}


def handle_ussd(session_id: str, phone: str, text: str) -> str:
    parts = text.split("*") if text else []
    depth = len(parts)

    if depth == 0 or text == "":
        return MENU_ROOT

    if parts[0] == "1":
        return "END Your Trust Score will be sent via SMS."

    if parts[0] == "2":
        return "END Your active circles will be sent via SMS."

    if parts[0] == "3":
        if depth == 1:
            return "CON Enter Circle ID:"
        circle_id = parts[1]
        if depth == 2:
            return f"CON Enter amount to contribute to circle {circle_id}:"
        amount = parts[2]
        return f"END Contribution of ₹{amount} to circle {circle_id} recorded. Thank you!"

    if parts[0] == "4":
        return "END For help call 1800-XXX-XXXX (toll-free) or visit your local NGO coordinator."

    return "END Invalid option. Please try again."
