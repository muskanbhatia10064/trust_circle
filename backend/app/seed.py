"""
Demo seed script — run once after DB setup:
    cd backend
    python -m app.seed

Creates:
  - 5 demo users (Priya Sharma 748, Rahul Verma 710, Suresh Yadav 490, Amit Yadav, Meera Patel)
  - 3 circles (Mahila Bachat Mandal, Kisan Sahayata Group, Varanasi Vyapar Circle)
  - Realistic transactions with Indian rupee amounts
  - Pre-computed trust scores matching the demo credentials table
"""
import uuid
from datetime import datetime, timedelta
from app.database import SessionLocal, Base, engine
from app.models import User, Circle, CircleMember, Transaction, TrustScore
from app.auth import hash_password

Base.metadata.create_all(bind=engine)

DEMO_PASSWORD = hash_password("Password@123")

USERS = [
    {"phone": "9876543210", "name": "Priya Sharma",  "district": "Lucknow",   "state": "Uttar Pradesh", "gender": "female", "target_score": 748},
    {"phone": "9876543211", "name": "Rahul Verma",   "district": "Varanasi",  "state": "Uttar Pradesh", "gender": "male",   "target_score": 710},
    {"phone": "9876543212", "name": "Suresh Yadav",  "district": "Gorakhpur", "state": "Uttar Pradesh", "gender": "male",   "target_score": 490},
    {"phone": "9876543213", "name": "Amit Yadav",    "district": "Patna",     "state": "Bihar",         "gender": "male",   "target_score": 720},
    {"phone": "9876543214", "name": "Meera Patel",   "district": "Kanpur",    "state": "Uttar Pradesh", "gender": "female", "target_score": 655},
]

CIRCLES = [
    {"name": "Mahila Bachat Mandal",    "contribution_amount": 2000, "cycle_days": 30},
    {"name": "Kisan Sahayata Group",    "contribution_amount": 1500, "cycle_days": 30},
    {"name": "Varanasi Vyapar Circle",  "contribution_amount": 3000, "cycle_days": 30},
]


def seed():
    db = SessionLocal()
    try:
        # Skip if already seeded
        if db.query(User).filter(User.phone == "9876543210").first():
            print("Demo data already exists. Skipping seed.")
            return

        print("Seeding demo data...")

        # 1. Create users
        user_objs = []
        for u in USERS:
            user = User(
                id=str(uuid.uuid4()),
                phone=u["phone"],
                name=u["name"],
                district=u["district"],
                state=u["state"],
                gender=u["gender"],
                language="hi",
                hashed_password=DEMO_PASSWORD,
            )
            db.add(user)
            user_objs.append((user, u["target_score"]))
        db.flush()

        # 2. Create circles
        circle_objs = []
        for i, c in enumerate(CIRCLES):
            circle = Circle(
                id=str(uuid.uuid4()),
                name=c["name"],
                contribution_amount=c["contribution_amount"],
                cycle_days=c["cycle_days"],
                status="active",
                facilitator_id=user_objs[i][0].id,
            )
            db.add(circle)
            circle_objs.append(circle)
        db.flush()

        # 3. Add members + transactions + scores
        base_date = datetime.utcnow() - timedelta(days=60)

        for idx, (user, target_score) in enumerate(user_objs):
            # Join first 2 circles
            for circle in circle_objs[:2]:
                member = CircleMember(
                    id=str(uuid.uuid4()),
                    circle_id=circle.id,
                    user_id=user.id,
                    received_payout=(idx == 0),  # Priya already received payout
                )
                db.add(member)

                # Suresh Yadav (idx=2) missed a payment — only 1 tx
                num_payments = 1 if idx == 2 else 3
                for month in range(num_payments):
                    tx_date = base_date + timedelta(days=month * 30)
                    # Rahul's notable payment: ₹1,500 on 28 May
                    amount = circle.contribution_amount
                    if user.name == "Rahul Verma":
                        amount = 1500
                    tx = Transaction(
                        id=str(uuid.uuid4()),
                        circle_id=circle.id,
                        user_id=user.id,
                        amount=amount,
                        tx_type="contribution",
                        created_at=tx_date,
                    )
                    db.add(tx)
                    # Update pool
                    circle.pool_balance = round((circle.pool_balance or 0) + amount * 0.995, 2)
                    circle.reinsurance_balance = round((circle.reinsurance_balance or 0) + amount * 0.005, 2)

            # 4. Save pre-computed trust score matching the spec
            score = TrustScore(
                id=str(uuid.uuid4()),
                user_id=user.id,
                score=float(target_score),
                model_version="v1-seed",
                features={"seeded": True, "target": target_score},
            )
            db.add(score)

        db.commit()
        print("Seed complete!")
        print("\nDemo credentials (phone / password):")
        for u in USERS:
            print(f"  {u['name']} | {u['phone']} | Password@123 | score {u['target_score']}")

    finally:
        db.close()


if __name__ == "__main__":
    seed()
