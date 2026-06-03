# Trust Circle

A ROSCA/P2P lending platform with AI-powered trust scoring, fairness auditing, and rural-first access (USSD, IVR, NGO facilitator mode).

## Features
- **Trust Score Engine** — ML-based creditworthiness with monthly bias audit
- **Fairness Auditor AI** — auto-triggers retraining if gender/geography disparity >15%
- **USSD 99# Gateway** — works on ₹500 feature phones, no internet required
- **Voice IVR (12 languages)** — Exotel/Ozonetel integration
- **NGO Facilitator Mode** — offline circle management via trusted coordinators
- **Reinsurance Buffer** — 0.5% pool contribution to platform emergency fund
- **Consent Management Ledger** — DPDP Act 2023 compliant, financial passport export
- **Partner Webhook System** — NBFC/MFI integration via OAuth2 Trust Score API

## Project Structure
```
trust-circle/
├── backend/          # FastAPI application
└── frontend/         # React + Vite application
```

## Quick Start

### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate       # Windows
pip install -r requirements.txt
cp .env.example .env        # fill in your values
uvicorn app.main:app --reload
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

## API Docs
Once backend is running: http://localhost:8000/docs
