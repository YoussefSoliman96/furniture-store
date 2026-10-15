import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL is not set. Copy .env.example to .env.local.");

// Reuse one pool across dev hot reloads.
const globalForDb = globalThis as unknown as { pg?: postgres.Sql };

const client =
  globalForDb.pg ??
  postgres(url, {
    max: 10,
    // Supabase's transaction pooler (port 6543) doesn't support prepared statements.
    prepare: false,
  });

if (process.env.NODE_ENV !== "production") globalForDb.pg = client;

export const db = drizzle(client, { schema, casing: "snake_case" });
export { schema };
