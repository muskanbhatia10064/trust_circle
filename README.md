# Trust Circle

A ROSCA/P2P lending platform with AI-powered trust scoring, fairness auditing, and rural-first access (USSD, IVR, NGO facilitator mode).

## Features
- **Trust Score Engine** — ML-based creditworthiness with monthly bias audit
- **Fairness Auditor AI** — auto-triggers retraining if gender/geography disparity >15%
- **Circle Management** — invite members by phone, shareable invite links, dispute tickets
- **ROSCA Payout Flow** — selected receiver uploads UPI QR, others pay, receiver confirms
- **USSD 99# Gateway** — works on ₹500 feature phones, no internet required
- **Voice IVR (12 languages)** — Exotel/Ozonetel integration
- **NGO Facilitator Mode** — offline circle management via trusted coordinators
- **Reinsurance Buffer** — 0.5% pool contribution to platform emergency fund
- **Consent Management Ledger** — DPDP Act 2023 compliant, financial passport export
- **Partner Webhook System** — NBFC/MFI integration via OAuth2 Trust Score API

## Project Structure
```
trust-circle/
├── backend/          # FastAPI + SQLite
└── frontend/         # React + Vite
```

---

## Setup After Cloning

### Prerequisites
- Python 3.10+
- Node.js 18+

---

### Backend

```bash
cd backend

# 1. Create virtual environment
python -m venv venv

# 2. Activate it
venv\Scripts\activate          # Windows
# source venv/bin/activate     # Mac/Linux

# 3. Install dependencies
pip install -r requirements.txt

# 4. Create .env file
copy .env.example .env         # Windows
# cp .env.example .env         # Mac/Linux

# 5. Run the server
uvicorn app.main:app --reload
```

Backend runs at: http://localhost:8000  
API docs at: http://localhost:8000/docs

---

### Frontend

Open a **new terminal**:

```bash
cd frontend

# 1. Install dependencies
npm install

# 2. Create .env file
copy .env.example .env         # Windows
# cp .env.example .env         # Mac/Linux

# 3. Run dev server
npm run dev
```

Frontend runs at: http://localhost:5173

---

## Notes on Fresh Clone

- The database (`trustcircle.db`) is **auto-created** by SQLAlchemy on first run — no setup needed.
- The `.env` default uses **SQLite** — no PostgreSQL required.
- On first run the DB will be empty. Register a user at `/auth/register` or via the UI.

---

## Default .env values (already set)

```
DATABASE_URL=sqlite:///./trustcircle.db
SECRET_KEY=demo-secret-key-change-in-production
ENV=development
```
