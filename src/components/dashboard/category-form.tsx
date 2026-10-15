"use client";

import Link from "next/link";
import { useActionState } from "react";
import { saveCategory, type CategoryFormState } from "@/lib/actions/categories";
import { localizeHref, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Category } from "@/db/schema";
import { categoryIcons } from "@/components/ui/category-icon";

const input =
  "mt-1.5 block w-full rounded-lg border border-border bg-background px-3 py-2.5 text-foreground outline-none transition-colors focus:border-primary aria-[invalid=true]:border-red-500";

export function CategoryForm({
  locale,
  t,
  category,
}: {
  locale: Locale;
  t: Dictionary["adminCategories"];
  category?: Category;
}) {
  const [state, action, pending] = useActionState<CategoryFormState, FormData>(saveCategory, undefined);
  const errors = state?.errors ?? {};

  const fieldError = (field: keyof typeof errors) =>
    errors[field] ? (
      <p id={`${field}-error`} className="mt-1 text-xs font-medium text-red-600 dark:text-red-400">
        {t.errors[errors[field]!]}
      </p>
    ) : null;

  const field = (name: keyof typeof errors) => ({
    name,
    "aria-invalid": Boolean(errors[name]),
    "aria-describedby": errors[name] ? `${name}-error` : undefined,
  });

  return (
    <form action={action} className="max-w-3xl space-y-6 rounded-xl border border-border bg-surface p-6" noValidate>
      <input type="hidden" name="locale" value={locale} />
      {category && <input type="hidden" name="id" value={category.id} />}

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block text-sm font-semibold">
          {t.nameEn}
          <input {...field("nameEn")} dir="ltr" required maxLength={80} defaultValue={category?.nameEn} className={input} />
          {fieldError("nameEn")}
        </label>
        <label className="block text-sm font-semibold">
          {t.nameAr}
          <input {...field("nameAr")} dir="rtl" lang="ar" required maxLength={80} defaultValue={category?.nameAr} className={input} />
          {fieldError("nameAr")}
        </label>
      </div>

      <label className="block text-sm font-semibold">
        {t.slug}
        <input {...field("slug")} dir="ltr" maxLength={60} defaultValue={category?.slug} placeholder="living-rooms" className={input} />
        <span className="mt-1 block text-xs font-normal text-muted">{t.slugHint}</span>
        {fieldError("slug")}
      </label>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block text-sm font-semibold">
          {t.descriptionEn}
          <textarea {...field("descriptionEn")} dir="ltr" rows={3} maxLength={500} defaultValue={category?.descriptionEn} className={input} />
          {fieldError("descriptionEn")}
        </label>
        <label className="block text-sm font-semibold">
          {t.descriptionAr}
          <textarea {...field("descriptionAr")} dir="rtl" lang="ar" rows={3} maxLength={500} defaultValue={category?.descriptionAr} className={input} />
          {fieldError("descriptionAr")}
        </label>
      </div>

      <fieldset>
        <legend className="text-sm font-semibold">{t.icon}</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {Object.entries(categoryIcons).map(([key, Icon], i) => (
            <label key={key} title={key} className="cursor-pointer">
              <input
                type="radio"
                name="icon"
                value={key}
                defaultChecked={category ? category.icon === key : i === 0}
                className="peer sr-only"
              />
              <span className="inline-flex size-11 items-center justify-center rounded-lg border border-border text-muted transition-colors peer-checked:border-primary peer-checked:bg-accent peer-checked:text-primary peer-focus-visible:outline-2 peer-focus-visible:outline-ring hover:border-primary">
                <Icon className="size-5" aria-hidden />
                <span className="sr-only">{key}</span>
              </span>
            </label>
          ))}
        </div>
        {fieldError("icon")}
      </fieldset>

      <label className="flex items-center gap-3 text-sm font-semibold">
        <input type="checkbox" name="isActive" defaultChecked={category?.isActive ?? true} className="size-4 accent-[var(--primary)]" />
        {t.active}
      </label>

      <div className="flex items-center gap-3 border-t border-border pt-5">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary-hover disabled:opacity-60"
        >
          {pending ? t.saving : category ? t.save : t.create}
        </button>
        <Link
          href={localizeHref(locale, "/dashboard/categories")}
          className="rounded-lg px-4 py-2.5 text-sm font-semibold text-muted hover:bg-accent hover:text-foreground"
        >
          {t.cancel}
        </Link>
      </div>
    </form>
  );
}
