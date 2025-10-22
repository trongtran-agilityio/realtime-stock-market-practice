# Real-Time Stock Market App - Task Breakdown

**Project:** Real-Time Stock Market App with AI Daily Summary

**Framework:** Next.js (App Router)

**Duration:** ~8–9 Days (solo learner)

**Owner:** NextJS trainee

**Goal:** Deliver a deployed, fullstack Next.js application integrating real-time data, AI, and automation.

---

## **Phase 0 — Project Setup**

**Time:** ~1 Day

**Goals:**
Initialize the Next.js app, set up UI framework, environment files, and prepare DevOps folder for local infrastructure.

**Tasks:**

* [x] Create project folder and initialize:

  ```bash
  npx create-next-app@latest realtime-stock-market --typescript
  ```
* [x] Install base dependencies:
  `tailwindcss`, `shadcn/ui`, `dotenv`, `axios`, `mongoose`.
* [x] Configure Tailwind CSS and setup shadcn/ui components.
* [x] Clean default Next.js boilerplate (remove demo files, update metadata).
* [x] Create `.env` file and add placeholders for all environment variables.
* [x] **Create `/devops` folder** with local development setup
* [x] Verify MongoDB container runs and connects successfully from your local app.

Notes:
- Start services: bash devops/start-all-services.sh
- Stop services: bash devops/stop-all-services.sh
- Local Mongo URI (pre-filled in .env): mongodb://appuser:apppass@localhost:27017/realtime_stock?authSource=admin
- Mongo Express (UI): http://localhost:8081

**Deliverables:**
- Working Next.js base project
- Tailwind + shadcn configured
- Local MongoDB container running via Docker
- `.env` file prepared for all API keys and secrets

---

## **Phase 1 — Layout & Header**

**Time:** ~0.5 Day

**Tasks:**

* [x] Build global layout (`layout.tsx`) and header/navigation bar.
* [x] Include navigation links: Dashboard, Search, Watchlist.
* [x] Style with Tailwind and shadcn/ui.
* [x] Ensure responsive layout (desktop/mobile views).

**Deliverables:**
- Shared layout and navigation implemented
- Base UI structure ready for all routes

---

## **Phase 2 — Homepage & Charts**

**Time:** ~1 Day

**Tasks:**

* [x] Create homepage with:

  * Market summary section
  * Featured stocks list
  * Example chart component
* [ ] Integrate **Finnhub API** for initial data (e.g., S&P500 index, trending symbols).
* [x] Implement chart visualization (using **Trading View widgets**).
* [ ] Add loading, error, and empty states.
* [ ] Make the page fully responsive.

**Deliverables:**
- Homepage displays dynamic market data with charts
- Chart updates when data changes

---

## **Phase 3 — Auth UI & Layout**

**Time:** ~1 Day

**Tasks:**

* [x] Create **Sign Up** page using shadcn/ui components.
* [x] Create **Sign In** page using shadcn/ui components.
* [x] Build Auth layout (`app/(auth)/layout.tsx`) separate from main layout.
* [x] Add input validation and error states.
* [x] Ensure seamless navigation between Auth and main pages.

**Deliverables:**
- Auth pages visually complete
- Frontend validation and navigation ready

---

## **Phase 4 — Database Setup**

**Time:** ~0.5 Day

**Tasks:**

* [x] Connect to **MongoDB** via Mongoose using `MONGODB_URI` from `.env`.
* [x] Define initial models:

  * `User` (email, name, subscribed flag)
  * `Watchlist` (optional later)
* [x] Verify DB connection and seed test data.
* [x] Confirm persistence by restarting containers.

**Deliverables:**
- MongoDB schema defined
- Database connectivity verified

---

## **Phase 5 — Authentication Logic (Better Auth)**

**Time:** ~1 Day

**Tasks:**

* [x] Install and configure **Better Auth** library.
* [x] Implement full auth flow: Sign Up, Sign In, Sign Out.
* [x] Protect routes using middleware (auth guard).
* [x] Store user sessions securely (cookies / JWT).
* [x] Connect backend logic to MongoDB user model.

**Deliverables:**
- Auth backend implemented
- Protected routes working correctly

---

## **Phase 6 — Daily News Summary (AI + Automation)**

**Time:** ~2 Days

**Tasks:**

* [x] Install and initialize **Inngest** CLI:

  ```bash
  npx inngest-cli@latest dev
  ```
* [x] Create a **daily cron job workflow** using Inngest:

  * Fetch top market data (Finnhub)
  * Fetch market news
  * Generate AI summary via **Google Gemini API**
  * Send formatted email via **Nodemailer**
* [x] Write helper functions:

  * `fetchMarketData()`
  * `generateAISummary()`
  * `sendDailyEmail()`
* [x] Add logs to track workflow status.
* [x] Test workflow locally with `inngest dev`.

**Deliverables:**
- Fully automated AI-generated daily summary email
- Workflow tested locally via Inngest CLI

---

## **Phase 7 — Stocks Search**

**Time:** ~1 Day

**Tasks:**

* [x] Implement `/api/search?q=` API from Finnhub.
* [x] Integrate **Finnhub API** to fetch symbol search results.
* [x] Build search UI with debounce + result dropdown.
* [x] Display company name, ticker, and logo.
* [x] Handle empty state and errors gracefully.

**Deliverables:**
- Stock search functional with Finnhub data

---

## **Phase 8 — Stock Details**

**Time:** ~1 Day

**Tasks:**

* [x] Create dynamic route `/stock/[symbol]`.
* [x] Fetch:

  * Real-time quote data
  * Historical candle data
  * Company info (sector, market cap, etc.)
* [x] Render interactive chart (ApexCharts or Recharts).
* [x] Add “Add to Watchlist” button (if implementing Phase 10).

**Deliverables:**
- Fully functional stock details page with charts and info

---

## **Phase 9 — Deployment**

**Time:** ~0.5 Day

**Tasks:**

* [ ] Prepare production `.env` with secrets (Finnhub, Gemini, Better Auth, Nodemailer).
* [ ] Deploy app to **Vercel**.
* [ ] Verify Inngest workflow in production environment.
* [ ] Confirm emails send correctly from production.
* [ ] Configure HTTPS and domain if applicable.

**Deliverables:**
- Live app deployed to Vercel
- Inngest and email automation confirmed working

---

## **Phase 10 — Stop Daily Emails**

**Time:** ~0.25 Day

**Tasks:**

* [ ] Implement `/api/unsubscribe` endpoint.
* [ ] Add “Stop Daily Emails” link in every summary email.
* [ ] Update user’s subscription flag in MongoDB.
* [ ] Modify Inngest workflow to skip unsubscribed users.

**Deliverables:**
- Unsubscribe functionality working correctly

---

## **Phase 11 — Challenge: Watchlist CRUD 🎯**

**Time:** ~1 Day *(Optional)*

**Tasks:**

* [ ] Create `Watchlist` model in MongoDB.
* [ ] API routes:

  * `POST /api/watchlist` → Add stock
  * `GET /api/watchlist` → Get list
  * `DELETE /api/watchlist/:id` → Remove
* [ ] Build UI for managing watchlist in dashboard.
* [ ] Show stock details with “Add to Watchlist” button.

### ✅ Final Deliverable

A **deployed, fullstack Next.js app** featuring:

* Secure user auth (Better Auth)
* Real-time market data via Finnhub
* Interactive charts
* AI-generated daily market summary (Gemini)
* Automated emails (Nodemailer)
* Deployed workflows (Inngest)
* Optional watchlist management