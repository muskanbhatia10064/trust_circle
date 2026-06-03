"""
Voice IVR handler for Exotel/Ozonetel callbacks.
Returns XML response that instructs the IVR to play the appropriate prompt.
"""
from fastapi.responses import Response

IVR_LANGUAGES = [
    "English", "Hindi", "Tamil", "Telugu", "Marathi",
    "Bengali", "Gujarati", "Kannada", "Malayalam",
    "Odia", "Punjabi", "Urdu",
]

AUDIO_BASE = "https://cdn.trustcircle.in/ivr"


def build_ivr_response(lang: str, action: str, data: dict) -> Response:
    """
    Builds Exotel-compatible XML for a given language and action.
    """
    lang_code = lang.lower()[:2]
    if action == "welcome":
        xml = f"""<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Play>{AUDIO_BASE}/{lang_code}/welcome.mp3</Play>
  <Gather numDigits="1" action="/ivr/menu?lang={lang_code}">
    <Play>{AUDIO_BASE}/{lang_code}/menu_prompt.mp3</Play>
  </Gather>
</Response>"""
    elif action == "trust_score":
        score = data.get("score", "N/A")
        xml = f"""<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say language="{lang_code}">Your Trust Score is {score}.</Say>
  <Hangup/>
</Response>"""
    else:
        xml = """<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say>Thank you for calling TrustCircle. Goodbye.</Say>
  <Hangup/>
</Response>"""

    return Response(content=xml, media_type="application/xml")
