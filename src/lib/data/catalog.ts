import { cacheLife, cacheTag } from "next/cache";
import { and, asc, desc, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { categories, products } from "@/db/schema";

/**
 * Public catalog reads. Cached so storefront pages prerender into the static
 * shell; admin mutations expire these tags with updateTag().
 */
export const TAGS = { categories: "categories", products: "products" } as const;

export async function getCategories() {
  "use cache";
  cacheLife("days");
  cacheTag(TAGS.categories);
  return db
    .select()
    .from(categories)
    .where(eq(categories.isActive, true))
    .orderBy(asc(categories.sortOrder), asc(sql`coalesce(nullif(${categories.nameEn}, ''), ${categories.nameAr})`));
}

export async function getCategoryBySlug(slug: string) {
  const all = await getCategories();
  return all.find((c) => c.slug === slug) ?? null;
}

const productColumns = {
  id: products.id,
  slug: products.slug,
  sku: products.sku,
  nameAr: products.nameAr,
  nameEn: products.nameEn,
  descriptionAr: products.descriptionAr,
  descriptionEn: products.descriptionEn,
  materialAr: products.materialAr,
  materialEn: products.materialEn,
  dimensions: products.dimensions,
  price: products.price,
  compareAtPrice: products.compareAtPrice,
  stock: products.stock,
  lowStockThreshold: products.lowStockThreshold,
  isFeatured: products.isFeatured,
  categorySlug: categories.slug,
  categoryIcon: categories.icon,
  categoryNameAr: categories.nameAr,
  categoryNameEn: categories.nameEn,
};

export type CatalogProduct = Awaited<ReturnType<typeof getProducts>>[number];

/** Active products in active categories, optionally limited to one category. */
export async function getProducts(categorySlug?: string) {
  "use cache";
  cacheLife("days");
  cacheTag(TAGS.products, TAGS.categories);
  return db
    .select(productColumns)
    .from(products)
    .innerJoin(categories, eq(categories.id, products.categoryId))
    .where(
      and(
        eq(products.isActive, true),
        eq(categories.isActive, true),
        categorySlug ? eq(categories.slug, categorySlug) : undefined,
      ),
    )
    .orderBy(asc(categories.sortOrder), desc(products.isFeatured), asc(sql`coalesce(nullif(${products.nameEn}, ''), ${products.nameAr})`));
}

export async function getFeaturedProducts(limit = 8) {
  const all = await getProducts();
  return all.filter((p) => p.isFeatured).slice(0, limit);
}

export async function getProduct(categorySlug: string, productSlug: string) {
  const list = await getProducts(categorySlug);
  return list.find((p) => p.slug === productSlug) ?? null;
}
