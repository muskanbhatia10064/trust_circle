import logging
import sys
from datetime import datetime, timedelta
from decimal import Decimal
from typing import Dict, List
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.database import SessionLocal, engine, Base
from app.models import (
    User,
    Circle,
    Membership,
    Contribution,
    TrustScore,
    UserRole,
    CircleStatus,
    MembershipStatus,
    ContributionStatus,
    FrequencyType
)
from app.auth import hash_password
# Setup logging configuration
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger("seed")
def seed_users(db: Session) -> Dict[str, User]:
    """
    Seeds the database with demo users. 
    Returns a dictionary mapping emails to User objects.
    """
    logger.info("Seeding users...")
    demo_users_data = [
        {
            "full_name": "Priya Sharma",
            "email": "priya.sharma@example.com",
            "phone_number": "+919876543210",
            "role": UserRole.ADMIN,
            "current_trust_score": Decimal("100.00"),
            "is_verified": True
        },
        {
            "full_name": "Rahul Verma",
            "email": "rahul.verma@example.com",
            "phone_number": "+919876543211",
            "role": UserRole.MEMBER,
            "current_trust_score": Decimal("95.50"),
            "is_verified": True
        },
        {
            "full_name": "Sunita Devi",
            "email": "sunita.devi@example.com",
            "phone_number": "+919876543212",
            "role": UserRole.MEMBER,
            "current_trust_score": Decimal("90.00"),
            "is_verified": True
        },
        {
            "full_name": "Amit Yadav",
            "email": "amit.yadav@example.com",
            "phone_number": "+919876543213",
            "role": UserRole.MEMBER,
            "current_trust_score": Decimal("92.00"),
            "is_verified": True
        },
        {
            "full_name": "Meera Patel",
            "email": "meera.patel@example.com",
            "phone_number": "+919876543214",
            "role": UserRole.MEMBER,
            "current_trust_score": Decimal("88.00"),
            "is_verified": False
        }
    ]
    users_map: Dict[str, User] = {}
    default_password_hash = hash_password("DemoPassword123!")
    for data in demo_users_data:
        # Check if user already exists (Idempotency)
        stmt = select(User).where(User.email == data["email"])
        existing_user = db.scalar(stmt)
        
        if existing_user:
            logger.info(f"User {data['full_name']} already exists. Skipping.")
            users_map[data["email"]] = existing_user
        else:
            new_user = User(
                full_name=data["full_name"],
                email=data["email"],
                phone_number=data["phone_number"],
                hashed_password=default_password_hash,
                role=data["role"],
                current_trust_score=data["current_trust_score"],
                is_verified=data["is_verified"],
                is_active=True
            )
            db.add(new_user)
            db.flush()  # Populates new_user.id for relationships
            users_map[data["email"]] = new_user
            logger.info(f"Created user: {data['full_name']}")
    return users_map
