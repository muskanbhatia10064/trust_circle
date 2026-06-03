# 🎯 DEMO PLAN — TrustCircle Hackathon Strategy

> **Core principle: build a demo that tells a story, not a product that does everything.**
> Judges watch a 3-minute pitch — your job is one "wow" moment per section.

---

## 🌟 THE 3 DEMO MOMENTS YOU NEED

### 1️⃣ The Trust Score Moving in Real-Time
**What:** A user pays, and the Trust Score ring animates upward.

**Why:** Visual proof your core idea works. Takes 10 seconds to show, stays in judges' heads for 10 minutes.

**Implementation:**
- Use a radial progress bar with smooth CSS animation (0.8s ease-out)
- Show score jumping from 650 → 680 when payment is submitted
- Display "+30" floating badge next to the score during animation

---

### 2️⃣ The WhatsApp Bot Replying
**What:** Show a real WhatsApp (or a great mock) where someone types "what's my balance?" and gets an instant reply.

**Why:** Low-tech but high-impact. Proves accessibility for rural users.

**Implementation:**
- Twilio WhatsApp Sandbox (free tier works)
- 3 commands only:
  - `balance` → "आपका बैलेंस: ₹2,400"
  - `status` → "Circle: Priya का समूह | अगली किस्त: 5 जून"
  - `pay` → "₹1,500 जमा हो गया। धन्यवाद!"
- Pre-record a phone screen video or use a live demo during pitch

---

### 3️⃣ The Social Impact Counter Live
**What:** Admin dashboard showing "47 credit identities created, ₹3,40,000 secured across 12 circles."

**Why:** Real numbers from your seeded demo data. Makes the mission tangible.

**Implementation:**
- Big hero stats on admin dashboard (or home page for judges)
- Use CountUp.js for animated number counters
- Show a simple bar chart: "Circles by District" with real UP/Bihar names

---

## 👥 UPDATED TEAM SPLIT (Beginner-Friendly)

### 🎨 PERSON 1 & 2 — Frontend (Next.js? No, stick to React + Vite for speed)

**Person 1 Focus:**
- Trust Score page with animated radial bar
- Circle dashboard card with member list
- Payment form that triggers the score animation
- Demo data seeding script (Indian names, amounts, dates)

**Person 2 Focus:**
- Admin dashboard with social impact counters (CountUp.js)
- Map component with Leaflet showing circles in UP/Bihar
- Design system: colors, fonts, button styles (export as reusable CSS classes)
- Navbar, footer, responsive layout

