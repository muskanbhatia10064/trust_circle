from datetime import datetime
from decimal import Decimal
from typing import Optional
from pydantic import BaseModel, EmailStr, Field, ConfigDict
from app.models import (
    UserRole,
    CircleStatus,
    ContributionStatus,
    PayoutStatus,
    FrequencyType
)
# =====================================================================
# Token Schemas
# =====================================================================
class Token(BaseModel):
    """
    Schema for JWT token responses, returning both access and refresh tokens.
    """
    access_token: str = Field(..., description="JWT access token used for API authentication")
    refresh_token: str = Field(..., description="JWT refresh token used to generate new access tokens")
    token_type: str = Field("bearer", description="Token authentication scheme type")
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                "token_type": "bearer"
            }
        }
    )
class TokenData(BaseModel):
    """
    Schema for decoding and validating JWT token payload data.
    """
    email: Optional[str] = Field(None, description="Subject email address extracted from JWT payload")
    role: Optional[UserRole] = Field(None, description="System authorization role extracted from JWT payload")
# =====================================================================
# User Schemas
# =====================================================================
class UserCreate(BaseModel):
    """
    Schema for user registration requests.
    """
    full_name: str = Field(
        ..., 
        min_length=2, 
        max_length=255, 
        description="User's full legal name",
        json_schema_extra={"example": "John Doe"}
    )
    email: EmailStr = Field(
        ..., 
        description="Unique email address for authentication and notices",
        json_schema_extra={"example": "john.doe@example.com"}
    )
    phone_number: str = Field(
        ..., 
        min_length=10, 
        max_length=50, 
        description="Unique phone number for SMS notices and verification",
        json_schema_extra={"example": "+1234567890"}
    )
    password: str = Field(
        ..., 
        min_length=8, 
        max_length=128, 
        description="Plaintext password, minimum 8 characters with upper/lower/digits",
        json_schema_extra={"example": "StrongPassword123!"}
    )
class UserLogin(BaseModel):
    """
    Schema for user authentication requests.
    """
    email: EmailStr = Field(
        ..., 
        description="User's registered email address",
        json_schema_extra={"example": "john.doe@example.com"}
    )
    password: str = Field(
        ..., 
        description="User's account password",
        json_schema_extra={"example": "StrongPassword123!"}
    )
class UserResponse(BaseModel):
    """
    Schema for user data returns. Hashed passwords are omitted for security.
    """
    id: int = Field(..., description="Unique database identifier for the user")
    full_name: str = Field(..., description="User's full legal name")
    email: EmailStr = Field(..., description="User's email address")
    phone_number: str = Field(..., description="User's phone number")
    role: UserRole = Field(..., description="System authorization clearance role")
    current_trust_score: Decimal = Field(..., description="Current trust rating, bounded between 0.00 and 100.00")
    is_verified: bool = Field(..., description="True if user has completed KYC/email validation")
    is_active: bool = Field(..., description="True if account is in good standing")
    created_at: datetime = Field(..., description="Timestamp when user registered")
    model_config = ConfigDict(
        from_attributes=True,
        json_schema_extra={
            "example": {
                "id": 1,
                "full_name": "John Doe",
                "email": "john.doe@example.com",
                "phone_number": "+1234567890",
                "role": "member",
                "current_trust_score": "100.00",
                "is_verified": True,
                "is_active": True,
                "created_at": "2026-06-03T12:00:00Z"
            }
        }
    )
# =====================================================================
# Circle Schemas
# =====================================================================
class CircleCreate(BaseModel):
    """
    Schema for creating a new savings circle.
    """
    name: str = Field(
        ..., 
        min_length=3, 
        max_length=255, 
        description="Unique name representing the savings circle",
        json_schema_extra={"example": "Family Savings Circle"}
    )
    description: Optional[str] = Field(
        None, 
        max_length=1000, 
        description="Detailed description or rules of the circle",
        json_schema_extra={"example": "Weekly contributions of 100 USD. 5 members max."}
    )
    contribution_amount: Decimal = Field(
        ..., 
        gt=0, 
        description="Fixed savings pool contribution amount per member",
        json_schema_extra={"example": "100.00"}
    )
    frequency: FrequencyType = Field(
        ..., 
        description="Cycle contribution period frequency",
        json_schema_extra={"example": "weekly"}
    )
    max_members: int = Field(
        ..., 
        gt=1, 
        description="Maximum capacity of members allowed in the circle",
        json_schema_extra={"example": 5}
    )
    payout_order_type: str = Field(
        "random", 
        max_length=50, 
        description="Order rule for circle payouts (e.g. random, trust-based, manual)",
        json_schema_extra={"example": "random"}
    )
class CircleUpdate(BaseModel):
    """
    Schema for updating savings circle parameters.
    """
    name: Optional[str] = Field(None, min_length=3, max_length=255, description="Updated name of the circle")
    description: Optional[str] = Field(None, max_length=1000, description="Updated description or rules")
    contribution_amount: Optional[Decimal] = Field(None, gt=0, description="Updated contribution amount")
    frequency: Optional[FrequencyType] = Field(None, description="Updated cycle frequency")
    max_members: Optional[int] = Field(None, gt=1, description="Updated maximum members capacity")
    current_round: Optional[int] = Field(None, ge=1, description="Updated active round of payouts")
    payout_order_type: Optional[str] = Field(None, max_length=50, description="Updated payout rule description")
    status: Optional[CircleStatus] = Field(None, description="Updated active status of the circle")
    start_date: Optional[datetime] = Field(None, description="Updated start date of the circle cycles")
    end_date: Optional[datetime] = Field(None, description="Updated end date of the circle cycles")