def seed_circles(db: Session, users_map: Dict[str, User]) -> Dict[str, Circle]:
    """
    Seeds the database with savings circles.
    Returns a dictionary mapping circle names to Circle objects.
    """
    logger.info("Seeding circles...")
    demo_circles_data = [
        {
            "name": "Mahila Bachat Mandal",
            "code": "MANDAL-2026-01",
            "description": "Weekly savings circle for women empowerment and small retail trading.",
            "contribution_amount": Decimal("500.00"),
            "frequency": FrequencyType.WEEKLY,
            "max_members": 10,
            "payout_order_type": "trust-based",
            "created_by_email": "priya.sharma@example.com"
        },
        {
            "name": "Kisan Sahayata Group",
            "code": "KISAN-2026-02",
            "description": "Monthly cooperative savings pool for agrarian tools and seed procurement.",
            "contribution_amount": Decimal("1000.00"),
            "frequency": FrequencyType.MONTHLY,
            "max_members": 8,
            "payout_order_type": "random",
            "created_by_email": "priya.sharma@example.com"
        },
        {
            "name": "Varanasi Vyapar Circle",
            "code": "VYAPAR-2026-03",
            "description": "High-value monthly circle for local commercial textile merchants.",
            "contribution_amount": Decimal("5000.00"),
            "frequency": FrequencyType.MONTHLY,
            "max_members": 12,
            "payout_order_type": "manual",
            "created_by_email": "amit.yadav@example.com"
        }
    ]
    circles_map: Dict[str, Circle] = {}
    for data in demo_circles_data:
        # Check if circle already exists (Idempotency)
        stmt = select(Circle).where(Circle.code == data["code"])
        existing_circle = db.scalar(stmt)
        if existing_circle:
            logger.info(f"Circle {data['name']} already exists. Skipping.")
            circles_map[data["name"]] = existing_circle
        else:
            creator = users_map.get(data["created_by_email"])
            if not creator:
                logger.error(f"Creator email {data['created_by_email']} not found. Skipping circle {data['name']}.")
                continue
            new_circle = Circle(
                name=data["name"],
                code=data["code"],
                description=data["description"],
                contribution_amount=data["contribution_amount"],
                frequency=data["frequency"],
                max_members=data["max_members"],
                current_member_count=0,  # Updated dynamically when seeding memberships
                current_round=1,
                payout_order_type=data["payout_order_type"],
                status=CircleStatus.PENDING,
                created_by=creator.id
            )
            db.add(new_circle)
            db.flush()  # Populates new_circle.id
            circles_map[data["name"]] = new_circle
            logger.info(f"Created circle: {data['name']}")
    return circles_map
def seed_memberships(db: Session, users_map: Dict[str, User], circles_map: Dict[str, Circle]) -> None:
    """
    Seeds memberships connecting users to circles and updates the member counts.
    """
    logger.info("Seeding memberships...")
    memberships_to_create = [
        # Mahila Bachat Mandal memberships
        ("priya.sharma@example.com", "Mahila Bachat Mandal", 1),
        ("rahul.verma@example.com", "Mahila Bachat Mandal", 2),
        ("sunita.devi@example.com", "Mahila Bachat Mandal", 3),
        ("meera.patel@example.com", "Mahila Bachat Mandal", 4),
        # Kisan Sahayata Group memberships
        ("rahul.verma@example.com", "Kisan Sahayata Group", 1),
        ("sunita.devi@example.com", "Kisan Sahayata Group", 2),
        ("amit.yadav@example.com", "Kisan Sahayata Group", 3),
        # Varanasi Vyapar Circle memberships
        ("amit.yadav@example.com", "Varanasi Vyapar Circle", 1),
        ("priya.sharma@example.com", "Varanasi Vyapar Circle", 2),
        ("meera.patel@example.com", "Varanasi Vyapar Circle", 3),
    ]
    for email, circle_name, position in memberships_to_create:
        user = users_map.get(email)
        circle = circles_map.get(circle_name)
        if not user or not circle:
            logger.error(f"Cannot create membership for {email} and {circle_name}. Missing references.")
            continue
        # Check duplicate membership (Idempotency)
        stmt = select(Membership).where(
            Membership.user_id == user.id, 
            Membership.circle_id == circle.id
        )
        existing_membership = db.scalar(stmt)
        if existing_membership:
            logger.info(f"Membership for {user.full_name} in {circle.name} already exists. Skipping.")
        else:
            new_membership = Membership(
                user_id=user.id,
                circle_id=circle.id,
                status=MembershipStatus.ACTIVE,
                position_in_payout_queue=position
            )
            db.add(new_membership)
            
            # Increment circle current_member_count
            circle.current_member_count += 1
            if circle.current_member_count >= circle.max_members:
                circle.status = CircleStatus.ACTIVE
                circle.start_date = datetime.now()
                
            db.add(circle)
            logger.info(f"Subscribed user {user.full_name} to circle {circle.name}")
