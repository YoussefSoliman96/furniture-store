import { defineConfig } from "drizzle-kit";

try {
  process.loadEnvFile(".env.local");
} catch {
  // Fall back to variables already in the environment (CI, hosting).
}

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  casing: "snake_case",
  // Migrations need a session connection; Supabase's transaction pooler (the app's URL) isn't one.
  dbCredentials: { url: (process.env.DATABASE_MIGRATION_URL || process.env.DATABASE_URL)! },
});
