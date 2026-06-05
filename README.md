<div align="center">

# TrustCircle

**Community savings and credit platform for rural India**

A ROSCA / P2P lending system with ML-powered trust scoring, fairness auditing,
and rural-first access via USSD, IVR, and NGO facilitator mode.

---

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/Frontend-React_18-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![SQLite](https://img.shields.io/badge/Database-SQLite-003B57?style=flat-square&logo=sqlite&logoColor=white)](https://www.sqlite.org)
[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=flat-square&logo=python&logoColor=white)](https://python.org)
[![Vite](https://img.shields.io/badge/Build-Vite-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev)

</div>

---

## What is TrustCircle

TrustCircle digitises the age-old ROSCA model (rotating savings and credit associations) used across rural India. Members form savings circles, contribute monthly, and one member receives the full pool each cycle. The platform builds a verifiable credit identity for users who are invisible to traditional banks.

---

## Core Features

| Feature | Description |
|---|---|
| ROSCA Payout Flow | Admin picks a receiver each month via random selection. Receiver uploads UPI QR. Others pay. Receiver confirms. |
| Trust Score Engine | ML-based creditworthiness score. Updates automatically after every contribution. |
| Fairness Auditor | Auto-triggers model retraining if gender or geography disparity exceeds 15%. |
| Dispute Tickets | Receiver or admin can raise a ticket against a non-paying member. Penalises their trust score. |
| Circle Management | Invite members by phone number or shareable invite link. |
| WhatsApp Bot | In-app WhatsApp bot interface. Responds to balance, members, report, deposit, loan, verify commands. |
| USSD 99# Gateway | Full circle management on feature phones with no internet. |
| Voice IVR | 12-language voice support via Exotel / Ozonetel. |
| NGO Facilitator Mode | Offline circle management via trusted field coordinators. |
| Reinsurance Buffer | 0.5% of every contribution goes to a platform emergency fund. |
| Consent Ledger | DPDP Act 2023 compliant. Financial passport export. |
| Partner Webhooks | NBFC / MFI integration via OAuth2 Trust Score API. |

---

## Project Structure

```
Trust_Circle/
├── backend/
│   ├── app/
│   │   ├── models/         # SQLAlchemy ORM models
│   │   ├── routers/        # API route handlers
│   │   │   ├── auth.py
│   │   │   ├── circles.py
│   │   │   ├── trust_score.py
│   │   │   ├── consent.py
│   │   │   ├── partners.py
│   │   │   ├── channels.py
│   │   │   └── facilitator.py
│   │   ├── services/       # Business logic
│   │   │   ├── trust_score.py
│   │   │   ├── fairness_auditor.py
│   │   │   ├── reinsurance.py
│   │   │   ├── ussd_gateway.py
│   │   │   └── ivr.py
│   │   ├── auth.py
│   │   ├── config.py
│   │   ├── database.py
│   │   └── main.py
│   ├── tests/
│   ├── requirements.txt
│   └── .env.example
│
└── frontend/
    ├── src/
    │   ├── components/     # Navbar, MapView, PaymentModal
    │   ├── hooks/          # useAuth
    │   ├── pages/          # Dashboard, Circles, TrustScore, WhatsAppBot
    │   └── services/
    │       └── api.js      # All API calls live here
    ├── package.json
    └── .env.example
```

---

## Getting Started

### Prerequisites

- Python 3.10 or higher
- Node.js 18 or higher
- Git

---

### 1. Clone the Repository

```bash
git clone https://github.com/muskanbhatia10064/Trust_Circle.git
cd Trust_Circle
```

---

### 2. Backend Setup

```bash
cd backend
```

**Create and activate virtual environment**

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Mac / Linux
python -m venv venv
source venv/bin/activate
```

**Install dependencies**

```bash
pip install -r requirements.txt
```

**Create environment file**

```bash
# Windows
copy .env.example .env

# Mac / Linux
cp .env.example .env
```

**Run the server**

```bash
uvicorn app.main:app --reload
```

Backend runs at: `http://localhost:8000`  
API docs at: `http://localhost:8000/api/v1/docs`  
Health check at: `http://localhost:8000/health`

---

### 3. Frontend Setup

Open a new terminal:

```bash
cd frontend
```

**Install dependencies**

```bash
npm install
```

**Create environment file**

```bash
# Windows
copy .env.example .env

# Mac / Linux
cp .env.example .env
```

**Run dev server**

```bash
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

## Environment Variables

### Backend `.env`

```env
DATABASE_URL=sqlite:///./trustcircle.db
SECRET_KEY=demo-secret-key-change-in-production
ENV=development
```

### Frontend `.env`

```env
VITE_API_BASE_URL=http://localhost:8000
```

---

## API Overview

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/register` | Register a new user |
| POST | `/auth/login` | Login, returns JWT token |
| GET | `/auth/me` | Get current user profile |

### Circles

| Method | Endpoint | Description |
|---|---|---|
| GET | `/circles/` | List user's circles |
| POST | `/circles/` | Create a new circle |
| POST | `/circles/{id}/join` | Join a circle |
| POST | `/circles/{id}/contribute` | Pay contribution |
| POST | `/circles/{id}/assign-receiver` | Randomly pick this month's receiver |
| POST | `/circles/{id}/upload-qr` | Receiver uploads UPI QR image |
| POST | `/circles/{id}/confirm-received` | Receiver confirms all payments received |
| GET | `/circles/{id}/payout-status` | Get current receiver and QR status |
| GET | `/circles/{id}/members` | List circle members with trust scores |
| POST | `/circles/{id}/invite` | Invite member by phone number |
| GET | `/circles/{id}/invite-link` | Get shareable invite code |
| POST | `/circles/{id}/raise-ticket` | Raise dispute ticket, penalises trust score |
| GET | `/circles/{id}/tickets` | List all dispute tickets |

### Trust Score

| Method | Endpoint | Description |
|---|---|---|
| POST | `/trust-score/compute` | Compute score for current user |
| GET | `/trust-score/me` | Get current user's score |
| POST | `/trust-score/fairness-audit` | Run bias audit across gender and geography |

---

## Payout Flow

```
1. Admin clicks "Pick This Month's Receiver"
        |
        v
2. System randomly selects a member who has NOT received payout before
        |
        v
3. Receiver uploads their UPI QR image
        |
        v
4. All other members scan QR and pay the contribution amount
        |
        v
5. Receiver clicks "I've Received Everyone's Payment" to confirm
        |
        v
6. If a member hasn't paid, receiver raises a dispute ticket
   -> Non-payer's trust score is penalised by 10 points
        |
        v
7. Next month, the same member cannot be selected again
   -> Cycle continues until all members have received once
```

---

## Pages

| Route | Page | Description |
|---|---|---|
| `/dashboard` | Dashboard | Circle overview with Leaflet map |
| `/circles` | Circles | Create, join, manage circles and payout flow |
| `/trust-score` | Trust Score | ML score with fairness audit panel |
| `/whatsapp-bot` | WhatsApp Bot | In-app bot interface for field workers |
| `/login` | Login | Phone-based authentication |
| `/register` | Register | New user registration |

---

## Tech Stack

### Backend
- **FastAPI** — API framework
- **SQLAlchemy** — ORM
- **SQLite** — Default database (no setup needed)
- **Python-Jose** — JWT authentication
- **Passlib** — Password hashing
- **Pydantic** — Request / response validation

### Frontend
- **React 18** — UI library
- **Vite** — Build tool
- **React Router v6** — Client-side routing
- **Axios** — HTTP client
- **Recharts** — Charts and score visualisation
- **React Leaflet** — Interactive circle map
- **Sora** — Font (Google Fonts)

---

## Database

The SQLite database (`trustcircle.db`) is auto-created by SQLAlchemy on first run. No manual setup or migration required.

**Tables**

```
users               — Registered members with trust scores
circles             — Savings groups with pool balance
memberships         — User-circle relationships and payout tracking
contributions       — Individual contribution records
transactions        — Full ledger of all money movements
trust_scores        — Score history per user with ML features
consent_records     — DPDP Act 2023 consent ledger
fairness_audits     — Bias audit results per dimension
dispute_tickets     — Raised tickets against non-paying members
partner_webhooks    — NBFC/MFI integration registry
payouts             — Payout disbursement records
```

---

## Notes

- On first run the database is empty. Register a user at `/register` before using any other feature.
- The default `.env` uses SQLite — no PostgreSQL needed for development.
- All API calls from the frontend go through `frontend/src/services/api.js`. Never write `fetch` or `axios` directly in page components.
- JWT token is stored in `localStorage` and automatically attached to every request via an Axios interceptor.
- On any `401` response the user is automatically redirected to `/login`.

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "Add your feature"`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request against `main`

---

## Team

Built for hackathon demonstration. See `TEAM.md` for full task distribution across backend and frontend contributors.

---

<div align="center">

**TrustCircle** — Making 350 million credit-invisible Indians visible.

</div>
