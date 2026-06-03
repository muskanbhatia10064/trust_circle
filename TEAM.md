# 👥 Team Work Distribution — TrustCircle

> **Team size: 5 people**
> - 3 people → Backend only
> - 2 people → Frontend only
> - **Frontend people: DO NOT touch anything inside the `backend/` folder. Ever.**
> - **Backend people: DO NOT touch anything inside the `frontend/` folder. Ever.**

---

## 🔐 WHO OWNS WHAT

| Person | Role | Files You Work In | Files You NEVER Touch |
|--------|------|-------------------|----------------------|
| **Person 1** | Backend Lead | `backend/app/models/`, `backend/app/database.py`, `backend/app/config.py`, `backend/app/main.py`, `backend/app/auth.py`, `backend/requirements.txt` | `frontend/` anything |
| **Person 2** | Backend Dev | `backend/app/routers/auth.py`, `backend/app/routers/trust_score.py`, `backend/app/routers/circles.py`, `backend/app/services/trust_score.py`, `backend/app/services/fairness_auditor.py`, `backend/app/services/reinsurance.py`, `backend/tests/test_api.py` | `frontend/` anything |
| **Person 3** | Backend Dev | `backend/app/routers/consent.py`, `backend/app/routers/partners.py`, `backend/app/routers/channels.py`, `backend/app/routers/facilitator.py`, `backend/app/services/ussd_gateway.py`, `backend/app/services/ivr.py` | `frontend/` anything |
| **Person 4** | Frontend Lead | `frontend/src/services/api.js`, `frontend/src/main.jsx`, `frontend/src/hooks/useAuth.jsx`, `frontend/src/index.css`, `frontend/src/components/`, `frontend/index.html`, `frontend/package.json`, `frontend/vite.config.js`, `frontend/.env.example` | `backend/` anything |
| **Person 5** | Frontend Dev | `frontend/src/pages/Dashboard.jsx`, `frontend/src/pages/TrustScore.jsx`, `frontend/src/pages/Circles.jsx`, `frontend/src/pages/Login.jsx`, `frontend/src/pages/Register.jsx`, `frontend/src/pages/Consent.jsx`, `frontend/src/pages/Facilitator.jsx` | `backend/` anything |

---

## 📋 DETAILED TASK BREAKDOWN

---

### 🔴 PERSON 1 — Backend Lead
**Focus: Database, Auth, Config, Core Setup**

Your job is to make sure the database and authentication work perfectly. Everything else depends on you.

**Your files:**
- `backend/app/models/models.py` — All database tables (User, Circle, TrustScore, etc.)
- `backend/app/database.py` — Database connection
- `backend/app/config.py` — All environment variables
- `backend/app/auth.py` — Login/JWT token logic
- `backend/app/main.py` — Registers all the routers, CORS settings
- `backend/requirements.txt` — Python packages list
- `backend/.env.example` — Environment variable template

**Your tasks:**
- [ ] Set up PostgreSQL database locally and test the connection
- [ ] Make sure all database tables are created correctly (`Base.metadata.create_all`)
- [ ] Test that register + login endpoints return correct JWT tokens
- [ ] If any new database table is needed, add it to `models.py` and tell Person 2
- [ ] Keep `requirements.txt` updated whenever you install a new package

**DO NOT touch:** Anything inside `frontend/`

---

### 🔴 PERSON 2 — Backend Dev
**Focus: Core APIs — Auth, Trust Score, Circles**

Your job is to build the core business logic — user authentication, trust scoring with fairness auditing, and the circle (ROSCA) management system.

**Your files:**
- `backend/app/routers/auth.py` — Register/Login endpoints
- `backend/app/routers/trust_score.py` — Trust Score compute + fairness audit endpoint
- `backend/app/routers/circles.py` — Create/join/contribute to circles
- `backend/app/services/trust_score.py` — Score computation logic (ML integration point)
- `backend/app/services/fairness_auditor.py` — Bias detection logic (gender/geography disparity)
- `backend/app/services/reinsurance.py` — 0.5% buffer deduction from every contribution
- `backend/tests/test_api.py` — All backend tests

