"use server";

import { and, asc, count, eq, ne, sql } from "drizzle-orm";
import { refresh, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { categories, products } from "@/db/schema";
import { defaultLocale, hasLocale, localizeHref } from "@/i18n/config";
import { assertAdmin } from "@/lib/auth/guard";
import { TAGS } from "@/lib/data/catalog";
import { translateToEnglish, translationEnabled } from "@/lib/translate";
import { isCategoryIcon } from "@/components/ui/category-icon";

type Field = "nameEn" | "nameAr" | "slug" | "descriptionEn" | "descriptionAr" | "icon";
type ErrorCode = "required" | "tooLong" | "slugInvalid" | "slugTaken" | "icon";
export type CategoryFormState = { errors?: Partial<Record<Field, ErrorCode>> } | undefined;

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const UUID_RE = /^[0-9a-f-]{36}$/i;

const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);

const str = (formData: FormData, key: string) => String(formData.get(key) ?? "").trim();

function expireCatalog() {
  // Product listings join categories (names, visibility), so both tags go.
  updateTag(TAGS.categories);
  updateTag(TAGS.products);
}

/**
 * Admins may write Arabic only: fill empty English fields from the Arabic before
 * validating. If translation is off or fails, the usual "required" errors show.
 */
async function fillMissingEnglish(values: Record<"nameEn" | "nameAr" | "descriptionEn" | "descriptionAr", string>) {
  if (!translationEnabled()) return;
  const missing: Record<string, string> = {};
  if (!values.nameEn && values.nameAr) missing.nameEn = values.nameAr.slice(0, 80);
  if (!values.descriptionEn && values.descriptionAr) missing.descriptionEn = values.descriptionAr.slice(0, 500);
  if (Object.keys(missing).length === 0) return;
  try {
    const english: Record<string, string> = await translateToEnglish(missing);
    if (english.nameEn) values.nameEn = english.nameEn.trim().slice(0, 80);
    if (english.descriptionEn) values.descriptionEn = english.descriptionEn.trim().slice(0, 500);
  } catch (error) {
    console.error("Category translation failed:", error);
  }
}

export async function saveCategory(_prev: CategoryFormState, formData: FormData): Promise<CategoryFormState> {
  await assertAdmin();
  const localeValue = str(formData, "locale");
  const locale = hasLocale(localeValue) ? localeValue : defaultLocale;
  const id = str(formData, "id");
  if (id && !UUID_RE.test(id)) throw new Error("Invalid id");

  const values = {
    nameEn: str(formData, "nameEn"),
    nameAr: str(formData, "nameAr"),
    slug: str(formData, "slug").toLowerCase(),
    descriptionEn: str(formData, "descriptionEn"),
    descriptionAr: str(formData, "descriptionAr"),
    icon: str(formData, "icon"),
    isActive: formData.get("isActive") === "on",
  };
  await fillMissingEnglish(values);
  if (!values.slug) values.slug = slugify(values.nameEn);

  const errors: NonNullable<CategoryFormState>["errors"] = {};
  if (!values.nameEn) errors.nameEn = "required";
  else if (values.nameEn.length > 80) errors.nameEn = "tooLong";
  if (!values.nameAr) errors.nameAr = "required";
  else if (values.nameAr.length > 80) errors.nameAr = "tooLong";
  if (!values.slug) errors.slug = "required";
  else if (!SLUG_RE.test(values.slug) || values.slug.length > 60) errors.slug = "slugInvalid";
  if (values.descriptionEn.length > 500) errors.descriptionEn = "tooLong";
  if (values.descriptionAr.length > 500) errors.descriptionAr = "tooLong";
  if (!isCategoryIcon(values.icon)) errors.icon = "icon";

  if (!errors.slug) {
    const [clash] = await db
      .select({ id: categories.id })
      .from(categories)
      .where(id ? and(eq(categories.slug, values.slug), ne(categories.id, id)) : eq(categories.slug, values.slug))
      .limit(1);
    if (clash) errors.slug = "slugTaken";
  }
  if (Object.keys(errors).length) return { errors };

  if (id) {
    await db.update(categories).set(values).where(eq(categories.id, id));
  } else {
    const [{ next }] = await db
      .select({ next: sql<number>`coalesce(max(${categories.sortOrder}), -1)::int + 1` })
      .from(categories);
    await db.insert(categories).values({ ...values, sortOrder: next });
  }

  expireCatalog();
  redirect(localizeHref(locale, "/dashboard/categories"));
}

export async function toggleCategory(formData: FormData) {
  await assertAdmin();
  const id = str(formData, "id");
  if (!UUID_RE.test(id)) throw new Error("Invalid id");
  await db
    .update(categories)
    .set({ isActive: sql`not ${categories.isActive}` })
    .where(eq(categories.id, id));
  expireCatalog();
  refresh();
}

export async function moveCategory(formData: FormData) {
  await assertAdmin();
  const id = str(formData, "id");
  const direction = str(formData, "direction") === "up" ? -1 : 1;
  if (!UUID_RE.test(id)) throw new Error("Invalid id");

  const ordered = await db
    .select({ id: categories.id })
    .from(categories)
    .orderBy(asc(categories.sortOrder), asc(categories.nameEn));
  const from = ordered.findIndex((c) => c.id === id);
  const to = from + direction;
  if (from < 0 || to < 0 || to >= ordered.length) return;
  [ordered[from], ordered[to]] = [ordered[to], ordered[from]];

  // Rewrite every position in one statement so the order stays contiguous.
  const rows = sql.join(
    ordered.map((c, i) => sql`(${c.id}::uuid, ${i}::int)`),
    sql`, `,
  );
  await db.execute(
    sql`update ${categories} as c set sort_order = v.ord from (values ${rows}) as v(id, ord) where c.id = v.id`,
  );
  expireCatalog();
  refresh();
}

export async function deleteCategory(formData: FormData) {
  await assertAdmin();
  const id = str(formData, "id");
  if (!UUID_RE.test(id)) throw new Error("Invalid id");
  const [{ total }] = await db.select({ total: count() }).from(products).where(eq(products.categoryId, id));
  // The FK would reject this anyway; the UI disables delete for non-empty categories.
  if (total > 0) throw new Error("Category still has products");
  await db.delete(categories).where(eq(categories.id, id));
  expireCatalog();
  refresh();
}
