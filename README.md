# Aziz Furniture — عزيز فيرنيتشر

Bilingual (Arabic / English) showroom, store and store-management dashboard for Aziz Furniture.

**Stack:** Next.js 16 (App Router, Cache Components) · Tailwind CSS v4 · Drizzle ORM · Postgres (Supabase in production)

## Getting started

```bash
npm install
cp .env.example .env.local      # then set DATABASE_URL and ADMIN_EMAIL / ADMIN_PASSWORD
npm run dev:all                 # migrate + seed + dev server on http://localhost:3000
```

`dev:all` is safe to re-run: migrations are skipped once applied, and the seed only fills an empty catalog. Once set up, `npm run dev` is enough.

Using local Postgres instead of Supabase: run `npm run db:local` in another terminal first (port 5433).

- Storefront: `/ar` (default) and `/en`
- Admin: `/ar/login` → `/ar/dashboard` (admin accounts only)
- Dashboard-only deployments: unless `STOREFRONT_ENABLED=true`, every storefront URL redirects to the dashboard, robots.txt disallows everything and the sitemap is empty. Admins see a Dashboard button in the store header when it is on.
- Dev shortcut: with `DEV_AUTO_LOGIN=true` in `.env.local`, `npm run dev` signs you in as `ADMIN_EMAIL` automatically. "Sign out" pauses it until you sign in manually. It never runs in a production build.

`npm run db:local` runs real Postgres binaries via `embedded-postgres` (no Docker needed); data lives in `.data/postgres`.

## Scripts

| Script | What it does |
| --- | --- |
| `dev:all` | Migrate, seed, then start the dev server |
| `db:local` | Start the local Postgres server |
| `db:generate` | Generate a SQL migration after editing `src/db/schema.ts` |
| `db:migrate` | Apply migrations to `DATABASE_URL` |
| `db:seed` | Seed mock catalog (if empty) and upsert the admin from `ADMIN_*`; `-- --reset` wipes the catalog first |
| `db:studio` | Browse the database in Drizzle Studio |

## Moving to Supabase

1. Use the **pooler** connection strings (Connect button). The direct `db.<ref>.supabase.co` host is IPv6-only and unreachable from most networks and hosts.
2. `DATABASE_URL`: session pooler, port **5432**. Not the transaction pooler (6543): it drops replies to postgres.js's pipelined queries and the app hangs. Keep `DATABASE_POOL_MAX` small; session mode caps total clients (15 on the free tier).
3. `DATABASE_MIGRATION_URL`: the same session pooler URL, used by `drizzle-kit`.
4. Add `?sslmode=require` to `DATABASE_URL` and `?uselibpqcompat=true&sslmode=require` to `DATABASE_MIGRATION_URL` (drizzle-kit's `pg` driver otherwise rejects Supabase's own CA), and percent-encode special characters in the password.
5. Run `npm run dev:all` (or `db:migrate` + `db:seed`) once.

## How it fits together

- **i18n:** every route lives under `src/app/[lang]`; `src/proxy.ts` picks the locale (cookie → `Accept-Language` → Arabic). Strings are in `src/i18n/dictionaries/*.json` and never ship to the browser.
- **Catalog:** `src/lib/data/catalog.ts` reads are cached (`'use cache'` + tags), so storefront pages are prerendered. Admin actions expire the tags, so changes show up immediately.
- **Auth:** database sessions (hashed tokens, httpOnly cookie). `requireAdminPage()` guards admin pages, and `assertAdmin()` guards every admin action and read.
- **Translation:** with `ANTHROPIC_API_KEY` set, the category form fills the English name and description from the Arabic (`src/lib/translate.ts`, Claude via a server action). English stays editable, and a save with only Arabic is translated on the server.
- **Inventory:** `products.stock` is the running total; `inventory_movements` is the append-only log of every change.