**Your tasks:**
- [ ] Test auth endpoints (register/login) using http://localhost:8000/docs (Swagger UI)
- [ ] Improve the trust score algorithm in `services/trust_score.py` — replace heuristic with real ML model
- [ ] Make sure the fairness audit correctly flags >15% disparity and logs it
- [ ] Test circle creation, joining, and contribution flow
- [ ] Verify reinsurance buffer is deducted correctly (0.5% to emergency fund)
- [ ] Add more test cases in `tests/test_api.py` for all your endpoints
- [ ] Coordinate with Person 1 if you need a new database column or table

**DO NOT touch:** Anything inside `frontend/`

---

### 🔴 PERSON 3 — Backend Dev
**Focus: Rural Access Channels & Partner Integrations**

Your job is to build the rural-first access layer (USSD *99#, IVR voice), DPDP Act consent management, NGO facilitator mode, and partner webhook system for NBFC/MFI integrations.

**Your files:**
- `backend/app/routers/consent.py` — DPDP consent + financial passport export
- `backend/app/routers/partners.py` — NBFC/MFI partner webhook API + OAuth2 Trust Score access
- `backend/app/routers/channels.py` — USSD *99# and IVR endpoints
- `backend/app/routers/facilitator.py` — NGO facilitator mode (offline member management)
- `backend/app/services/ussd_gateway.py` — USSD menu state machine (feature phone, no internet)
- `backend/app/services/ivr.py` — IVR XML response builder (Exotel/Ozonetel integration)

**Your tasks:**
- [ ] Test USSD flow by simulating POST requests to `/ussd` with different menu inputs
- [ ] Build IVR call flow responses for 12 languages (use placeholder audio URLs for now)
- [ ] Implement consent toggle endpoints and financial passport JSON export
- [ ] Test partner webhook API with HMAC signature verification
- [ ] Implement facilitator endpoints to add offline members and record cash contributions
- [ ] Test all endpoints using http://localhost:8000/docs (Swagger UI)
- [ ] Coordinate with Person 1 if you need a new database column or table

**DO NOT touch:** Anything inside `frontend/`

---

### 🟢 PERSON 4 — Frontend Lead
**Focus: App Setup, Routing, API Calls, Global Styles**

Your job is the foundation of the frontend. You wire everything together — routing, API calls, authentication state, and global styling. Person 5 depends on your `api.js` to call the backend.

**Your files:**
- `frontend/src/services/api.js` — All API call functions (DO NOT call backend URLs directly in pages)
- `frontend/src/hooks/useAuth.jsx` — Login/logout state shared across the whole app
- `frontend/src/main.jsx` — App routing (which URL shows which page)
- `frontend/src/index.css` — All global styles
- `frontend/src/components/Navbar.jsx` — Top navigation bar
- `frontend/index.html` — HTML entry point
- `frontend/package.json` — npm packages
- `frontend/vite.config.js` — Dev server config
- `frontend/.env.example` — Frontend environment variables

**Your tasks:**
- [ ] Make sure `npm run dev` works and the app loads at http://localhost:5173
- [ ] Keep `api.js` updated — if a new backend endpoint exists, add a function here
- [ ] Make sure login/logout works and the JWT token is saved in localStorage
- [ ] If Person 5 needs a new API call, YOU add it to `api.js` and tell them the function name
- [ ] Keep global styles consistent — shared button, card, alert styles live in `index.css`
- [ ] Add any new shared components (e.g. a loading spinner, a modal) in `frontend/src/components/`

**DO NOT touch:** Anything inside `backend/`
**Rule for your team:** Person 5 imports from `../services/api.js` — they never write `fetch()` or `axios()` calls themselves.

---

### 🟢 PERSON 5 — Frontend Dev
**Focus: All User Pages**

You're building ALL the user-facing pages — from onboarding to the main app screens. Person 4 handles the infrastructure; you build what users actually see and interact with.

**Your files:**
- `frontend/src/pages/Login.jsx` — Login form
- `frontend/src/pages/Register.jsx` — Registration form with language + gender + state
- `frontend/src/pages/Dashboard.jsx` — Home screen after login: shows trust score + circle summary
- `frontend/src/pages/TrustScore.jsx` — Shows score, chart, recompute button, fairness audit results
- `frontend/src/pages/Circles.jsx` — List circles, create new circle, join a circle, pay contribution
- `frontend/src/pages/Consent.jsx` — DPDP Act consent toggles + financial passport download
- `frontend/src/pages/Facilitator.jsx` — NGO mode: add offline member + record cash contribution

**Your tasks:**
- [ ] Login should redirect to `/dashboard` on success, show error on failure
- [ ] Register form must include: phone, name, password, gender (optional), state (optional), language dropdown
- [ ] Dashboard should show the user's latest trust score and list of active circles
- [ ] Trust Score page should have the circular score badge and a "Recompute" button
- [ ] Circles page should let users create a circle, join using a Circle ID, and pay a contribution
- [ ] After paying, show the updated pool balance and reinsurance buffer amount
- [ ] Consent page must clearly label what each toggle does (e.g. "Share with NBFC Partners")
- [ ] Financial passport download must trigger a `.json` file download
- [ ] Facilitator page has two forms: "Add Offline Member" and "Record Cash Contribution"
- [ ] If you need a new API call, ask Person 4 to add it to `api.js` first
- [ ] Make the forms accessible and mobile-friendly (important for rural users)

**DO NOT touch:** Anything inside `backend/`
**DO NOT write** `axios.get(...)` or `fetch(...)` directly — always use functions from `../services/api.js`

---

## 🚀 GIT SETUP — HOW TO CLONE, PULL & PUSH

> Copy-paste these exactly. Do them in order the first time.

---

### ✅ STEP 1 — Clone the repo (do this ONCE on day 1)

Open your terminal (Command Prompt / PowerShell / VS Code terminal) and run:

```bash
git clone https://github.com/muskanbhatia10064/Trust_Circle.git
cd Trust_Circle
```

This downloads the entire project to your computer.

---

### ✅ STEP 2 — Create your own branch (do this ONCE, right after cloning)

Replace `your-name` with your actual name (no spaces):

```bash
git checkout -b your-name
```

Examples:
```bash
git checkout -b person1-backend
git checkout -b person2-backend
git checkout -b person3-backend
git checkout -b person4-frontend
git checkout -b person5-frontend
```

**You will always work on your own branch. Never work directly on `main`.**

---

### ✅ STEP 3 — Daily start routine (do this EVERY day before you start working)

```bash
git checkout main
git pull origin main
git checkout your-branch-name
git merge main
```

This pulls the latest code from everyone else and merges it into your branch so you're not behind.

---

### ✅ STEP 4 — Save and share your work (do this whenever you finish something)

```bash
git add .
git commit -m "describe what you did in one line"
git push origin your-branch-name
```

Good commit message examples:
```
git commit -m "Add trust score chart on TrustScore page"
git commit -m "Fix fairness audit disparity calculation"
git commit -m "Add proxy contribution form in Facilitator page"
```

---

### ✅ STEP 5 — Merge your work into main (only when your feature is complete and tested)

Go to GitHub → open a Pull Request from your branch → `your-branch → main` → ask Person 1 (backend lead) or Person 4 (frontend lead) to review and approve.

**Do NOT merge your own PR. Ask a teammate to review it first.**

---

## 🤖 AI PROMPTS TO USE WHILE WORKING

Copy-paste these prompts into Amazon Q, GitHub Copilot, or any AI assistant.

---

### For EVERYONE — understanding the codebase

```
I'm working on a project called TrustCircle — a ROSCA/P2P lending platform.
The backend is FastAPI + SQLAlchemy + PostgreSQL.
The frontend is React + Vite.
Here is the file I'm working on: [paste your file here]
Help me understand what this file does and how it connects to the rest of the project.
```

---

### For PERSON 1, 2 & 3 — Backend

```
I'm working on the TrustCircle FastAPI backend.
The project uses SQLAlchemy ORM, JWT auth (python-jose), and PostgreSQL.
My task is: [describe your task]
Here is my current file: [paste file]
Help me implement this without breaking the existing structure.
Only modify backend files. Do not suggest any frontend changes.
```

---

### For PERSON 4 & 5 — Frontend (beginner-friendly)

```
I'm a beginner React developer working on TrustCircle, a fintech web app.
The frontend uses React 18, React Router v6, and Axios for API calls.
All API functions are already written in frontend/src/services/api.js — I should import from there, never write fetch() or axios() directly.
My task is: [describe your task, e.g. "make the login form show an error message if the password is wrong"]
Here is my current file: [paste your file]
Explain what you're doing step by step. Keep the code simple.
```

---

### For debugging errors

```
I'm getting this error in TrustCircle:
[paste the full error message]

This is the file where the error happens:
[paste your file]

Explain what is causing this error and show me the fix. Don't change anything unrelated.
```

---

### For PERSON 4 — adding a new API call

```
I'm working on frontend/src/services/api.js in TrustCircle.
A new backend endpoint was added: [describe the endpoint, e.g. "POST /circles/{id}/payout"]
Add a new function to api.js for this endpoint, following the exact same pattern as the existing functions.
```

---

## ⚠️ IMPORTANT RULES — READ BEFORE YOU START

1. **Never work on `main` directly.** Always use your own branch.
2. **Frontend people (Person 4 & 5): `backend/` folder is off-limits.** You will break things for everyone if you edit it.
3. **Backend people (Person 1, 2 & 3): `frontend/` folder is off-limits.** Those are React files, stay out.
4. **Frontend devs: never write `fetch()` or `axios()` directly in a page.** Always use a function from `api.js`. If the function doesn't exist, ask Person 4.
5. **Pull before you start every day.** If you don't, you'll get merge conflicts.
6. **Small commits are better than big ones.** Commit after every small working change, not after 3 hours of work.
7. **If you're stuck for more than 30 minutes, ask.** Use the AI prompts above, then ask your team.
8. **Don't delete code someone else wrote.** Comment it out first and discuss.

---

## 📁 QUICK FILE REFERENCE

```
Trust_Circle/
├── backend/                    ← PERSON 1, 2 & 3 ONLY
│   ├── app/
│   │   ├── models/models.py    ← Person 1: database tables
│   │   ├── database.py         ← Person 1: DB connection
│   │   ├── config.py           ← Person 1: environment config
│   │   ├── auth.py             ← Person 1: JWT auth logic
│   │   ├── main.py             ← Person 1: app entry point
│   │   ├── routers/
│   │   │   ├── auth.py         ← Person 2: register/login
│   │   │   ├── trust_score.py  ← Person 2: trust scoring + fairness
│   │   │   ├── circles.py      ← Person 2: ROSCA circles
│   │   │   ├── consent.py      ← Person 3: DPDP consent
│   │   │   ├── partners.py     ← Person 3: NBFC/MFI webhooks
│   │   │   ├── channels.py     ← Person 3: USSD + IVR
│   │   │   └── facilitator.py  ← Person 3: NGO offline mode
│   │   └── services/
│   │       ├── trust_score.py  ← Person 2: ML scoring logic
│   │       ├── fairness_auditor.py ← Person 2: bias detection
│   │       ├── reinsurance.py  ← Person 2: 0.5% buffer
│   │       ├── ussd_gateway.py ← Person 3: USSD menu
│   │       └── ivr.py          ← Person 3: IVR XML builder
│   ├── tests/                  ← Person 2 & 3: backend tests
│   └── requirements.txt        ← Person 1: python packages
│
└── frontend/                   ← PERSON 4 & 5 ONLY
    ├── src/
    │   ├── services/api.js     ← Person 4: all API calls live here
    │   ├── hooks/useAuth.jsx   ← Person 4: login/logout state
    │   ├── components/         ← Person 4: shared UI components
    │   ├── index.css           ← Person 4: global styles
    │   ├── main.jsx            ← Person 4: routing
    │   └── pages/              ← Person 5: ALL user-facing pages
    │       ├── Dashboard.jsx
    │       ├── TrustScore.jsx
    │       ├── Circles.jsx
    │       ├── Login.jsx
    │       ├── Register.jsx
    │       ├── Consent.jsx
    │       └── Facilitator.jsx
    └── package.json            ← Person 4: npm packages
```

---

*Last updated by project lead. Questions? Raise a GitHub Issue or message the team group.*
