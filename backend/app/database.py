from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker
from app.config import settings

# Use SQLite for demo if DATABASE_URL not set
db_url = settings.DATABASE_URL if hasattr(settings, 'DATABASE_URL') and settings.DATABASE_URL else "sqlite:///./trustcircle.db"
engine = create_engine(db_url, connect_args={"check_same_thread": False} if "sqlite" in db_url else {})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    pass


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
