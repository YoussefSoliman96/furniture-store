"use server";

import { and, count, eq, inArray, ne, or, sql } from "drizzle-orm";
import { refresh, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { categories, inventoryMovements, products } from "@/db/schema";
import { defaultLocale, hasLocale, localizeHref } from "@/i18n/config";
import { getDictionaryFor } from "@/i18n/dictionaries";
import { assertAdmin } from "@/lib/auth/guard";
import { TAGS } from "@/lib/data/catalog";

type Field =
  | "nameEn"
  | "nameAr"
  | "sku"
  | "slug"
  | "categoryId"
  | "descriptionEn"
  | "descriptionAr"
  | "materialEn"
  | "materialAr"
  | "dimensions"
  | "price"
  | "compareAtPrice"
  | "initialStock"
  | "lowStockThreshold";
type ErrorCode =
  | "required"
  | "tooLong"
  | "slugInvalid"
  | "slugTaken"
  | "skuInvalid"
  | "skuTaken"
  | "category"
  | "price"
  | "compareAt"
  | "quantity";
export type ProductFormState = { errors?: Partial<Record<Field, ErrorCode>> } | undefined;

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const SKU_RE = /^[A-Z0-9]+(?:-[A-Z0-9]+)*$/;
const UUID_RE = /^[0-9a-f-]{36}$/i;
const MAX_PRICE = 10_000_000;
const MAX_QTY = 10_000;
// Products that were sold or returned keep their history; they can only be hidden.
const SALES_REASONS = ["sale", "return"] as const;

const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

const str = (formData: FormData, key: string) => String(formData.get(key) ?? "").trim();

/** Whole number in [min, max], or null when it isn't one. Empty input is null. */
function wholeNumber(value: string, min: number, max: number) {
  if (value === "") return null;
  const n = Number(value);
  return Number.isInteger(n) && n >= min && n <= max ? n : null;
}

/** Where to go after saving: the list the admin came from. */
const backTo = (formData: FormData) =>
  str(formData, "from") === "inventory" ? "/dashboard/inventory" : "/dashboard/products";

function expireCatalog() {
  updateTag(TAGS.products);
}

const isUniqueViolation = (error: unknown, column: string) => {
  const e = error as { code?: string; constraint_name?: string; cause?: { code?: string; constraint_name?: string } };
  const pg = e.cause ?? e;
  return pg.code === "23505" && String(pg.constraint_name ?? "").includes(column);
};

export async function saveProduct(_prev: ProductFormState, formData: FormData): Promise<ProductFormState> {
  const admin = await assertAdmin();
  const localeValue = str(formData, "locale");
  const locale = hasLocale(localeValue) ? localeValue : defaultLocale;
  const id = str(formData, "id");
  if (id && !UUID_RE.test(id)) throw new Error("Invalid id");

  const raw = {
    price: str(formData, "price"),
    compareAtPrice: str(formData, "compareAtPrice"),
    initialStock: str(formData, "initialStock"),
    lowStockThreshold: str(formData, "lowStockThreshold"),
  };
  const values = {
    nameEn: str(formData, "nameEn"),
    nameAr: str(formData, "nameAr"),
    sku: str(formData, "sku").toUpperCase(),
    slug: str(formData, "slug").toLowerCase(),
    categoryId: str(formData, "categoryId"),
    descriptionEn: str(formData, "descriptionEn"),
    descriptionAr: str(formData, "descriptionAr"),
    materialEn: str(formData, "materialEn"),
    materialAr: str(formData, "materialAr"),
    dimensions: str(formData, "dimensions"),
    price: wholeNumber(raw.price, 1, MAX_PRICE),
    compareAtPrice: wholeNumber(raw.compareAtPrice, 1, MAX_PRICE),
    lowStockThreshold: wholeNumber(raw.lowStockThreshold || "2", 0, MAX_QTY),
    isFeatured: formData.get("isFeatured") === "on",
    isActive: formData.get("isActive") === "on",
  };
  if (!values.slug) values.slug = slugify(values.nameEn);
  // Stock is only set here on create; afterwards it changes through logged movements.
  const initialStock = id ? 0 : wholeNumber(raw.initialStock || "0", 0, MAX_QTY);

  const errors: NonNullable<ProductFormState>["errors"] = {};
  const text = (field: Field, value: string, max: number, required = false) => {
    if (required && !value) errors[field] = "required";
    else if (value.length > max) errors[field] = "tooLong";
  };
  text("nameEn", values.nameEn, 120, true);
  text("nameAr", values.nameAr, 120, true);
  text("descriptionEn", values.descriptionEn, 2000);
  text("descriptionAr", values.descriptionAr, 2000);
  text("materialEn", values.materialEn, 200);
  text("materialAr", values.materialAr, 200);
  text("dimensions", values.dimensions, 120);
  if (!values.sku) errors.sku = "required";
  else if (!SKU_RE.test(values.sku) || values.sku.length > 40) errors.sku = "skuInvalid";
  if (!values.slug) errors.slug = "required";
  else if (!SLUG_RE.test(values.slug) || values.slug.length > 80) errors.slug = "slugInvalid";
  if (!UUID_RE.test(values.categoryId)) errors.categoryId = "category";
  if (values.price === null) errors.price = raw.price ? "price" : "required";
  if (raw.compareAtPrice && values.compareAtPrice === null) errors.compareAtPrice = "price";
  else if (values.compareAtPrice !== null && values.price !== null && values.compareAtPrice <= values.price)
    errors.compareAtPrice = "compareAt";
  if (initialStock === null) errors.initialStock = "quantity";
  if (values.lowStockThreshold === null) errors.lowStockThreshold = "quantity";

  if (!errors.categoryId) {
    const [category] = await db.select({ id: categories.id }).from(categories).where(eq(categories.id, values.categoryId));
    if (!category) errors.categoryId = "category";
  }
  if (!errors.sku || !errors.slug) {
    const clashes = await db
      .select({ sku: products.sku, slug: products.slug })
      .from(products)
      .where(
        and(
          or(eq(products.sku, values.sku), eq(products.slug, values.slug)),
          id ? ne(products.id, id) : undefined,
        ),
      );
    if (!errors.sku && clashes.some((c) => c.sku === values.sku)) errors.sku = "skuTaken";
    if (!errors.slug && clashes.some((c) => c.slug === values.slug)) errors.slug = "slugTaken";
  }
  if (Object.keys(errors).length) return { errors };

  const row = {
    ...values,
    price: values.price!,
    lowStockThreshold: values.lowStockThreshold!,
  };

  try {
    if (id) {
      await db.update(products).set(row).where(eq(products.id, id));
    } else {
      const note = (await getDictionaryFor(locale)).adminProducts.openingStock;
      // The product and its opening stock entry are saved together or not at all.
      await db.transaction(async (tx) => {
        const [created] = await tx
          .insert(products)
          .values({ ...row, stock: initialStock! })
          .returning({ id: products.id });
        if (initialStock! > 0) {
          await tx.insert(inventoryMovements).values({
            productId: created.id,
            delta: initialStock!,
            reason: "restock",
            note,
            createdBy: admin.id,
          });
        }
      });
    }
  } catch (error) {
    // A concurrent save can still win the race past the checks above.
    if (isUniqueViolation(error, "sku")) return { errors: { sku: "skuTaken" } };
    if (isUniqueViolation(error, "slug")) return { errors: { slug: "slugTaken" } };
    throw error;
  }

  expireCatalog();
  redirect(localizeHref(locale, backTo(formData)));
}

export async function toggleProduct(formData: FormData) {
  await assertAdmin();
  const id = str(formData, "id");
  if (!UUID_RE.test(id)) throw new Error("Invalid id");
  await db
    .update(products)
    .set({ isActive: sql`not ${products.isActive}` })
    .where(eq(products.id, id));
  expireCatalog();
  refresh();
}

export async function deleteProduct(formData: FormData) {
  await assertAdmin();
  const id = str(formData, "id");
  if (!UUID_RE.test(id)) throw new Error("Invalid id");
  const [{ sales }] = await db
    .select({ sales: count() })
    .from(inventoryMovements)
    .where(and(eq(inventoryMovements.productId, id), inArray(inventoryMovements.reason, [...SALES_REASONS])));
  // The UI only offers delete for never-sold products; this guards direct posts.
  if (sales > 0) throw new Error("Product has sales history");
  // Its stock movements cascade with it.
  await db.delete(products).where(eq(products.id, id));
  expireCatalog();
  refresh();
}
