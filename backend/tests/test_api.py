import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.main import app
from app.database import Base, get_db

SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base.metadata.create_all(bind=engine)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)


def test_health():
    res = client.get("/health")
    assert res.status_code == 200
    assert res.json() == {"status": "ok"}


def test_register_and_login():
    res = client.post("/auth/register", json={
        "phone": "9999999999", "name": "Test User", "password": "secret123"
    })
    assert res.status_code == 201

    res = client.post("/auth/login", data={"username": "9999999999", "password": "secret123"})
    assert res.status_code == 200
    assert "access_token" in res.json()


def test_ussd_endpoint():
    res = client.post("/ussd", data={"sessionId": "s1", "phoneNumber": "9999999999", "text": ""})
    assert res.status_code == 200
    assert "TrustCircle" in res.text
