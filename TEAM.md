# 👥 Team Work Distribution — TrustCircle

> **Team size: 5 people**
> - 3 people → Backend only
> - 2 people → Frontend only
> - **Frontend people: DO NOT touch anything inside the `backend/` folder. Ever.**
> - **Backend people: DO NOT touch anything inside the `frontend/` folder. Ever.**

---

## 🎯 DEMO GOAL — 3 WOW MOMENTS FOR JUDGES

We are building a **3-minute demo**, not a full product. Every task below serves one of these three moments:

| # | Wow Moment | What Judges See |
|---|------------|-----------------|
| 1 | **Trust Score ring animates up** | User pays ₹1,500 → score ring fills upward in real-time. Proves the core idea. |
| 2 | **WhatsApp bot replies instantly** | Someone types "what's my balance?" → bot replies with Priya Sharma's circle balance. Proves rural accessibility. |
| 3 | **Live social impact counter** | Admin dashboard: "47 credit identities created, ₹3,40,000 secured across 12 circles" from seeded real data. Makes the mission tangible. |

---

## 🔐 WHO OWNS WHAT

| Person | Role | Owns | Never Touch |
|--------|------|------|-------------|
| **Person 1** | Backend Lead | DB models, auth, config, seed data, Express API skeleton | `frontend/` |
| **Person 2** | Backend Dev | 3 core API endpoints: create circle, add payment, get trust score | `frontend/` |
| **Person 3** | Backend Dev | WhatsApp bot (Twilio), PostgreSQL seed data with real Indian names | `frontend/` |
| **Person 4** | Frontend Lead | Next.js setup, design system (Sora font + #1D9E75 green), API wiring, Leaflet map | `backend/` |
| **Person 5** | Frontend Dev | Circle dashboard, Trust Score animated ring, Impact counter, member cards | `backend/` |

---

## 📋 DETAILED TASK BREAKDOWN

---

### 🔴 PERSON 1 — Backend Lead
**Focus: Database, Auth, Config, API skeleton**

Everything depends on you. Get this done first so Person 2 and 3 can build on top.

**Your files:**
- `backend/app/models/models.py` — 5 tables only: users, circles, members, transactions, scores
- `backend/app/database.py` — PostgreSQL connection
- `backend/app/config.py` — All env variables
- `backend/app/auth.py` — JWT login logic
- `backend/app/main.py` — Wires all routers, CORS
- `backend/requirements.txt` — Keep updated

**Your tasks:**
- [ ] Set up PostgreSQL, confirm connection works
- [ ] Create the 5 tables — users, circles, members, transactions, scores
- [ ] Test register + login returns a JWT token
- [ ] Write a `seed.py` script that inserts realistic Indian demo data (see below)
- [ ] Tell Person 2 and 3 when DB is ready

**Seed data to use (makes demo look real, not AI-generated):**
```
Users:   Priya Sharma (Lucknow), Rahul Verma (Varanasi), Sunita Devi (Gorakhpur),
         Amit Yadav (Patna), Meera Patel (Kanpur)
Circles: "Mahila Bachat Mandal", "Kisan Sahayata Group", "Varanasi Vyapar Circle"
Payments: Rahul Verma paid ₹1,500 on 28 May. Priya Sharma paid ₹2,000 on 1 Jun.
Scores:  Priya: 742, Rahul: 681, Sunita: 598, Amit: 720, Meera: 655
```

**DO NOT touch:** Anything inside `frontend/`

---

### 🔴 PERSON 2 — Backend Dev
**Focus: 3 core API endpoints that power the demo**

You build exactly 3 endpoints. That's it. Make them fast and reliable.

**Your files:**
- `backend/app/routers/circles.py` — create circle, add payment
- `backend/app/routers/trust_score.py` — get trust score (this powers the animated ring)
- `backend/app/services/trust_score.py` — score recalculates after every payment
- `backend/app/services/reinsurance.py` — 0.5% buffer deduction
- `backend/tests/test_api.py` — test all 3 endpoints

**Your 3 endpoints:**
```
POST /circles/          → create a circle
POST /circles/{id}/contribute → add a payment (score updates after this)
GET  /trust-score/me    → return current score (frontend polls this for the animation)
```

**Your tasks:**
- [ ] After a payment is recorded, recompute the trust score automatically
- [ ] `GET /trust-score/me` must return score + previous score so frontend can animate the change
- [ ] Test with Rahul Verma paying ₹1,500 — confirm score goes up
- [ ] Make sure 0.5% reinsurance buffer is deducted and shown in response
- [ ] Add `GET /admin/stats` → returns `{ users_count, total_pooled, circles_count }` for impact counter

**DO NOT touch:** Anything inside `frontend/`

---

### 🔴 PERSON 3 — Backend Dev
**Focus: WhatsApp bot — the accessibility wow moment**

This is the most impactful demo moment for judges. A real WhatsApp message getting a real reply.

**Your files:**
- `backend/app/routers/whatsapp.py` — Twilio webhook handler
- `backend/app/services/whatsapp_bot.py` — 3 command handlers

**3 commands the bot must handle:**
```
"balance"  → "Priya, your Mahila Bachat Mandal balance is ₹18,500. Next payout: 15 Jun."
"score"    → "Your TrustCircle score is 742 ⭐. That's Top 15% in your district!"
"status"   → "Circle status: 8/10 members paid this month. 2 pending: Sunita, Amit."
```

**Your tasks:**
- [ ] Sign up for Twilio free sandbox at twilio.com (free, takes 10 min)
- [ ] Set webhook URL to `POST /whatsapp/incoming`
- [ ] Handle the 3 commands above with hardcoded demo responses (real data from DB preferred)
- [ ] Test on your own WhatsApp — screenshot it for the pitch
- [ ] If user sends anything else, reply: "Hi! I'm TrustCircle bot. Try: balance, score, or status"

**DO NOT touch:** Anything inside `frontend/`

---

### 🟢 PERSON 4 — Frontend Lead
**Focus: Next.js setup, design system, API wiring, Leaflet map**

You build the shell that Person 5 fills. Design system first — everything else depends on your colors and components.

**Design system (commit to these, never deviate):**
- Font: **Sora** (Google Fonts — add to `_document.js`)
- Accent color: **#1D9E75** (green) — every button, badge, highlight
- Background: **#F7F9FC**, Cards: **white** with `box-shadow: 0 2px 12px rgba(0,0,0,0.06)`
- Border radius: **12px** everywhere

**Your files:**
- `frontend/src/services/api.js` — All API functions (Person 5 imports from here only)
- `frontend/src/hooks/useAuth.jsx` — Auth state
- `frontend/src/main.jsx` — Routing
- `frontend/src/index.css` — Design system variables and global styles
- `frontend/src/components/Navbar.jsx` — Nav bar
- `frontend/src/components/MapView.jsx` — Leaflet map with UP/Bihar pins
- `frontend/package.json`, `frontend/vite.config.js`

**Your tasks:**
- [ ] Set up design system: CSS variables for color, font, radius, shadow
- [ ] Build `MapView.jsx` — Leaflet map with 5 pins: Lucknow, Varanasi, Gorakhpur, Patna, Kanpur. Each pin shows circle name on click.
- [ ] Add `GET /admin/stats` call to `api.js` for the impact counter
- [ ] Make sure `npm run dev` works before Person 5 starts
- [ ] If Person 5 needs a new API call, add it to `api.js` and tell them the function name

**DO NOT touch:** Anything inside `backend/`

---

### 🟢 PERSON 5 — Frontend Dev
**Focus: The 3 wow-moment UI components**

You build what judges see. Focus on the 3 demo moments — get those perfect before touching anything else.

**Animate exactly 2 things (nothing else should move):**
1. **Trust Score ring** — SVG circle that fills from old score to new score over 1.5s when payment is made
2. **Payment badge** — flips from `pending` (grey) → `paid` (green #1D9E75) when contribution lands

**Your files:**
- `frontend/src/pages/Dashboard.jsx` — Impact counter + circle list + map
- `frontend/src/pages/TrustScore.jsx` — Animated SVG ring + score number
- `frontend/src/pages/Circles.jsx` — Member cards with real Indian names, payment badges
- `frontend/src/pages/Login.jsx` — Login form
- `frontend/src/pages/Register.jsx` — Register form

**Member cards must show real data:**
```
 Priya Sharma     — Lucknow    — Score: 742  — ✅ Paid ₹2,000
 Rahul Verma      — Varanasi   — Score: 681  — ✅ Paid ₹1,500  (28 May)
 Sunita Devi      — Gorakhpur  — Score: 598  — ⏳ Pending
 Amit Yadav       — Patna      — Score: 720  — ✅ Paid ₹1,800
 Meera Patel      — Kanpur     — Score: 655  — ⏳ Pending
```

**Impact counter on Dashboard (Wow Moment #3):**
```
47 credit identities created
₹3,40,000 secured
12 active circles
```
Animate these numbers counting up from 0 when the page loads.

**Your tasks:**
- [ ] Build the animated SVG trust score ring (CSS animation, not a library)
- [ ] Build member cards with the real names/data above
- [ ] Build the impact counter with count-up animation
- [ ] Payment badge: grey "Pending" → green "Paid" flip on contribute
- [ ] Import all API calls from `../services/api.js` only — never write fetch/axios directly
- [ ] Mobile-friendly layout (judges may check on phones)

**DO NOT touch:** Anything inside `backend/`

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
This is a demo for a hackathon — we need 3 working endpoints: create circle, add payment, get trust score.
The project uses SQLAlchemy ORM, JWT auth (python-jose), and PostgreSQL.
My task is: [describe your task]
Here is my current file: [paste file]
Help me implement this without breaking the existing structure.
Keep it minimal — we are building a demo, not a production system.
Only modify backend files. Do not suggest any frontend changes.
```

---

### For PERSON 3 — WhatsApp bot specifically

```
I'm building a WhatsApp bot using Twilio Sandbox for TrustCircle, a fintech ROSCA platform.
The bot needs to handle 3 commands: "balance", "score", "status".
Framework: FastAPI. Twilio sends a POST to /whatsapp/incoming with "Body" field containing the message.
Reply using Twilio's MessagingResponse XML format.
Here is my current file: [paste file]
Help me implement the 3 command handlers with realistic Indian demo data.
```

---

### For PERSON 4 & 5 — Frontend (beginner-friendly)

```
I'm a beginner React developer working on TrustCircle, a fintech demo app for a hackathon.
The frontend uses React 18, React Router v6, and Axios.
Design system: font is Sora (Google Fonts), accent color is #1D9E75 (green), border-radius 12px everywhere.
All API functions are in frontend/src/services/api.js — import from there, never write fetch() or axios() directly.
My task is: [describe your task]
Here is my current file: [paste your file]
Explain what you're doing step by step. Keep the code simple and clean.
```

---

### For PERSON 5 — animated Trust Score ring specifically

```
I need to build an animated SVG circle (ring) in React that:
- Shows a trust score number (e.g. 742) in the center
- The ring fills from 0 to the score value over 1.5 seconds using CSS animation
- When the score updates (e.g. from 681 to 710 after a payment), the ring animates from old to new value
- Uses stroke-dashoffset animation on an SVG circle element
- Color is #1D9E75, background ring is #E8F5F1
No animation libraries. Pure CSS + React useState/useEffect only.
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