**Shared:**
- ONE font: [Sora](https://fonts.google.com/specimen/Sora) or [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans)
- ONE accent color: `#1D9E75` (use it for buttons, badges, highlights, focus rings)
- NO other animations except: Trust Score ring + payment badge flip (pending → paid)

---

### ⚙️ PERSON 3, 4 & 5 — Backend + Bot

**Person 3 Focus:**
- Express.js API (simpler than FastAPI for quick demo)
- PostgreSQL with 5 tables ONLY:
  - `users` (id, name, phone, district, trust_score)
  - `circles` (id, name, district, pool_balance, status)
  - `members` (id, user_id, circle_id, joined_at)
  - `transactions` (id, user_id, circle_id, amount, date, status)
  - `trust_scores` (id, user_id, score, updated_at)
- 3 API endpoints:
  - `POST /circles` — create circle
  - `POST /payments` — record payment, update trust score
  - `GET /trust-score/:userId` — fetch score

**Person 4 Focus:**
- WhatsApp bot using Twilio Sandbox
- 3 commands: `balance`, `status`, `pay`
- Replies in Hindi/English mix
- Test with your own phone number first

**Person 5 Focus:**
- Seed realistic demo data (see below)
- Admin dashboard endpoint: `GET /stats` returning total users, circles, amount, district breakdown
- Deploy backend to Railway/Render/Vercel (free tier)
- Help Person 3 & 4 with testing

---

## 📊 REALISTIC DEMO DATA (30 minutes to seed, changes everything)

### Indian Names (use these, NOT "User 1" or "John Doe")
```javascript
const DEMO_USERS = [
  { name: "Priya Sharma", phone: "9876543210", district: "Lucknow", trust_score: 720 },
  { name: "Rahul Verma", phone: "9876543211", district: "Varanasi", trust_score: 680 },
  { name: "Anjali Singh", phone: "9876543212", district: "Gorakhpur", trust_score: 650 },
  { name: "Amit Kumar", phone: "9876543213", district: "Patna", trust_score: 710 },
  { name: "Neha Gupta", phone: "9876543214", district: "Kanpur", trust_score: 690 },
  { name: "Ravi Yadav", phone: "9876543215", district: "Gaya", trust_score: 700 },
  { name: "Sunita Devi", phone: "9876543216", district: "Allahabad", trust_score: 660 },
  { name: "Vikash Pandey", phone: "9876543217", district: "Varanasi", trust_score: 730 },
  { name: "Kavita Mishra", phone: "9876543218", district: "Lucknow", trust_score: 675 },
  { name: "Suresh Tiwari", phone: "9876543219", district: "Gorakhpur", trust_score: 695 }
]

const DEMO_CIRCLES = [
  { name: "Priya का समूह", district: "Lucknow", contribution: 1500, pool: 18000 },
  { name: "महिला बचत मंडल", district: "Varanasi", contribution: 2000, pool: 24000 },
  { name: "किसान सहायता चक्र", district: "Gorakhpur", contribution: 1000, pool: 12000 },
  { name: "गाँव विकास समूह", district: "Patna", contribution: 1200, pool: 14400 }
]
```

### Amounts (use ₹, not $)
- Monthly contributions: ₹500, ₹1,000, ₹1,500, ₹2,000
- Pool balances: ₹12,000 to ₹24,000
- Trust scores: 650-750 range (not 300-900, too wide for demo)

### Dates (recent, relatable)
- Last payment: "28 May 2024"
- Next due: "5 June 2024"
- Circle created: "15 April 2024"

### Districts (real UP/Bihar villages, judges from these regions will notice)
- Lucknow, Varanasi, Gorakhpur, Kanpur, Allahabad (UP)
- Patna, Gaya, Muzaffarpur (Bihar)

---

## 🎨 DESIGN RULES (What Makes It NOT Look AI-Generated)

### ✅ DO THIS
1. **ONE font, ONE accent color — commit**
   - Font: `Sora` or `Plus Jakarta Sans` (Google Fonts)
   - Accent: `#1D9E75` (green from original doc)
   - Use ONLY this green for: buttons, badges, score ring, focus states, links

2. **Animate exactly TWO things**
   - Trust Score ring counter (radial bar fills up, number counts up)
   - Payment status badge flip: `pending` (gray) → `paid` (green) with a subtle scale bounce

3. **Show a map with real village names**
   - Use [Leaflet.js](https://leafletjs.com/) (lightweight, free)
   - Pin 5-6 circles on the map with UP/Bihar coordinates
   - On hover: show circle name + member count

4. **Big numbers on the hero section**
   ```
   47 Credit Identities Created
   ₹3,40,000 Secured Across 12 Circles
   89% On-Time Repayment Rate
   ```
   Use CountUp.js to animate these on page load

5. **Use real photos (if possible) or illustrations (NOT stock corporate photos)**
   - [unDraw](https://undraw.co/) illustrations with `#1D9E75` accent
   - Or Indian context photos from [Unsplash](https://unsplash.com/s/photos/india-village)

---

### ❌ DON'T DO THIS
- Don't use more than 2 shades of green
- Don't animate every hover state (only buttons need hover effects)
- Don't use lorem ipsum anywhere — use real Hindi/English text
- Don't show "Example User" or "Test Circle" — everything is named realistically
- Don't build admin login — just a public stats page judges can see

---

## 🗺️ MAP IMPLEMENTATION (Leaflet.js)

### Install
```bash
npm install leaflet react-leaflet
```

### Code Snippet (Person 2)
```jsx
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

const CIRCLES = [
  { name: "Priya का समूह", lat: 26.8467, lng: 80.9462, members: 12 }, // Lucknow
  { name: "महिला बचत मंडल", lat: 25.3176, lng: 82.9739, members: 15 }, // Varanasi
  { name: "किसान सहायता चक्र", lat: 26.7606, lng: 83.3732, members: 10 }, // Gorakhpur
  { name: "गाँव विकास समूह", lat: 25.5941, lng: 85.1376, members: 18 }  // Patna
]

export default function CircleMap() {
  return (
    <MapContainer center={[26.0, 82.0]} zoom={7} style={{ height: '400px', width: '100%' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {CIRCLES.map((c, i) => (
        <Marker key={i} position={[c.lat, c.lng]}>
          <Popup>{c.name} — {c.members} members</Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
```

---

## 🤖 WHATSAPP BOT (Twilio Sandbox — Person 4)

### Setup (5 minutes)
1. Sign up: https://www.twilio.com/try-twilio
2. Go to: Console → Messaging → Try it Out → Send a WhatsApp message
3. Save your sandbox number (e.g. `+1 415 523 8886`)
4. Join sandbox: WhatsApp that number with "join <your-code>"

### Express Webhook (Person 4)
```javascript
const express = require('express')
const twilio = require('twilio')
const app = express()

app.use(express.urlencoded({ extended: false }))

app.post('/whatsapp', (req, res) => {
  const incomingMsg = req.body.Body.toLowerCase().trim()
  const from = req.body.From
  
  const twiml = new twilio.twiml.MessagingResponse()
  
  if (incomingMsg === 'balance') {
    twiml.message('आपका बैलेंस: ₹2,400\nअगली किस्त: 5 जून')
  } else if (incomingMsg === 'status') {
    twiml.message('Circle: Priya का समूह\nस्थिति: सक्रिय ✅\nसदस्य: 12')
  } else if (incomingMsg === 'pay') {
    twiml.message('₹1,500 जमा हो गया। धन्यवाद! 🙏\nआपका Trust Score: 680 → 710')
  } else {
    twiml.message('Commands: balance, status, pay')
  }
  
  res.type('text/xml').send(twiml.toString())
})

app.listen(3000, () => console.log('WhatsApp bot running on port 3000'))
```

### Expose locally for testing (Person 4)
```bash
npx localtunnel --port 3000
# Copy the URL, paste into Twilio Console → Messaging → Sandbox Settings → "When a message comes in"
```

---

## 🎬 DEMO SCRIPT (3 minutes, practice this 10 times)

### Slide 1 — Problem (20 sec)
"350 million Indians are credit invisible. No loans, no dreams. Banks won't touch them."

### Slide 2 — Solution (20 sec)
"TrustCircle turns community lending into credit identity. Pay your ROSCA on time? Your Trust Score grows."

### Slide 3 — DEMO MOMENT 1 (30 sec)
**[Share screen: Trust Score page]**
"Watch this. Priya pays ₹1,500 today."
**[Click Pay → score ring animates 650 → 680]**
"Her Trust Score just jumped. This is her new credit passport."

### Slide 4 — DEMO MOMENT 2 (30 sec)
**[Share screen: Phone with WhatsApp open]**
"Priya's phone? A ₹2,000 feature phone. No app needed."
**[Type 'balance' → bot replies instantly in Hindi]**
"WhatsApp bot. Works on USSD too. Zero internet required."

### Slide 5 — DEMO MOMENT 3 (30 sec)
**[Share screen: Admin dashboard]**
"47 people now have a credit identity. ₹3.4 lakh secured across 12 circles."
**[Show map with pins in Lucknow, Varanasi, Gorakhpur]**
"This is Uttar Pradesh. This is Bihar. This is scale."

### Slide 6 — Traction / Impact (20 sec)
"We're piloting with 3 NGOs in June. 200 circles by December. 5,000 credit identities by 2025."

### Slide 7 — Ask (10 sec)
"We need ₹15 lakh to integrate with Credit Bureaus. Help us make 350 million Indians visible."

---

## 📦 FINAL CHECKLIST BEFORE DEMO

- [ ] All names are Indian (no "John", "User 1")
- [ ] All amounts use ₹ (no $)
- [ ] All dates are recent (May/June 2024)
- [ ] Trust Score animates smoothly
- [ ] WhatsApp bot replies in <2 seconds
- [ ] Map shows real UP/Bihar districts
- [ ] Impact counters animate on page load
- [ ] Only ONE green (#1D9E75) used everywhere
- [ ] Font is consistent (Sora or Plus Jakarta Sans)
- [ ] Payment badge flips from gray → green
- [ ] No other animations distract from these 2
- [ ] Demo data seeded in database
- [ ] Backend deployed (Railway/Render)
- [ ] Frontend deployed (Vercel/Netlify)
- [ ] Test the entire flow 10 times before presenting

---

## 🚀 DEPLOYMENT TARGETS

**Backend:** Railway.app (free tier, Postgres included)  
**Frontend:** Vercel (free tier, auto-deploys from GitHub)  
**WhatsApp Bot:** Same Railway backend, expose `/whatsapp` endpoint

---

**Remember:** Judges don't care if your backend has 47 endpoints. They care if your 3-minute demo made them feel something. Build the story, not the product.
