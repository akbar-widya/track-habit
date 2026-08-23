<div align="center">

# HabitEngine

**A fast, focused habit tracker — rolling check-in grids, streaks, GitHub-style heatmaps, and strict per-user data isolation, running entirely on the Cloudflare edge.**

🌐 **Live demo:** [https://track-habit.akbarwidya-dev.workers.dev](https://track-habit.akbarwidya-dev.workers.dev)

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-38B2AC?style=flat-square&logo=tailwindcss&logoColor=white)
![React Hook Form](https://img.shields.io/badge/React%20Hook%20Form-EC5990?style=flat-square&logo=reacthookform&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-3E67B1?style=flat-square&logo=zod&logoColor=white)
![Hono](https://img.shields.io/badge/Hono-E36002?style=flat-square&logo=hono&logoColor=white)
![Cloudflare Workers](https://img.shields.io/badge/Cloudflare%20Workers-F38020?style=flat-square&logo=cloudflare&logoColor=white)
![Cloudflare D1](https://img.shields.io/badge/Cloudflare%20D1-F38020?style=flat-square&logo=cloudflare&logoColor=white)
![Drizzle ORM](https://img.shields.io/badge/Drizzle%20ORM-C5F74F?style=flat-square&logo=drizzle&logoColor=black)
![Better Auth](https://img.shields.io/badge/Better%20Auth-4F46E5?style=flat-square&logo=auth0&logoColor=white)
![pnpm](https://img.shields.io/badge/pnpm-11-F69220?style=flat-square&logo=pnpm&logoColor=white)

</div>

---

## Overview

HabitEngine is a full-stack habit tracker built as a **portfolio showcase of edge-native engineering**: a React SPA and a Hono API Worker deployed as a **single Cloudflare Worker** with static assets, backed by **Cloudflare D1** (serverless SQLite) through **Drizzle ORM**, with authentication handled end-to-end by **better-auth**.

The project is organized as a PNPM workspace with two packages — `frontend/` and `backend/` — but ships as one origin in production: the Worker serves both the static site and every `/api` route from the same domain. One domain means one cookie scope, zero CORS configuration, and identical request paths between local development and production.

---

## Key Features

### Authentication (Email + Google OAuth)
Email/password sign-up and sign-in plus Google social login, powered by better-auth 1.x with its Drizzle adapter. Sessions are cookie-based and work identically for both the API and the SPA because everything shares one origin. Expired sessions surface as friendly messages on the client instead of raw errors.

### Per-User Data Isolation
A `requireAuth` middleware guards every habit endpoint. All six habit routes filter by `user_id`, so users can only ever see and mutate their own rows. Cross-user access attempts receive a uniform `404` (anti-IDOR), and a foreign-key cascade (`ON DELETE CASCADE`) removes a user's habits when their account is deleted.

### Habit Management
Full CRUD for habits: categories (`Health` / `Work` / `Mindset`), frequencies (`Daily` / `Weekly` / `Monthly`), daily targets with optional units, inline editing/deleting behind a confirmation dialog. Payloads are validated twice — React Hook Form + Zod on the client, `@hono/zod-validator` + Zod on the server.

### Daily Check-Ins
A rolling 7-day grid always keeps "Today" at the far right, with a 7-day grace period for backfilling missed days. Duplicate check-ins are rejected with `409`, future dates with `400`, and any day can be toggled back off.

### Insights & Analytics
Per-habit streak counters computed from completed dates, a 28-day GitHub-style activity heatmap, and a performance trend view rendered with lightweight hand-rolled charts — no chart library in the bundle.

---

## Tech Stack

| Layer            | Technology                                                        |
|------------------|-------------------------------------------------------------------|
| Frontend         | React 19, Vite 8, TypeScript 6, Tailwind CSS 4                    |
| State/Forms      | React Hook Form, Zod, `@hookform/resolvers`                       |
| API              | Hono 4, `@hono/zod-validator`, Better Auth 1.7                     |
| Database         | Cloudflare D1 (SQLite), Drizzle ORM + drizzle-kit migrations      |
| Auth             | Better Auth (email/password + Google OAuth, Drizzle adapter)      |
| Icons            | lucide-react                                                      |
| Tooling          | PNPM workspaces, ESLint, Wrangler 4                               |

---

## Architecture Highlight

- **Single-domain deployment.** `wrangler.jsonc` configures Worker Assets to serve `frontend/dist` with `not_found_handling: "single-page-application"`, while `run_worker_first: ["/api", "/api/*"]` pushes every API call through the same Worker first. The result is one origin serving both UI and API.
- **Dev/prod path parity.** In development, Vite proxies `/api` → `http://127.0.0.1:8787` *without* rewriting paths, so frontend code uses relative `/api` URLs everywhere and behaves identically locally and in production.
- **Versioned SQL migrations.** Schema changes ship as explicit Drizzle-generated SQL files applied via `wrangler d1 migrations apply` against local or remote D1. One migration is hand-written (`DROP TABLE` + `CREATE TABLE`) because SQLite cannot add an `ON DELETE CASCADE` constraint via `ALTER TABLE`.
- **Configurable trusted origins.** better-auth's `trustedOrigins` is derived from a comma-separated `TRUSTED_ORIGINS` environment variable (falling back to `http://localhost:5173` in development), keeping CSRF protection correct across environments.

---

## Project Structure

```
track-habit/
├── frontend/                      # React + Vite SPA (port 5173)
│   └── src/
│       ├── components/            # Landing, AuthPanel, Dashboard,
│       │                          # HabitList/Item/Form, PerformanceTrend,
│       │                          # ConfirmDialog
│       ├── hooks/                 # useHabits, useLocalStorage
│       ├── api/                   # typed habit API client
│       ├── lib/                   # auth-client (better-auth)
│       └── utils/                 # date helpers (streak calc), cn()
├── backend/                       # Hono Worker (port 8787)
│   ├── src/
│   │   ├── index.ts               # worker wrapper: /api/auth/* + habit routes
│   │   ├── auth.ts                # createAuth() better-auth factory
│   │   ├── schema/                # Drizzle tables (habits + auth tables)
│   │   ├── validator.ts           # Zod schemas for habit endpoints
│   │   └── db.ts                  # Drizzle D1 client factory
│   ├── drizzle/migrations/        # versioned SQL migrations
│   └── wrangler.jsonc             # D1 binding + assets + vars
└── pnpm-workspace.yaml
```

---

## Local Development Setup

### Prerequisites

- **Node.js ≥ 22** (LTS)
- **pnpm ≥ 11.21** — declared in the root `devEngines`; pnpm fetches the matching version automatically if needed
- A **Cloudflare account** is only required for deployment; local development runs fully offline on Wrangler's built-in SQLite

### 1. Install dependencies

```bash
git clone https://github.com/akbar-widya/track-habit.git
cd track-habit
pnpm install
```

### 2. Configure environment variables

Create `backend/.dev.vars` (gitignored; Wrangler loads it automatically):

```ini
BETTER_AUTH_SECRET=<generate-a-secret-below>
BETTER_AUTH_URL=http://localhost:5173
GOOGLE_CLIENT_ID=<from Google Cloud Console>
GOOGLE_CLIENT_SECRET=<from Google Cloud Console>
# optional — defaults to http://localhost:5173 when unset
TRUSTED_ORIGINS=http://localhost:5173
```

Generate a secret (PowerShell-compatible):

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

> **Notes:**
> - `BETTER_AUTH_URL` points at the Vite origin in development — mirroring production, where it points at the public Workers domain.
> - Google keys are optional; without them the social provider is disabled automatically and email/password still works. To enable Google login locally, add the redirect URI `http://localhost:5173/api/auth/callback/google` in Google Cloud Console.

### 3. Apply database migrations (local D1)

```bash
cd backend
pnpm db:migrate
```

This applies all versioned migrations in `drizzle/migrations` to the local D1 database.

### 4. Start the dev servers

Two terminals:

```bash
# Terminal 1 — API worker on http://localhost:8787 (health check: GET /api)
cd backend && pnpm dev

# Terminal 2 — web app on http://localhost:5173
cd frontend && pnpm dev
```

Open **http://localhost:5173** and sign up.

### Useful commands

| Command                            | Description                                        |
|------------------------------------|----------------------------------------------------|
| `pnpm --filter backend dev`        | Run the API Worker on :8787                        |
| `pnpm --filter frontend dev`       | Run the SPA on :5173                                |
| `pnpm --filter frontend build`     | TypeScript check + production build                 |
| `pnpm --filter frontend lint`      | ESLint over the frontend                            |
| `pnpm --filter backend db:generate`| Generate SQL migrations from the Drizzle schema     |
| `pnpm --filter backend db:migrate` | Apply migrations to the **local** D1 database       |
| `pnpm --filter backend cf-typegen` | Regenerate `CloudflareBindings` types               |
| `pnpm --filter backend deploy`     | Deploy Worker + assets to Cloudflare (--minify)     |

---

## Deployment

Deploying to your own Cloudflare account:

1. **Create the production database** and paste the returned `database_id` into `backend/wrangler.jsonc`:
   ```bash
   cd backend
   pnpm exec wrangler d1 create habits-db
   ```
2. **Apply migrations remotely:**
   ```bash
   pnpm exec wrangler d1 migrations apply habits-db --remote
   ```
3. **Set production secrets** (fresh values — do not reuse dev credentials):
   ```bash
   pnpm exec wrangler secret put BETTER_AUTH_SECRET    # new random secret
   pnpm exec wrangler secret put BETTER_AUTH_URL       # https://<your-worker>.workers.dev
   pnpm exec wrangler secret put GOOGLE_CLIENT_ID
   pnpm exec wrangler secret put GOOGLE_CLIENT_SECRET
   ```
4. **Set the public var** `TRUSTED_ORIGINS` in `backend/wrangler.jsonc` to `https://<your-worker>.workers.dev`.
5. **Google Cloud Console:** add the production authorized origin plus redirect URI `https://<your-worker>.workers.dev/api/auth/callback/google`, and publish the OAuth consent screen for public logins.
6. **Build and deploy** (assets upload automatically from `frontend/dist`):
   ```bash
   pnpm --filter frontend build
   pnpm --filter backend deploy
   ```

---

## License

Copyright © 2026 Akbar Widya. All rights reserved.

No part of this project may be copied, distributed, or reproduced in any form without prior written permission.
