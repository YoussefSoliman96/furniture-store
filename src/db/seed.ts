/**
 * Seeds the catalog with mock data and creates the admin account.
 *   npm run db:seed            # insert if the catalog is empty
 *   npm run db:seed -- --reset # wipe catalog + inventory and reseed
 * Admin credentials come from ADMIN_EMAIL / ADMIN_PASSWORD / ADMIN_NAME.
 */
import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import { seedCategories, seedProducts } from "./seed-data";
import { hashPassword } from "../lib/auth/password";

const { categories, products, inventoryMovements, users } = schema;

async function upsertUser(email: string, password: string, name: string, role: "admin" | "customer") {
  const passwordHash = await hashPassword(password);
  await db
    .insert(users)
    .values({ email: email.toLowerCase(), name, passwordHash, role })
    .onConflictDoUpdate({ target: users.email, set: { name, passwordHash, role } });
  console.log(`✓ ${role} account ready: ${email}`);
}

const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL is not set");
const client = postgres(url, { max: 1, prepare: false });
const db = drizzle(client, { schema, casing: "snake_case" });

async function main() {
  try {
    const reset = process.argv.includes("--reset");
    if (reset) {
      await db.execute(sql`truncate ${inventoryMovements}, ${products}, ${categories} cascade`);
      console.log("✓ catalog cleared");
    }
  
    const [{ count }] = await db.select({ count: sql<number>`count(*)::int` }).from(categories);
    if (count > 0) {
      console.log(`• catalog already has ${count} categories — skipping (use --reset to reseed)`);
    } else {
      const inserted = await db
        .insert(categories)
        .values(seedCategories.map((c, i) => ({ ...c, sortOrder: i })))
        .returning({ id: categories.id, slug: categories.slug });
      const idBySlug = new Map(inserted.map((c) => [c.slug, c.id]));
  
      const rows = await db
        .insert(products)
        .values(
          seedProducts.map(({ category, ...p }) => ({ ...p, categoryId: idBySlug.get(category)! })),
        )
        .returning({ id: products.id, stock: products.stock });
  
      const opening = rows.filter((r) => r.stock > 0);
      if (opening.length) {
        await db.insert(inventoryMovements).values(
          opening.map((r) => ({ productId: r.id, delta: r.stock, reason: "restock" as const, note: "Opening stock" })),
        );
      }
      console.log(`✓ seeded ${inserted.length} categories, ${rows.length} products`);
    }
  
    const { ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME, SEED_CUSTOMER_EMAIL, SEED_CUSTOMER_PASSWORD } = process.env;
    if (ADMIN_EMAIL && ADMIN_PASSWORD) await upsertUser(ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME ?? "Admin", "admin");
    else console.warn("! ADMIN_EMAIL / ADMIN_PASSWORD not set — no admin account created");
    if (SEED_CUSTOMER_EMAIL && SEED_CUSTOMER_PASSWORD) {
      await upsertUser(SEED_CUSTOMER_EMAIL, SEED_CUSTOMER_PASSWORD, "Test Customer", "customer");
    }
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
