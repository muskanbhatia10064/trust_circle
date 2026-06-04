import enum
from datetime import datetime
from decimal import Decimal
from typing import List, Optional
from sqlalchemy import (
    ForeignKey, String, Text, Numeric, Boolean,
    Enum as SQLEnum, CheckConstraint, UniqueConstraint,
    func, Index, Float, Integer, DateTime, JSON
)
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base

class UserRole(str, enum.Enum):
    MEMBER = "member"
    ADMIN = "admin"

class CircleStatus(str, enum.Enum):
    PENDING = "pending"
    ACTIVE = "active"
    COMPLETED = "completed"
    ARCHIVED = "archived"
    forming = "forming"
    defaulted = "defaulted"

class MembershipStatus(str, enum.Enum):
    PENDING = "pending"
    ACTIVE = "active"
    LEFT = "left"
    BANNED = "banned"

class ContributionStatus(str, enum.Enum):
    PENDING = "pending"
    PAID = "paid"
    LATE = "late"
    MISSED = "missed"

class PayoutStatus(str, enum.Enum):
    SCHEDULED = "scheduled"
    COMPLETED = "completed"
    FAILED = "failed"

class TransactionStatus(str, enum.Enum):
    PENDING = "pending"
    SUCCESS = "success"
    FAILED = "failed"

class TransactionType(str, enum.Enum):
    CONTRIBUTION = "contribution"
    PAYOUT = "payout"
    ADJUSTMENT = "adjustment"

class FrequencyType(str, enum.Enum):
    WEEKLY = "weekly"
    MONTHLY = "monthly"

class Gender(str, enum.Enum):
    male = "male"
    female = "female"
    other = "other"
    prefer_not_to_say = "prefer_not_to_say"