def seed_contributions(db: Session, users_map: Dict[str, User], circles_map: Dict[str, Circle]) -> None:
    """
    Seeds sample contribution histories.
    """
    logger.info("Seeding contributions...")
    # Seed 1 Paid and 1 Pending contribution for a couple of members in Mahila Bachat Mandal
    mandal_circle = circles_map.get("Mahila Bachat Mandal")
    kisan_circle = circles_map.get("Kisan Sahayata Group")
    if mandal_circle:
        # Priya Sharma contribution in Mahila Bachat Mandal (PAID)
        priya = users_map.get("priya.sharma@example.com")
        if priya:
            stmt = select(Contribution).where(
                Contribution.user_id == priya.id,
                Contribution.circle_id == mandal_circle.id,
                Contribution.due_date == datetime.now().date() - timedelta(days=2)
            )
            if not db.scalar(stmt):
                c1 = Contribution(
                    user_id=priya.id,
                    circle_id=mandal_circle.id,
                    amount=mandal_circle.contribution_amount,
                    due_date=datetime.now() - timedelta(days=2),
                    paid_date=datetime.now() - timedelta(days=2, hours=4),
                    status=ContributionStatus.PAID
                )
                db.add(c1)
                logger.info(f"Seeded paid contribution for {priya.full_name} in {mandal_circle.name}")
            # Next round contribution (PENDING)
            stmt_pending = select(Contribution).where(
                Contribution.user_id == priya.id,
                Contribution.circle_id == mandal_circle.id,
                Contribution.status == ContributionStatus.PENDING
            )
            if not db.scalar(stmt_pending):
                c2 = Contribution(
                    user_id=priya.id,
                    circle_id=mandal_circle.id,
                    amount=mandal_circle.contribution_amount,
                    due_date=datetime.now() + timedelta(days=5),
                    status=ContributionStatus.PENDING
                )
                db.add(c2)
                logger.info(f"Seeded pending contribution for {priya.full_name} in {mandal_circle.name}")
    if kisan_circle:
        # Rahul Verma contribution in Kisan Sahayata Group (LATE)
        rahul = users_map.get("rahul.verma@example.com")
        if rahul:
            stmt = select(Contribution).where(
                Contribution.user_id == rahul.id,
                Contribution.circle_id == kisan_circle.id,
                Contribution.status == ContributionStatus.LATE
            )
            if not db.scalar(stmt):
                c3 = Contribution(
                    user_id=rahul.id,
                    circle_id=kisan_circle.id,
                    amount=kisan_circle.contribution_amount,
                    due_date=datetime.now() - timedelta(days=10),
                    paid_date=datetime.now() - timedelta(days=1),
                    status=ContributionStatus.LATE
                )
                db.add(c3)
                logger.info(f"Seeded late contribution for {rahul.full_name} in {kisan_circle.name}")
def seed_trust_scores(db: Session, users_map: Dict[str, User]) -> None:
    """
    Seeds initial trust score audit trail entries.
    """
    logger.info("Seeding trust scores...")
    for email, user in users_map.items():
        stmt = select(TrustScore).where(TrustScore.user_id == user.id)
        if not db.scalar(stmt):
            # Seed starting score baseline audit entry
            initial_audit = TrustScore(
                user_id=user.id,
                previous_score=Decimal("100.00"),
                new_score=user.current_trust_score,
                reason="Baseline initial setup score upon profile generation."
            )
            db.add(initial_audit)
            logger.info(f"Created initial trust score audit trail for {user.full_name}")
def main():
    """
    Main driver method to run database seed actions transactionally.
    """
    logger.info("Initializing database seeding pipeline...")
    
    # Initialize connection session
    db = SessionLocal()
    try:
        # Run seed actions
        users = seed_users(db)
        circles = seed_circles(db, users)
        seed_memberships(db, users, circles)
        seed_contributions(db, users, circles)
        seed_trust_scores(db, users)
        
        # Commit modifications
        db.commit()
        logger.info("Database seeding successfully completed.")
    except Exception as e:
        logger.error(f"Seeding pipeline failed! Rolling back changes: {e}", exc_info=True)
        db.rollback()
        sys.exit(1)
    finally:
        db.close()
if __name__ == "__main__":
    main()
