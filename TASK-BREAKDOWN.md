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

* [ ] Create project folder and initialize:

  ```bash
  npx create-next-app@latest realtime-stock-market --typescript
  ```
* [ ] Install base dependencies:
  `tailwindcss`, `shadcn/ui`, `dotenv`, `axios`, `mongoose`.
* [ ] Configure Tailwind CSS and setup shadcn/ui components.
* [ ] Clean default Next.js boilerplate (remove demo files, update metadata).
* [ ] Create `.env.local` file and add placeholders for all environment variables.
* [ ] **Create `/devops` folder** with local development setup
* [ ] Verify MongoDB container runs and connects successfully from your local app.

**Deliverables:**
- ✅ Working Next.js base project
- ✅ Tailwind + shadcn configured
- ✅ Local MongoDB container running via Docker
- ✅ `.env` file prepared for all API keys and secrets

---

## **Phase 1 — Layout & Header**

**Time:** ~0.5 Day

**Tasks:**

* [ ] Build global layout (`layout.tsx`) and header/navigation bar.
* [ ] Include navigation links: Home, Stocks, Login, Register.
* [ ] Style with Tailwind and shadcn/ui.
* [ ] Ensure responsive layout (desktop/mobile views).

**Deliverables:**
- ✅ Shared layout and navigation implemented
- ✅ Base UI structure ready for all routes

---

## **Phase 2 — Homepage & Charts**

**Time:** ~1 Day

**Tasks:**

* [ ] Create homepage with:

  * Market summary section
  * Featured stocks list
  * Example chart component
* [ ] Integrate **Finnhub API** for initial data (e.g., S&P500 index, trending symbols).
* [ ] Implement chart visualization (using **Recharts** or **ApexCharts**).
* [ ] Add loading, error, and empty states.
* [ ] Make the page fully responsive.

**Deliverables:**
- ✅ Homepage displays dynamic market data with charts
- ✅ Chart updates when data changes

---

## **Phase 3 — Auth UI & Layout**

**Time:** ~1 Day

**Tasks:**

* [ ] Create **Sign Up** and **Sign In** pages using shadcn/ui components.
* [ ] Build Auth layout (`app/(auth)/layout.tsx`) separate from main layout.
* [ ] Add input validation and error states.
* [ ] Ensure seamless navigation between Auth and main pages.

**Deliverables:**
- ✅ Auth pages visually complete
- ✅ Frontend validation and navigation ready

---

## **Phase 4 — Database Setup**

**Time:** ~0.5 Day

**Tasks:**

* [ ] Connect to **MongoDB** via Mongoose using `MONGODB_URI` from `.env`.
* [ ] Define initial models:

  * `User` (email, name, subscribed flag)
  * `Watchlist` (optional later)
* [ ] Verify DB connection and seed test data.
* [ ] Confirm persistence by restarting containers.

**Deliverables:**
- ✅ MongoDB schema defined
- ✅ Database connectivity verified

---

## **Phase 5 — Authentication Logic (Better Auth)**

**Time:** ~1 Day

**Tasks:**

* [ ] Install and configure **Better Auth** library.
* [ ] Implement full auth flow: Sign Up, Sign In, Sign Out.
* [ ] Protect routes using middleware (auth guard).
* [ ] Store user sessions securely (cookies / JWT).
* [ ] Connect backend logic to MongoDB user model.

**Deliverables:**
- ✅ Auth backend implemented
- ✅ Protected routes working correctly

---

## **Phase 6 — Daily News Summary (AI + Automation)**

**Time:** ~2 Days

**Tasks:**

* [ ] Install and initialize **Inngest** CLI:

  ```bash
  npx inngest-cli@latest dev
  ```
* [ ] Create a **daily cron job workflow** using Inngest:

  * Fetch top market data (Finnhub)
  * Fetch market news
  * Generate AI summary via **Google Gemini API**
  * Send formatted email via **Nodemailer**
  * Include unsubscribe “Stop Daily Emails” step
* [ ] Write helper functions:

  * `fetchMarketData()`
  * `generateAISummary()`
  * `sendDailyEmail()`
* [ ] Add logs to track workflow status.
* [ ] Test workflow locally with `inngest dev`.

**Deliverables:**
- ✅ Fully automated AI-generated daily summary email
- ✅ Workflow tested locally via Inngest CLI

---

## **Phase 7 — Stocks Search**

**Time:** ~1 Day

**Tasks:**

* [ ] Implement `/api/search?q=` endpoint (Next.js API route).
* [ ] Integrate **Finnhub API** to fetch symbol search results.
* [ ] Build search UI with debounce + result dropdown.
* [ ] Display company name, ticker, and logo.
* [ ] Handle empty state and errors gracefully.

**Deliverables:**
- ✅ Stock search functional with Finnhub data

---

## **Phase 8 — Stock Details**

**Time:** ~1 Day

**Tasks:**

* [ ] Create dynamic route `/stock/[symbol]`.
* [ ] Fetch:

  * Real-time quote data
  * Historical candle data
  * Company info (sector, market cap, etc.)
* [ ] Render interactive chart (ApexCharts or Recharts).
* [ ] Add “Add to Watchlist” button (if implementing Phase 10).

**Deliverables:**
- ✅ Fully functional stock details page with charts and info

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
- ✅ Live app deployed to Vercel
- ✅ Inngest and email automation confirmed working

---

## **Phase 10 — Stop Daily Emails**

**Time:** ~0.25 Day

**Tasks:**

* [ ] Implement `/api/unsubscribe` endpoint.
* [ ] Add “Stop Daily Emails” link in every summary email.
* [ ] Update user’s subscription flag in MongoDB.
* [ ] Modify Inngest workflow to skip unsubscribed users.

**Deliverables:**
- ✅ Unsubscribe functionality working correctly

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