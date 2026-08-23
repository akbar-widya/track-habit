# track-habit — Backend

Hono API Worker for HabitEngine: better-auth session handling (`/api/auth/*`),
per-user habit endpoints backed by Cloudflare D1 + Drizzle ORM, and Worker
Assets configuration for single-domain deployment.

## Commands

Run from this directory (`backend/`):

```bash
pnpm dev              # start the API Worker locally on :8787
pnpm deploy           # deploy to Cloudflare Workers (--minify)
pnpm cf-typegen       # regenerate CloudflareBindings types from wrangler.jsonc
pnpm db:generate      # generate SQL migrations from the Drizzle schema
pnpm db:migrate       # apply migrations to the LOCAL D1 database
```

Apply migrations to the remote/production database instead:

```bash
pnpm exec wrangler d1 migrations apply habits-db --remote
```

Local secrets live in `.dev.vars` (gitignored) — see the root README for setup.
