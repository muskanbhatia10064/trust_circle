# TrustCircle — WhatsApp Bot UI Task Briefing

## Project Overview

TrustCircle is a ROSCA (Rotating Savings and Credit Association) / P2P lending platform built for rural India.  
Users form **savings circles**, contribute monthly, and one member receives the full pool each cycle.

**Tech Stack:**
- Frontend: React + Vite (runs at `http://localhost:5173`)
- Backend: FastAPI + SQLite (runs at `http://localhost:8000`)
- Auth: JWT (phone-based login, Bearer token in `Authorization` header)

**Current Pages (Navbar):**
| Route | Page |
|---|---|
| `/dashboard` | Dashboard with map + circle overview |
| `/circles` | Create/join circles, pay contributions, manage members |
| `/trust-score` | ML trust score + fairness audit |
| `/whatsapp-bot` | WhatsApp Bot UI ← **YOUR TASK** |

---

## Your Task — WhatsApp Bot Page

### What exists right now

The file `frontend/src/pages/WhatsAppBot.jsx` exists and works, but has **2 problems**:

**Problem 1 — Hardcoded fake groups**  
The bot currently shows 3 fake/random groups (`Savitri Bachat Sangha`, `Jyoti Mahila Mandal`, `Pragati SHG`) that are hardcoded in the file. These are not real. The bot should instead show the **actual circles the logged-in user has created or joined**, fetched from the backend API.

**Problem 2 — UI style mismatch**  
The WhatsApp Bot page has its own dark green theme (`#080C0A` background, `#2ECC89` accent) which looks completely different from the rest of the app. The rest of the app uses a **light theme** (white cards, `#1D9E75` green, `#F7F9FC` background, `Sora` font). The bot UI needs to be restyled to match the app's design system.

---

## Task Breakdown

### Task 1 — Load Real User Circles (Backend Integration)

**What to do:**  
On page load, call the circles API to get the logged-in user's circles and use them as the group list in the bot.

**API call already exists** in `frontend/src/services/api.js`:
```js
circleApi.list()  // GET /circles/  — returns array of user's circles
```

Each circle object from the API looks like:
```json
{
  "id": 1,
  "name": "My Circle",
  "code": "TC-ABC123",
  "contribution_amount": 500,
  "pool_balance": 4500,
  "status": "active",
  "created_by": 3,
  "current_member_count": 0
}
```

**What needs to change in `WhatsAppBot.jsx`:**

1. Remove the `INITIAL_GROUPS` hardcoded array at the top of the file
2. On component mount, call `circleApi.list()` and store result in state
3. Map the API response to the group shape the bot needs:
   ```js
   // map circle → group shape for the bot
   {
     id: circle.id,           // use real id
     name: circle.name,       // circle name
     members: circle.current_member_count,
     savings: circle.pool_balance,
     loans: 0,                // not available yet, default 0
     lastActive: "recently",  // not available yet, default string
     facilitator: "Admin",    // not available yet, default string
   }
   ```
4. Show a loading state while fetching (`"Loading your circles…"`)
5. Show an empty state if user has no circles (`"You have no circles yet. Create one in the Circles page."`)
6. Set the first circle as the default selected group once loaded

**Code location:** `frontend/src/pages/WhatsAppBot.jsx`  
**Import needed:** `import { circleApi } from '../services/api'`

---

### Task 2 — Match App UI Style

**What to do:**  
Restyle the WhatsApp Bot page to match the rest of the app's design language.

**App Design System (copy these values):**

| Token | Value |
|---|---|
| Background | `#F7F9FC` |
| Card background | `#FFFFFF` |
| Primary green | `#1D9E75` |
| Primary dark | `#0E7A5A` |
| Text primary | `#1A2332` |
| Text muted | `#6B7A8D` |
| Text light | `#8899AA` |
| Border | `#E2E8F0` |
| Card shadow | `0 2px 12px rgba(0,0,0,0.06)` |
| Border radius | `12px` |
| Font | `'Sora', sans-serif` |

