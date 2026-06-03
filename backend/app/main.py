from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import engine, Base, test_database_connection
from app.routers import (
    auth_router, trust_score_router, circles_router,
    consent_router, partners_router, channels_router, facilitator_router,
)

# =====================================================================
# Lifespan — table creation on startup
# =====================================================================
@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    yield

# =====================================================================
# FastAPI Application
# =====================================================================
app = FastAPI(
    title=settings.project_name,
    openapi_url=f"{settings.api_v1_prefix}/openapi.json",
    docs_url=f"{settings.api_v1_prefix}/docs",
    redoc_url=f"{settings.api_v1_prefix}/redoc",
    lifespan=lifespan
)

# =====================================================================
# CORS Middleware
# =====================================================================
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =====================================================================
# Router Registration (all Person 2 & 3 routers preserved)
# =====================================================================
app.include_router(auth_router)
app.include_router(trust_score_router)
app.include_router(circles_router)
app.include_router(consent_router)
app.include_router(partners_router)
app.include_router(channels_router)
app.include_router(facilitator_router)

# =====================================================================
# Base Endpoints
# =====================================================================
@app.get("/")
def read_root():
    return {
        "message": "TrustCircle API Running",
        "project": settings.project_name,
        "environment": settings.env,
        "docs": f"{settings.api_v1_prefix}/docs",
    }

@app.get("/health")
def read_health():
    db_connected = test_database_connection()
    if not db_connected:
        return {
            "status": "unhealthy",
            "database": "disconnected",
            "message": "Failed to connect to the backend database server"
        }
    return {"status": "healthy", "database": "connected"}
