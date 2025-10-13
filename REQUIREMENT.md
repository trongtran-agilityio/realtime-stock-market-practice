# Real-Time Stock Market App - Requirements

## Objective

Build and deploy a **real-time stock market web app** that lets users sign up, search symbols, view interactive charts and company info, and receive an **automated daily market/news summary email** generated with AI—following the end-to-end flow shown in the referenced video.

---

## Scope

* **Public pages:** Landing/Home with market sections & charts.
* **Auth:** Sign up / Sign in, protected routes using Better Auth.
* **Search:** Symbol search powered by Finnhub API.
* **Stock details:** Symbol page with interactive price chart + key info.
* **Automation:** Inngest workflow that fetches daily market/news, generates an **AI summary**, and emails users (with a control to stop daily emails).
* **Deployment:** Production deployment with environment variables configured.
* **(Optional challenge):** Watchlist CRUD.

> **Note on alerts:** Price/watch alerts are a stretch goal; the core implemented automation is the **daily email summary**.

---

## Tech Stack

### Frontend

* Next.js (App Router), React, TypeScript
* Tailwind CSS, shadcn/ui components

### Backend (within Next.js)

* API routes / server actions
* **Better Auth** (authentication & route protection)
* **Inngest** (event/cron workflows for daily jobs)

### Database

* **MongoDB** (via `MONGODB_URI`)

### 3rd-party Services / APIs

* **Finnhub** (market data & search)
* **Google Gemini** (AI summaries). //TODO: checking
* **Nodemailer** (SMTP emails)

### Environment Variables

```bash
# Core
NODE_ENV
NEXT_PUBLIC_BASE_URL

# Finnhub
NEXT_PUBLIC_NEXT_PUBLIC_FINNHUB_API_KEY
FINNHUB_BASE_URL

# MongoDB
MONGODB_URI

# Better Auth
BETTER_AUTH_SECRET
BETTER_AUTH_URL

# Gemini (//TODO)
GEMINI_API_KEY

# Nodemailer (SMTP)
NODEMAILER_EMAIL
NODEMAILER_PASSWORD
```

> Local workflows: run `npx inngest-cli@latest dev`.

---

## Non-functional Requirements

* Secrets in `.env`; server-only usage for sensitive keys.
* Basic rate limiting/backoff for Finnhub requests.
* Type-safe code (TypeScript), linting/formatting.
* Responsive UI and accessible components.
* Minimal logging for workflows and email dispatch.

---

## Success Criteria (Definition of Done)

* Authenticated users can **search** symbols, open a **stock detail page** with interactive charts/metrics, and receive a **daily AI market/news email** generated via Gemini (maybe) through an Inngest workflow and sent via Nodemailer.
* App runs in **production** with all environment variables correctly configured.