**WhatsApp green (keep these — they are WhatsApp brand colors):**

| Token | Value |
|---|---|
| WhatsApp green | `#25D366` |
| WhatsApp dark header | `#128C7E` |

**Specific UI changes needed:**

1. **Page background** → change from `#080C0A` to `#F7F9FC`
2. **Group selector cards** → white cards with light border, same style as circle cards in `Circles.jsx`
3. **Chat window** → keep the WhatsApp dark chat bubble area (`#0a1612` background for messages is fine — this matches real WhatsApp), but the surrounding container should use app card style
4. **Header section** → match the page header style from `Circles.jsx` (white background, `#1A2332` title text)
5. **Commands table** at the bottom → white card, light borders, same as other tables in the app
6. **Font** → change `'DM Mono'` / `'Syne'` references to `'Sora'` for non-code text
7. **Remove the dark `globalStyles` import** for DM Mono/Syne fonts — the app already loads Sora via `index.css`

**Reference files to copy style from:**
- `frontend/src/pages/Circles.jsx` → look at the `styles` object at the bottom for card/page styles
- `frontend/src/index.css` → global CSS variables

---

## Files You Need to Edit

| File | What to change |
|---|---|
| `frontend/src/pages/WhatsAppBot.jsx` | Main file — all your changes go here |
| `frontend/src/services/api.js` | DO NOT change — just import `circleApi` from here |

**Do NOT touch:**
- `frontend/src/main.jsx` — routing is already set up
- `frontend/src/components/Navbar.jsx` — nav link is already there
- Any backend files
- Any other page files

---

## How to Run the Project

```bash
# Terminal 1 — Backend
cd backend
venv\Scripts\activate        # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload
# runs at http://localhost:8000

# Terminal 2 — Frontend
cd frontend
npm install
npm run dev
# runs at http://localhost:5173
```

Register a user at `/register`, create some circles at `/circles`, then go to `/whatsapp-bot` to test.

---

## Current `WhatsAppBot.jsx` Structure (so you know what's where)

```
WhatsAppBot.jsx
│
├── C = { ... }                  ← OLD dark theme tokens — REPLACE with app tokens
├── INITIAL_GROUPS = [ ... ]     ← REMOVE — replace with API call
├── CMDS = { en: [...], hi: [...] }   ← keep as-is (bot commands)
├── T = { en: {...}, hi: {...} }      ← keep as-is (bot response templates)
│
└── export default function WhatsAppBot()
    ├── useState: lang, groups, selectedGroup, chatInput, loading, attempts
    ├── useEffect: scroll to bottom on new message   ← keep
    │
    ├── ADD: useEffect on mount → circleApi.list() → setGroups(mapped data)
    │
    ├── switchGroup(g)    ← keep
    ├── switchLang(l)     ← keep
    ├── sendMessage(text) ← keep logic, no changes needed
    │
    └── return JSX
        ├── Header section          ← restyle
        ├── Group selector (left)   ← restyle + use real API data
        ├── Chat window (right)     ← keep WhatsApp colors inside, restyle wrapper
        └── Commands table (bottom) ← restyle
```

---

## Expected Final Result

- Page background is light (`#F7F9FC`), matches rest of app
- Group selector shows the user's **real circles** from the database
- Loading spinner shown while circles are being fetched
- Empty state shown if user has no circles
- Chat window still looks like WhatsApp (dark green header, chat bubbles)
- Commands table looks like a white card matching app style
- Fonts and colors consistent with rest of app

---

## Quick Reference — circleApi

```js
import { circleApi } from '../services/api'

// In useEffect:
circleApi.list().then(r => {
  const mapped = r.data.map(c => ({
    id: c.id,
    name: c.name,
    members: c.current_member_count,
    savings: c.pool_balance,
    loans: 0,
    lastActive: 'recently',
    facilitator: 'Admin',
  }))
  setGroups(mapped)
  if (mapped.length > 0) setSelectedGroup(mapped[0])
}).catch(() => {})
```

---

*Last updated by Amazon Q — refer to `README.md` for full project setup.*
