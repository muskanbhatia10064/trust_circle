import enum
from datetime import datetime
from sqlalchemy import (
    Column, String, Integer, Float, Boolean, DateTime,
    ForeignKey, Enum, Text, JSON
)
from sqlalchemy.orm import relationship
from app.database import Base


class Gender(str, enum.Enum):
    male = "male"
    female = "female"
    other = "other"
    prefer_not_to_say = "prefer_not_to_say"


class CircleStatus(str, enum.Enum):
    forming = "forming"
    active = "active"
    completed = "completed"
    defaulted = "defaulted"


class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True)
    phone = Column(String, unique=True, nullable=False, index=True)
    name = Column(String, nullable=False)
    gender = Column(Enum(Gender), nullable=True)
    district = Column(String, nullable=True)
    state = Column(String, nullable=True)
    language = Column(String, default="en")
    is_facilitator = Column(Boolean, default=False)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    trust_scores = relationship("TrustScore", back_populates="user")
    memberships = relationship("CircleMember", back_populates="user")
    consents = relationship("ConsentRecord", back_populates="user")


class TrustScore(Base):
    __tablename__ = "trust_scores"

    id = Column(String, primary_key=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    score = Column(Float, nullable=False)
    computed_at = Column(DateTime, default=datetime.utcnow)
    features = Column(JSON)          # raw feature snapshot
    model_version = Column(String)

    user = relationship("User", back_populates="trust_scores")


class Circle(Base):
    __tablename__ = "circles"

    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    contribution_amount = Column(Float, nullable=False)
    cycle_days = Column(Integer, default=30)
    status = Column(Enum(CircleStatus), default=CircleStatus.forming)
    pool_balance = Column(Float, default=0.0)
    reinsurance_balance = Column(Float, default=0.0)
    facilitator_id = Column(String, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    members = relationship("CircleMember", back_populates="circle")
    transactions = relationship("Transaction", back_populates="circle")


class CircleMember(Base):
    __tablename__ = "circle_members"

    id = Column(String, primary_key=True)
    circle_id = Column(String, ForeignKey("circles.id"))
    user_id = Column(String, ForeignKey("users.id"))
    joined_at = Column(DateTime, default=datetime.utcnow)
    payout_order = Column(Integer, nullable=True)
    received_payout = Column(Boolean, default=False)

    circle = relationship("Circle", back_populates="members")
    user = relationship("User", back_populates="memberships")


class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(String, primary_key=True)
    circle_id = Column(String, ForeignKey("circles.id"))
    user_id = Column(String, ForeignKey("users.id"))
    amount = Column(Float, nullable=False)
    tx_type = Column(String)          # contribution | payout | reinsurance
    created_at = Column(DateTime, default=datetime.utcnow)

    circle = relationship("Circle", back_populates="transactions")


class ConsentRecord(Base):
    __tablename__ = "consent_records"

    id = Column(String, primary_key=True)
    user_id = Column(String, ForeignKey("users.id"))
    purpose = Column(String, nullable=False)   # e.g. "trust_score", "partner_api"
    granted = Column(Boolean, default=False)
    granted_at = Column(DateTime, nullable=True)
    revoked_at = Column(DateTime, nullable=True)

    user = relationship("User", back_populates="consents")


class FairnessAudit(Base):
    __tablename__ = "fairness_audits"

    id = Column(String, primary_key=True)
    audit_date = Column(DateTime, default=datetime.utcnow)
    dimension = Column(String)        # "gender" | "geography"
    group_a = Column(String)
    group_b = Column(String)
    mean_score_a = Column(Float)
    mean_score_b = Column(Float)
    disparity = Column(Float)
    retraining_triggered = Column(Boolean, default=False)
    notes = Column(Text, nullable=True)


class PartnerWebhook(Base):
    __tablename__ = "partner_webhooks"

    id = Column(String, primary_key=True)
    partner_name = Column(String)
    endpoint_url = Column(String)
    scopes = Column(JSON)             # list of allowed scopes
    api_calls = Column(Integer, default=0)
    revenue_paise = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
