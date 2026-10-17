"use client";

import Link from "next/link";
import { useActionState } from "react";
import { saveProduct, type ProductFormState } from "@/lib/actions/products";
import { localizeHref, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Product } from "@/db/schema";
import { loc } from "@/lib/format";

const input =
  "mt-1.5 block w-full rounded-lg border border-border bg-background px-3 py-2.5 text-foreground outline-none transition-colors focus:border-primary aria-[invalid=true]:border-red-500";
const hint = "mt-1 block text-xs font-normal text-muted";
const section = "space-y-5 rounded-xl border border-border bg-surface p-6";

type CategoryOption = { id: string; nameAr: string; nameEn: string };
type Errors = NonNullable<ProductFormState>["errors"];

export function ProductForm({
  locale,
  t,
  categories,
  product,
  from,
  defaultCategoryId,
}: {
  locale: Locale;
  t: Dictionary["adminProducts"];
  categories: CategoryOption[];
  product?: Product;
  /** List to return to after saving or cancelling. */
  from: "products" | "inventory";
  defaultCategoryId?: string;
}) {
  const [state, action, pending] = useActionState<ProductFormState, FormData>(saveProduct, undefined);
  const errors: Errors = state?.errors ?? {};
  // After a failed save, redraw with what was submitted (React resets the form on submit).
  const sent = state?.values;
  const value = (name: string, saved?: string | number | null) => sent?.[name] ?? (saved ?? "").toString();
  const checked = (name: string, saved: boolean) => (sent ? sent[name] === "on" : saved);

  const fieldError = (name: keyof Errors) =>
    errors[name] ? (
      <p id={`${name}-error`} className="mt-1 text-xs font-medium text-red-600 dark:text-red-400">
        {t.errors[errors[name]!]}
      </p>
    ) : null;

  const field = (name: keyof Errors) => ({
    name,
    "aria-invalid": Boolean(errors[name]),
    "aria-describedby": errors[name] ? `${name}-error` : undefined,
  });

  const cancelHref = localizeHref(locale, from === "inventory" ? "/dashboard/inventory" : "/dashboard/products");

  return (
    <form key={state?.at} action={action} className="max-w-4xl space-y-6" noValidate>
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="from" value={from} />
      {product && <input type="hidden" name="id" value={product.id} />}

      <fieldset className={section}>
        <legend className="sr-only">{t.sections.basics}</legend>
        <h2 className="font-bold">{t.sections.basics}</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block text-sm font-semibold">
            {t.nameAr}
            <input {...field("nameAr")} dir="rtl" lang="ar" required maxLength={120} defaultValue={value("nameAr", product?.nameAr)} className={input} />
            {fieldError("nameAr")}
          </label>
          <label className="block text-sm font-semibold">
            {t.nameEn}
            <input {...field("nameEn")} dir="ltr" maxLength={120} defaultValue={value("nameEn", product?.nameEn)} className={input} />
            {fieldError("nameEn")}
          </label>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block text-sm font-semibold">
            {t.category}
            <select
              {...field("categoryId")}
              required
              defaultValue={value("categoryId", product?.categoryId ?? defaultCategoryId)}
              className={input}
            >
              <option value="" disabled>
                {t.categoryPlaceholder}
              </option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {loc(locale, c.nameAr, c.nameEn)}
                </option>
              ))}
            </select>
            {fieldError("categoryId")}
          </label>
          <label className="block text-sm font-semibold">
            {t.sku}
            <input
              {...field("sku")}
              dir="ltr"
              required
              maxLength={40}
              autoCapitalize="characters"
              placeholder="BED-012"
              defaultValue={value("sku", product?.sku)}
              className={`${input} uppercase`}
            />
            <span className={hint}>{t.skuHint}</span>
            {fieldError("sku")}
          </label>
        </div>
        <label className="block text-sm font-semibold">
          {t.slug}
          <input {...field("slug")} dir="ltr" maxLength={80} placeholder="aswan-wardrobe" defaultValue={value("slug", product?.slug)} className={input} />
          <span className={hint}>{t.slugHint}</span>
          {fieldError("slug")}
        </label>
      </fieldset>

      <fieldset className={section}>
        <legend className="sr-only">{t.sections.pricing}</legend>
        <h2 className="font-bold">{t.sections.pricing}</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block text-sm font-semibold">
            {t.priceLabel}
            <input {...field("price")} type="number" inputMode="numeric" min={1} step={1} dir="ltr" required defaultValue={value("price", product?.price)} className={input} />
            {fieldError("price")}
          </label>
          <label className="block text-sm font-semibold">
            {t.compareAtPrice}
            <input {...field("compareAtPrice")} type="number" inputMode="numeric" min={1} step={1} dir="ltr" defaultValue={value("compareAtPrice", product?.compareAtPrice)} className={input} />
            <span className={hint}>{t.compareAtHint}</span>
            {fieldError("compareAtPrice")}
          </label>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          {product ? (
            <p className="self-center rounded-lg bg-surface-muted px-4 py-3 text-sm text-muted">
              {t.stockManaged.replace("{count}", String(product.stock))}
            </p>
          ) : (
            <label className="block text-sm font-semibold">
              {t.initialStock}
              <input {...field("initialStock")} type="number" inputMode="numeric" min={0} step={1} dir="ltr" defaultValue={value("initialStock", 0)} className={input} />
              <span className={hint}>{t.initialStockHint}</span>
              {fieldError("initialStock")}
            </label>
          )}
          <label className="block text-sm font-semibold">
            {t.lowStockThreshold}
            <input {...field("lowStockThreshold")} type="number" inputMode="numeric" min={0} step={1} dir="ltr" defaultValue={value("lowStockThreshold", product?.lowStockThreshold ?? 2)} className={input} />
            <span className={hint}>{t.lowStockHint}</span>
            {fieldError("lowStockThreshold")}
          </label>
        </div>
      </fieldset>

      <fieldset className={section}>
        <legend className="sr-only">{t.sections.details}</legend>
        <h2 className="font-bold">{t.sections.details}</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block text-sm font-semibold">
            {t.descriptionAr}
            <textarea {...field("descriptionAr")} dir="rtl" lang="ar" rows={4} maxLength={2000} defaultValue={value("descriptionAr", product?.descriptionAr)} className={input} />
            {fieldError("descriptionAr")}
          </label>
          <label className="block text-sm font-semibold">
            {t.descriptionEn}
            <textarea {...field("descriptionEn")} dir="ltr" rows={4} maxLength={2000} defaultValue={value("descriptionEn", product?.descriptionEn)} className={input} />
            {fieldError("descriptionEn")}
          </label>
          <label className="block text-sm font-semibold">
            {t.materialAr}
            <input {...field("materialAr")} dir="rtl" lang="ar" maxLength={200} defaultValue={value("materialAr", product?.materialAr)} className={input} />
            {fieldError("materialAr")}
          </label>
          <label className="block text-sm font-semibold">
            {t.materialEn}
            <input {...field("materialEn")} dir="ltr" maxLength={200} defaultValue={value("materialEn", product?.materialEn)} className={input} />
            {fieldError("materialEn")}
          </label>
        </div>
        <label className="block text-sm font-semibold sm:w-1/2">
          {t.dimensions}
          <input {...field("dimensions")} maxLength={120} placeholder={t.dimensionsHint} defaultValue={value("dimensions", product?.dimensions)} className={input} />
          {fieldError("dimensions")}
        </label>
      </fieldset>

      <fieldset className={section}>
        <legend className="sr-only">{t.sections.display}</legend>
        <h2 className="font-bold">{t.sections.display}</h2>
        <label className="flex items-center gap-3 text-sm font-semibold">
          <input type="checkbox" name="isActive" defaultChecked={checked("isActive", product?.isActive ?? true)} className="size-4 accent-[var(--primary)]" />
          {t.isActive}
        </label>
        <label className="flex items-center gap-3 text-sm font-semibold">
          <input type="checkbox" name="isFeatured" defaultChecked={checked("isFeatured", product?.isFeatured ?? false)} className="size-4 accent-[var(--primary)]" />
          {t.isFeatured}
        </label>
      </fieldset>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary-hover disabled:opacity-60"
        >
          {pending ? t.saving : product ? t.save : t.create}
        </button>
        <Link href={cancelHref} className="rounded-lg px-4 py-2.5 text-sm font-semibold text-muted hover:bg-accent hover:text-foreground">
          {t.cancel}
        </Link>
      </div>
    </form>
  );
}
