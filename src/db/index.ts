import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL is not set. Copy .env.example to .env.local.");

// Reuse one pool across dev hot reloads, but not after DATABASE_URL changes.
const globalForDb = globalThis as unknown as { pg?: postgres.Sql; pgUrl?: string };

const client =
  (globalForDb.pgUrl === url ? globalForDb.pg : undefined) ??
  postgres(url, {
    // Builds prerender in one worker per CPU, each with its own pool; keep this
    // small against connection-limited servers (Supabase free tier).
    max: Number(process.env.DATABASE_POOL_MAX ?? 10),
    // Safe with any pooler. On Supabase use the session pooler (port 5432): the
    // transaction pooler (6543) loses replies to postgres.js's pipelined queries.
    prepare: false,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.pg = client;
  globalForDb.pgUrl = url;
}

export const db = drizzle(client, { schema, casing: "snake_case" });
export { schema };
