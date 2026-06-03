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


# ── helpers ────────────────────────────────────────────────────
def register_and_login(phone="9999999999", password="secret123", name="Priya Sharma"):
    client.post("/auth/register", json={"phone": phone, "name": name, "password": password})
    res = client.post("/auth/login", data={"username": phone, "password": password})
    return res.json()["access_token"]


def auth(token):
    return {"Authorization": f"Bearer {token}"}


# ── basic ───────────────────────────────────────────────────────
def test_health():
    assert client.get("/health").json() == {"status": "ok"}


def test_register_and_login():
    res = client.post("/auth/register", json={"phone": "8888888888", "name": "Rahul Verma", "password": "pass"})
    assert res.status_code == 201
    res = client.post("/auth/login", data={"username": "8888888888", "password": "pass"})
    assert "access_token" in res.json()


# ── circle endpoints ────────────────────────────────────────────
def test_create_circle():
    token = register_and_login("7777777777", "pass", "Sunita Devi")
    res = client.post("/circles/", json={"name": "Mahila Bachat Mandal", "contribution_amount": 1500}, headers=auth(token))
    assert res.status_code == 201
    assert res.json()["name"] == "Mahila Bachat Mandal"


def test_contribute_updates_trust_score():
    """Core demo test: paying contribution must update trust score."""
    token = register_and_login("6666666666", "pass", "Amit Yadav")

    # Create circle
    circle = client.post("/circles/", json={"name": "Kisan Group", "contribution_amount": 2000}, headers=auth(token)).json()
    circle_id = circle["id"]

    # Compute initial score
    client.post("/trust-score/compute", headers=auth(token))
    before = client.get("/trust-score/me", headers=auth(token)).json()["score"]

    # Pay contribution
    res = client.post(f"/circles/{circle_id}/contribute", json={"amount": 2000}, headers=auth(token))
    assert res.status_code == 200
    data = res.json()

    # Trust score must be returned and updated
    assert "trust_score" in data
    assert data["trust_score"]["updated"] >= before   # score should go up after payment
    assert data["trust_score"]["delta"] >= 0


def test_reinsurance_deducted():
    """0.5% of contribution must go to reinsurance buffer."""
    token = register_and_login("5555555555", "pass", "Meera Patel")
    circle = client.post("/circles/", json={"name": "Varanasi Circle", "contribution_amount": 1000}, headers=auth(token)).json()

    res = client.post(f"/circles/{circle['id']}/contribute", json={"amount": 1000}, headers=auth(token)).json()
    assert res["reinsurance_balance"] == 5.0   # 0.5% of 1000
    assert res["net_to_pool"] == 995.0


# ── trust score endpoints ───────────────────────────────────────
def test_trust_score_me_returns_previous_score():
    """GET /trust-score/me must return both score and previous_score for ring animation."""
    token = register_and_login("4444444444", "pass", "Geeta Singh")
    client.post("/trust-score/compute", headers=auth(token))
    client.post("/trust-score/compute", headers=auth(token))  # second compute = previous exists
    res = client.get("/trust-score/me", headers=auth(token)).json()
    assert "score" in res
    assert "previous_score" in res


def test_admin_stats():
    """GET /trust-score/admin/stats must return impact counter data."""
    res = client.get("/trust-score/admin/stats")
    assert res.status_code == 200
    data = res.json()
    assert "credit_identities_created" in data
    assert "total_pooled" in data
    assert "active_circles" in data


# ── ussd ────────────────────────────────────────────────────────
def test_ussd_welcome():
    res = client.post("/ussd", data={"sessionId": "s1", "phoneNumber": "9999999999", "text": ""})
    assert res.status_code == 200
    assert "TrustCircle" in res.text


def test_ussd_contribution_flow():
    res = client.post("/ussd", data={"sessionId": "s2", "phoneNumber": "9999999999", "text": "3*CIRCLE123*1500"})
    assert "1500" in res.text