class User(Base):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(primary_key=True)
    full_name: Mapped[str] = mapped_column(String(255), nullable=False)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    phone_number: Mapped[str] = mapped_column(String(50), unique=True, index=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[UserRole] = mapped_column(SQLEnum(UserRole), default=UserRole.MEMBER, nullable=False)
    current_trust_score: Mapped[Decimal] = mapped_column(Numeric(5, 2), default=Decimal("100.00"), nullable=False)
    is_verified: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    phone: Mapped[Optional[str]] = mapped_column(String(50), nullable=True, index=True)
    name: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    gender: Mapped[Optional[Gender]] = mapped_column(SQLEnum(Gender), nullable=True)
    district: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    state: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    language: Mapped[str] = mapped_column(String(10), default="en", nullable=False)
    is_facilitator: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    created_at: Mapped[datetime] = mapped_column(server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(server_default=func.now(), onupdate=func.now(), nullable=False)
    __table_args__ = (CheckConstraint("current_trust_score >= 0.00 AND current_trust_score <= 100.00", name="chk_user_trust_score_bounds"),)
    created_circles: Mapped[list["Circle"]] = relationship("Circle", foreign_keys="[Circle.created_by]", back_populates="creator", cascade="all, delete-orphan", lazy="select")
    memberships: Mapped[list["Membership"]] = relationship("Membership", back_populates="user", cascade="all, delete-orphan", lazy="select")
    contributions: Mapped[list["Contribution"]] = relationship("Contribution", back_populates="user", lazy="select")
    payouts: Mapped[list["Payout"]] = relationship("Payout", back_populates="receiver", lazy="select")
    transactions_sent: Mapped[list["Transaction"]] = relationship("Transaction", foreign_keys="[Transaction.sender_id]", back_populates="sender", lazy="select")
    transactions_received: Mapped[list["Transaction"]] = relationship("Transaction", foreign_keys="[Transaction.receiver_id]", back_populates="receiver", lazy="select")
    trust_score_history: Mapped[list["TrustScore"]] = relationship("TrustScore", back_populates="user", cascade="all, delete-orphan", lazy="select")
    consents: Mapped[list["ConsentRecord"]] = relationship("ConsentRecord", back_populates="user", lazy="select")

class Circle(Base):
    __tablename__ = "circles"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(255), index=True, nullable=False)
    code: Mapped[str] = mapped_column(String(50), unique=True, index=True, nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    contribution_amount: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    frequency: Mapped[FrequencyType] = mapped_column(SQLEnum(FrequencyType), nullable=False)
    max_members: Mapped[int] = mapped_column(nullable=False)
    current_member_count: Mapped[int] = mapped_column(default=0, nullable=False)
    current_round: Mapped[int] = mapped_column(default=1, nullable=False)
    payout_order_type: Mapped[str] = mapped_column(String(50), default="random", nullable=False)
    status: Mapped[CircleStatus] = mapped_column(SQLEnum(CircleStatus), default=CircleStatus.PENDING, nullable=False)
    created_by: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="RESTRICT"), nullable=False)
    pool_balance: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    reinsurance_balance: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    cycle_days: Mapped[int] = mapped_column(Integer, default=30, nullable=False)
    facilitator_id: Mapped[Optional[int]] = mapped_column(ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    start_date: Mapped[Optional[datetime]] = mapped_column(nullable=True)
    end_date: Mapped[Optional[datetime]] = mapped_column(nullable=True)
    created_at: Mapped[datetime] = mapped_column(server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(server_default=func.now(), onupdate=func.now(), nullable=False)
    __table_args__ = (
        CheckConstraint("contribution_amount > 0", name="chk_circle_contribution_amount_positive"),
        CheckConstraint("max_members > 1", name="chk_circle_max_members_min"),
    )
    creator: Mapped["User"] = relationship("User", foreign_keys=[created_by], back_populates="created_circles", lazy="select")
    memberships: Mapped[list["Membership"]] = relationship("Membership", back_populates="circle", cascade="all, delete-orphan", lazy="select")
    contributions: Mapped[list["Contribution"]] = relationship("Contribution", back_populates="circle", cascade="all, delete-orphan", lazy="select")
    payouts: Mapped[list["Payout"]] = relationship("Payout", back_populates="circle", cascade="all, delete-orphan", lazy="select")
    transactions: Mapped[list["Transaction"]] = relationship("Transaction", back_populates="circle", lazy="select")

class Membership(Base):
    __tablename__ = "memberships"
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    circle_id: Mapped[int] = mapped_column(ForeignKey("circles.id", ondelete="CASCADE"), nullable=False)
    joined_at: Mapped[datetime] = mapped_column(server_default=func.now(), nullable=False)
    status: Mapped[MembershipStatus] = mapped_column(SQLEnum(MembershipStatus), default=MembershipStatus.PENDING, nullable=False)
    position_in_payout_queue: Mapped[Optional[int]] = mapped_column(nullable=True)
    payout_order: Mapped[Optional[int]] = mapped_column(nullable=True)
    received_payout: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    __table_args__ = (UniqueConstraint("user_id", "circle_id", name="uq_user_circle_membership"), Index("idx_membership_user_id", "user_id"), Index("idx_membership_circle_id", "circle_id"),)
    user: Mapped["User"] = relationship("User", back_populates="memberships", lazy="select")
    circle: Mapped["Circle"] = relationship("Circle", back_populates="memberships", lazy="select")

class Contribution(Base):
    __tablename__ = "contributions"
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="RESTRICT"), nullable=False)
    circle_id: Mapped[int] = mapped_column(ForeignKey("circles.id", ondelete="CASCADE"), nullable=False)
    amount: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    due_date: Mapped[datetime] = mapped_column(nullable=False)
    paid_date: Mapped[Optional[datetime]] = mapped_column(nullable=True)
    status: Mapped[ContributionStatus] = mapped_column(SQLEnum(ContributionStatus), default=ContributionStatus.PENDING, nullable=False)
    created_at: Mapped[datetime] = mapped_column(server_default=func.now(), nullable=False)
    __table_args__ = (CheckConstraint("amount > 0", name="chk_contribution_amount_positive"), Index("idx_contribution_user_circle", "user_id", "circle_id"),)
    user: Mapped["User"] = relationship("User", back_populates="contributions", lazy="select")
    circle: Mapped["Circle"] = relationship("Circle", back_populates="contributions", lazy="select")

class Payout(Base):
    __tablename__ = "payouts"
    id: Mapped[int] = mapped_column(primary_key=True)
    circle_id: Mapped[int] = mapped_column(ForeignKey("circles.id", ondelete="CASCADE"), nullable=False)
    receiver_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="RESTRICT"), nullable=False)
    amount: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    payout_round: Mapped[int] = mapped_column(nullable=False)
    payout_date: Mapped[Optional[datetime]] = mapped_column(nullable=True)
    status: Mapped[PayoutStatus] = mapped_column(SQLEnum(PayoutStatus), default=PayoutStatus.SCHEDULED, nullable=False)
    created_at: Mapped[datetime] = mapped_column(server_default=func.now(), nullable=False)
    __table_args__ = (UniqueConstraint("circle_id", "payout_round", name="uq_circle_payout_round"), CheckConstraint("amount > 0", name="chk_payout_amount_positive"),)
    circle: Mapped["Circle"] = relationship("Circle", back_populates="payouts", lazy="select")
    receiver: Mapped["User"] = relationship("User", back_populates="payouts", lazy="select")

