from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import Base, engine
from app.routers import (
    auth_router, trust_score_router, circles_router,
    consent_router, partners_router, channels_router, facilitator_router,
)
from app.routers.users import router as users_router

Base.metadata.create_all(bind=engine)

app = FastAPI(title="TrustCircle API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(users_router)
app.include_router(trust_score_router)
app.include_router(circles_router)
app.include_router(consent_router)
app.include_router(partners_router)
app.include_router(channels_router)
app.include_router(facilitator_router)


@app.get("/health")
def health():
    return {"status": "ok"}