class CircleResponse(BaseModel):
    """
    Schema representing a savings circle data response.
    """
    id: int = Field(..., description="Unique circle database identifier")
    name: str = Field(..., description="Name of the savings circle")
    code: str = Field(..., description="Unique code used to search and join the circle")
    description: Optional[str] = Field(None, description="Description or rules of the circle")
    contribution_amount: Decimal = Field(..., description="Fixed contribution amount")
    frequency: FrequencyType = Field(..., description="Cycle frequency")
    max_members: int = Field(..., description="Maximum member capacity limit")
    current_member_count: int = Field(..., description="Current member subscription count")
    current_round: int = Field(..., description="Current running payout round")
    payout_order_type: str = Field(..., description="Rule format for payout distributions")
    status: CircleStatus = Field(..., description="Active state of the circle")
    created_by: int = Field(..., description="Database identifier of the circle creator")
    start_date: Optional[datetime] = Field(None, description="Circle start date")
    end_date: Optional[datetime] = Field(None, description="Circle end date")
    created_at: datetime = Field(..., description="Timestamp when circle was created")
    updated_at: datetime = Field(..., description="Timestamp when circle was last modified")
    model_config = ConfigDict(
        from_attributes=True,
        json_schema_extra={
            "example": {
                "id": 10,
                "name": "Family Savings Circle",
                "code": "CIRCLE-XYZ-123",
                "description": "Weekly contributions of 100 USD. 5 members max.",
                "contribution_amount": "100.00",
                "frequency": "weekly",
                "max_members": 5,
                "current_member_count": 1,
                "current_round": 1,
                "payout_order_type": "random",
                "status": "pending",
                "created_by": 1,
                "start_date": None,
                "end_date": None,
                "created_at": "2026-06-03T12:00:00Z",
                "updated_at": "2026-06-03T12:00:00Z"
            }
        }
    )
# =====================================================================
# Contribution Schemas
# =====================================================================
class ContributionCreate(BaseModel):
    """
    Schema for creating or scheduling a contribution record.
    """
    user_id: int = Field(..., description="Database identifier of the contributing member")
    circle_id: int = Field(..., description="Database identifier of the target circle")
    amount: Decimal = Field(..., gt=0, description="Amount paid or to be paid")
    due_date: datetime = Field(..., description="Date before which payment is required")
    status: ContributionStatus = Field(
        ContributionStatus.PENDING, 
        description="Active state of the contribution"
    )
class ContributionResponse(BaseModel):
    """
    Schema representing a contribution response.
    """
    id: int = Field(..., description="Unique contribution database identifier")
    user_id: int = Field(..., description="Database identifier of the contributing member")
    circle_id: int = Field(..., description="Database identifier of the target circle")
    amount: Decimal = Field(..., description="Contribution amount")
    due_date: datetime = Field(..., description="Deadline for payment")
    paid_date: Optional[datetime] = Field(None, description="Actual date when payment was cleared")
    status: ContributionStatus = Field(..., description="Contribution payment status")
    created_at: datetime = Field(..., description="Timestamp when contribution row was generated")
    model_config = ConfigDict(
        from_attributes=True,
        json_schema_extra={
            "example": {
                "id": 101,
                "user_id": 1,
                "circle_id": 10,
                "amount": "100.00",
                "due_date": "2026-06-10T23:59:59Z",
                "paid_date": "2026-06-09T14:30:00Z",
                "status": "paid",
                "created_at": "2026-06-03T12:00:00Z"
            }
        }
    )
# =====================================================================
# Payout Schemas
# =====================================================================
class PayoutCreate(BaseModel):
    """
    Schema for creating or scheduling a payout record.
    """
    circle_id: int = Field(..., description="Database identifier of the circle pool")
    receiver_id: int = Field(..., description="Database identifier of the payout beneficiary member")
    amount: Decimal = Field(..., gt=0, description="Amount to be paid out")
    payout_round: int = Field(..., ge=1, description="Payout round sequence number")
    status: PayoutStatus = Field(PayoutStatus.SCHEDULED, description="Payout round state")
class PayoutResponse(BaseModel):
    """
    Schema representing a payout record response.
    """
    id: int = Field(..., description="Unique payout database identifier")
    circle_id: int = Field(..., description="Database identifier of the circle pool")
    receiver_id: int = Field(..., description="Database identifier of the payout beneficiary member")
    amount: Decimal = Field(..., description="Payout amount disbursed")
    payout_round: int = Field(..., description="Payout cycle round")
    payout_date: Optional[datetime] = Field(None, description="Actual date when payout was disbursed")
    status: PayoutStatus = Field(..., description="Payout execution status")
    created_at: datetime = Field(..., description="Timestamp when payout row was generated")
    model_config = ConfigDict(
        from_attributes=True,
        json_schema_extra={
            "example": {
                "id": 201,
                "circle_id": 10,
                "receiver_id": 1,
                "amount": "500.00",
                "payout_round": 1,
                "payout_date": "2026-06-11T12:00:00Z",
                "status": "completed",
                "created_at": "2026-06-03T12:00:00Z"
            }
        }
    )
class RefreshTokenRequest(BaseModel):
    """
    Schema for refresh token requests.
    """
    refresh_token: str = Field(..., description="JWT refresh token to exchange for a new token pair")
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
            }
        }
    )
