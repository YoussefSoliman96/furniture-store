# Aziz Furniture — عزيز فيرنيتشر

Bilingual (Arabic / English) showroom, store and store-management dashboard for Aziz Furniture.

**Stack:** Next.js 16 (App Router, Cache Components) · Tailwind CSS v4 · Drizzle ORM · Postgres (Supabase in production)

## Getting started

```bash
npm install
cp .env.example .env.local      # then set ADMIN_EMAIL / ADMIN_PASSWORD
npm run db:local                # terminal 1: local Postgres on :5433 (keep running)
npm run db:migrate              # create tables
npm run db:seed                 # mock catalog + admin account
npm run dev                     # terminal 2: http://localhost:3000
```

- Storefront: `/ar` (default) and `/en`
- Admin: `/ar/login` → `/ar/dashboard` (admin accounts only)

`npm run db:local` runs real Postgres binaries via `embedded-postgres` (no Docker needed); data lives in `.data/postgres`.

## Scripts

| Script | What it does |
| --- | --- |
| `db:local` | Start the local Postgres server |
| `db:generate` | Generate a SQL migration after editing `src/db/schema.ts` |
| `db:migrate` | Apply migrations to `DATABASE_URL` |
| `db:seed` | Seed mock catalog (if empty) and upsert the admin from `ADMIN_*`; `-- --reset` wipes the catalog first |
| `db:studio` | Browse the database in Drizzle Studio |

## Moving to Supabase

1. Create a project; copy the **pooler** connection string (Project Settings → Database).
2. Set `DATABASE_URL` to it (prepared statements are already disabled for the pooler) and keep `DATABASE_POOL_MAX` small.
3. Run `npm run db:migrate` and `npm run db:seed` against it once.

## How it fits together

- **i18n:** every route lives under `src/app/[lang]`; `src/proxy.ts` picks the locale (cookie → `Accept-Language` → Arabic). Strings are in `src/i18n/dictionaries/*.json` and never ship to the browser.
- **Catalog:** `src/lib/data/catalog.ts` reads are cached (`'use cache'` + tags), so storefront pages are prerendered. Admin actions expire the tags, so changes show up immediately.
- **Auth:** database sessions (hashed tokens, httpOnly cookie). `requireAdminPage()` guards admin pages, and `assertAdmin()` guards every admin action and read.
- **Inventory:** `products.stock` is the running total; `inventory_movements` is the append-only log of every change.
