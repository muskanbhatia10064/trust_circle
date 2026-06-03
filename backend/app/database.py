import logging
from typing import Generator
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from app.config import settings

logger = logging.getLogger("database")

is_sqlite = settings.DATABASE_URL.startswith("sqlite")

if is_sqlite:
    engine = create_engine(
        settings.DATABASE_URL,
        connect_args={"check_same_thread": False},
        echo=False,
    )
else:
    POOL_SIZE = 20 if settings.is_production else 5
    engine = create_engine(
        settings.DATABASE_URL,
        pool_size=POOL_SIZE,
        max_overflow=10,
        pool_timeout=30,
        pool_recycle=1800 if settings.is_production else 3600,
        pool_pre_ping=True,
        echo=False,
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    pass


def get_db() -> Generator:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def test_database_connection() -> bool:
    try:
        with SessionLocal() as db:
            db.execute(text("SELECT 1"))
        return True
    except Exception as e:
        logger.error(f"Database connectivity test failed: {e}")
        return False
