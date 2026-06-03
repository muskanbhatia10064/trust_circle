import logging
from typing import Generator
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from app.config import settings

logger = logging.getLogger("database")

# ----------------------------------------------------
# Environment-Specific Connection Pool Tuning
# ----------------------------------------------------
if settings.is_production:
    POOL_SIZE = 20
    MAX_OVERFLOW = 10
    POOL_TIMEOUT = 30
    POOL_RECYCLE = 1800
else:
    POOL_SIZE = 5
    MAX_OVERFLOW = 5
    POOL_TIMEOUT = 30
    POOL_RECYCLE = 3600

# ----------------------------------------------------
# Database Engine
# ----------------------------------------------------
engine = create_engine(
    settings.DATABASE_URL,
    pool_size=POOL_SIZE,
    max_overflow=MAX_OVERFLOW,
    pool_timeout=POOL_TIMEOUT,
    pool_recycle=POOL_RECYCLE,
    pool_pre_ping=True,
    echo=settings.debug
)

# ----------------------------------------------------
# Session Factory
# ----------------------------------------------------
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# ----------------------------------------------------
# Declarative Base (uses repo's DeclarativeBase pattern)
# ----------------------------------------------------
class Base(DeclarativeBase):
    pass

# ----------------------------------------------------
# FastAPI Dependency
# ----------------------------------------------------
def get_db() -> Generator:
    """
    Yields a database session and ensures it is closed after each request.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ----------------------------------------------------
# Health Check Utility
# ----------------------------------------------------
def test_database_connection() -> bool:
    """
    Lightweight connectivity check. Returns True if DB is reachable.
    """
    try:
        with SessionLocal() as db:
            db.execute(text("SELECT 1"))
        return True
    except Exception as e:
        logger.error(f"Database connectivity test failed: {e}", exc_info=True)
        return False
