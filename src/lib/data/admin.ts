import { and, asc, count, desc, eq, gt, ilike, inArray, lte, or, sql } from "drizzle-orm";
import { db } from "@/db";
import { categories, inventoryMovements, products, users } from "@/db/schema";
import { assertAdmin } from "@/lib/auth/guard";

// Uncached, admin-only reads. Each one verifies the session itself.

export async function getAdminCategories() {
  await assertAdmin();
  return db
    .select({
      id: categories.id,
      slug: categories.slug,
      nameAr: categories.nameAr,
      nameEn: categories.nameEn,
      icon: categories.icon,
      isActive: categories.isActive,
      sortOrder: categories.sortOrder,
      productCount: count(products.id),
    })
    .from(categories)
    .leftJoin(products, eq(products.categoryId, categories.id))
    .groupBy(categories.id)
    .orderBy(asc(categories.sortOrder), asc(categories.nameEn));
}

export async function getAdminCategory(id: string) {
  await assertAdmin();
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  const [row] = await db.select().from(categories).where(eq(categories.id, id)).limit(1);
  return row ?? null;
}

export type AdminProductFilters = { q?: string; categoryId?: string };

export async function getAdminProducts({ q, categoryId }: AdminProductFilters = {}) {
  await assertAdmin();
  const term = q?.trim().slice(0, 80);
  // Escape LIKE wildcards so a search for "50%" matches literally.
  const pattern = term ? `%${term.replace(/[\\%_]/g, "\\$&")}%` : undefined;
  const sales = db
    .select({ productId: inventoryMovements.productId, total: count().as("sales") })
    .from(inventoryMovements)
    .where(inArray(inventoryMovements.reason, ["sale", "return"]))
    .groupBy(inventoryMovements.productId)
    .as("sales");
  return db
    .select({
      id: products.id,
      sku: products.sku,
      slug: products.slug,
      nameAr: products.nameAr,
      nameEn: products.nameEn,
      price: products.price,
      compareAtPrice: products.compareAtPrice,
      stock: products.stock,
      lowStockThreshold: products.lowStockThreshold,
      isActive: products.isActive,
      isFeatured: products.isFeatured,
      categorySlug: categories.slug,
      categoryNameAr: categories.nameAr,
      categoryNameEn: categories.nameEn,
      hasSales: sql<boolean>`coalesce(${sales.total}, 0) > 0`,
    })
    .from(products)
    .innerJoin(categories, eq(categories.id, products.categoryId))
    .leftJoin(sales, eq(sales.productId, products.id))
    .where(
      and(
        categoryId && /^[0-9a-f-]{36}$/i.test(categoryId) ? eq(products.categoryId, categoryId) : undefined,
        pattern
          ? or(ilike(products.nameEn, pattern), ilike(products.nameAr, pattern), ilike(products.sku, pattern))
          : undefined,
      ),
    )
    .orderBy(asc(categories.sortOrder), asc(products.sku));
}

export async function getAdminProduct(id: string) {
  await assertAdmin();
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  const [row] = await db.select().from(products).where(eq(products.id, id)).limit(1);
  return row ?? null;
}

export type StockFilter = "all" | "low" | "out";

export async function getInventory(filter: StockFilter) {
  await assertAdmin();
  const where =
    filter === "out"
      ? lte(products.stock, 0)
      : filter === "low"
        ? and(gt(products.stock, 0), lte(products.stock, products.lowStockThreshold))
        : undefined;
  return db
    .select({
      id: products.id,
      sku: products.sku,
      nameAr: products.nameAr,
      nameEn: products.nameEn,
      stock: products.stock,
      lowStockThreshold: products.lowStockThreshold,
      price: products.price,
      categoryNameAr: categories.nameAr,
      categoryNameEn: categories.nameEn,
    })
    .from(products)
    .innerJoin(categories, eq(categories.id, products.categoryId))
    .where(where)
    .orderBy(asc(categories.sortOrder), asc(products.sku));
}

export async function getRecentMovements(limit = 15) {
  await assertAdmin();
  return db
    .select({
      id: inventoryMovements.id,
      delta: inventoryMovements.delta,
      reason: inventoryMovements.reason,
      note: inventoryMovements.note,
      createdAt: inventoryMovements.createdAt,
      productNameAr: products.nameAr,
      productNameEn: products.nameEn,
      sku: products.sku,
      userName: users.name,
    })
    .from(inventoryMovements)
    .innerJoin(products, eq(products.id, inventoryMovements.productId))
    .leftJoin(users, eq(users.id, inventoryMovements.createdBy))
    .orderBy(desc(inventoryMovements.createdAt))
    .limit(limit);
}

export async function getDashboardStats() {
  await assertAdmin();
  const [[stock], [cats], lowStock] = await Promise.all([
    db
      .select({
        products: sql<number>`count(*) filter (where ${products.isActive})::int`,
        units: sql<number>`coalesce(sum(greatest(${products.stock}, 0)), 0)::int`,
        value: sql<number>`coalesce(sum(greatest(${products.stock}, 0)::bigint * ${products.price}), 0)::float8`,
        low: sql<number>`count(*) filter (where ${products.stock} > 0 and ${products.stock} <= ${products.lowStockThreshold})::int`,
        out: sql<number>`count(*) filter (where ${products.stock} <= 0)::int`,
      })
      .from(products),
    db.select({ total: count() }).from(categories),
    db
      .select({ id: products.id, sku: products.sku, nameAr: products.nameAr, nameEn: products.nameEn, stock: products.stock })
      .from(products)
      .where(lte(products.stock, products.lowStockThreshold))
      .orderBy(asc(products.stock), asc(products.sku))
      .limit(8),
  ]);
  return { ...stock, categories: cats.total, lowStock };
}