class Transaction(Base):
    __tablename__ = "transactions"
    id: Mapped[int] = mapped_column(primary_key=True)
    sender_id: Mapped[Optional[int]] = mapped_column(ForeignKey("users.id", ondelete="RESTRICT"), nullable=True)
    receiver_id: Mapped[Optional[int]] = mapped_column(ForeignKey("users.id", ondelete="RESTRICT"), nullable=True)
    amount: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    transaction_type: Mapped[Optional[TransactionType]] = mapped_column(SQLEnum(TransactionType), nullable=True)
    status: Mapped[TransactionStatus] = mapped_column(SQLEnum(TransactionStatus), default=TransactionStatus.PENDING, nullable=False)
    reference_id: Mapped[Optional[str]] = mapped_column(String(255), unique=True, index=True, nullable=True)
    circle_id: Mapped[Optional[int]] = mapped_column(ForeignKey("circles.id", ondelete="SET NULL"), nullable=True)
    user_id: Mapped[Optional[int]] = mapped_column(ForeignKey("users.id", ondelete="RESTRICT"), nullable=True)
    tx_type: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    created_at: Mapped[datetime] = mapped_column(server_default=func.now(), nullable=False)
    __table_args__ = (CheckConstraint("amount > 0", name="chk_transaction_amount_positive"),)
    sender: Mapped[Optional["User"]] = relationship("User", foreign_keys=[sender_id], back_populates="transactions_sent", lazy="select")
    receiver: Mapped[Optional["User"]] = relationship("User", foreign_keys=[receiver_id], back_populates="transactions_received", lazy="select")
    circle: Mapped[Optional["Circle"]] = relationship("Circle", back_populates="transactions", lazy="select")

class TrustScore(Base):
    __tablename__ = "trust_scores"
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    previous_score: Mapped[Decimal] = mapped_column(Numeric(5, 2), nullable=False)
    new_score: Mapped[Decimal] = mapped_column(Numeric(5, 2), nullable=False)
    reason: Mapped[str] = mapped_column(String(500), nullable=False)
    score: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    computed_at: Mapped[Optional[datetime]] = mapped_column(nullable=True)
    features: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    model_version: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    created_at: Mapped[datetime] = mapped_column(server_default=func.now(), nullable=False)
    __table_args__ = (Index("idx_trust_score_user_created", "user_id", "created_at"),)
    user: Mapped["User"] = relationship("User", back_populates="trust_score_history", lazy="select")

class ConsentRecord(Base):
    __tablename__ = "consent_records"
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    purpose: Mapped[str] = mapped_column(String(255), nullable=False)
    granted: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    granted_at: Mapped[Optional[datetime]] = mapped_column(nullable=True)
    revoked_at: Mapped[Optional[datetime]] = mapped_column(nullable=True)
    user: Mapped["User"] = relationship("User", back_populates="consents", lazy="select")

class FairnessAudit(Base):
    __tablename__ = "fairness_audits"
    id: Mapped[int] = mapped_column(primary_key=True)
    audit_date: Mapped[datetime] = mapped_column(server_default=func.now(), nullable=False)
    dimension: Mapped[str] = mapped_column(String(50), nullable=False)
    group_a: Mapped[str] = mapped_column(String(255), nullable=False)
    group_b: Mapped[str] = mapped_column(String(255), nullable=False)
    mean_score_a: Mapped[float] = mapped_column(Float, nullable=False)
    mean_score_b: Mapped[float] = mapped_column(Float, nullable=False)
    disparity: Mapped[float] = mapped_column(Float, nullable=False)
    retraining_triggered: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

class PartnerWebhook(Base):
    __tablename__ = "partner_webhooks"
    id: Mapped[int] = mapped_column(primary_key=True)
    partner_name: Mapped[str] = mapped_column(String(255), nullable=False)
    endpoint_url: Mapped[str] = mapped_column(String(500), nullable=False)
    scopes: Mapped[Optional[list]] = mapped_column(JSON, nullable=True)
    api_calls: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    revenue_paise: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    created_at: Mapped[datetime] = mapped_column(server_default=func.now(), nullable=False)
