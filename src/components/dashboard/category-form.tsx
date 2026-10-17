"use client";

import Link from "next/link";
import { useActionState, useRef, useState, useTransition } from "react";
import { Languages } from "lucide-react";
import { saveCategory, type CategoryFormState } from "@/lib/actions/categories";
import { translateFields } from "@/lib/actions/translate";
import { localizeHref, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Category } from "@/db/schema";
import { categoryIcons } from "@/components/ui/category-icon";

const input =
  "mt-1.5 block w-full rounded-lg border border-border bg-background px-3 py-2.5 text-foreground outline-none transition-colors focus:border-primary aria-[invalid=true]:border-red-500";

/** Arabic source field → the English field it fills. */
const PAIRS = { nameAr: "nameEn", descriptionAr: "descriptionEn" } as const;
type ArabicField = keyof typeof PAIRS;
type EnglishField = (typeof PAIRS)[ArabicField];
type TranslateStatus = "idle" | "translating" | "translated" | "failed";

export function CategoryForm({
  locale,
  t,
  category,
  canTranslate,
}: {
  locale: Locale;
  t: Dictionary["adminCategories"];
  category?: Category;
  /** Whether Arabic → English translation is configured on the server. */
  canTranslate: boolean;
}) {
  const [state, action, pending] = useActionState<CategoryFormState, FormData>(saveCategory, undefined);
  const errors = state?.errors ?? {};

  const formRef = useRef<HTMLFormElement>(null);
  // English fields the admin typed in themselves: auto-translation leaves them alone.
  const edited = useRef(new Set<EnglishField>(category ? ["nameEn", "descriptionEn"] : []));
  // Arabic text each English field was last translated from, to skip repeat calls.
  const translatedFrom = useRef<Partial<Record<EnglishField, string>>>({});
  const [status, setStatus] = useState<TranslateStatus>("idle");
  const [translating, startTranslating] = useTransition();

  const fieldValue = (name: string) =>
    (formRef.current?.elements.namedItem(name) as HTMLInputElement | HTMLTextAreaElement | null)?.value.trim() ?? "";

  /** Translate the given Arabic fields into their English fields. `force` overwrites edited English. */
  function translate(sources: ArabicField[], force: boolean) {
    const request: Partial<Record<EnglishField, string>> = {};
    for (const source of sources) {
      const target = PAIRS[source];
      const arabic = fieldValue(source);
      if (!arabic) continue;
      if (!force && (edited.current.has(target) || translatedFrom.current[target] === arabic)) continue;
      request[target] = arabic;
    }
    if (Object.keys(request).length === 0) return;

    startTranslating(async () => {
      setStatus("translating");
      const result = await translateFields(request);
      if (!result.ok) {
        setStatus("failed");
        return;
      }
      for (const [target, english] of Object.entries(result.values) as [EnglishField, string][]) {
        const el = formRef.current?.elements.namedItem(target) as HTMLInputElement | HTMLTextAreaElement | null;
        if (!el || (!force && edited.current.has(target))) continue;
        el.value = english;
        edited.current.delete(target);
        translatedFrom.current[target] = request[target];
      }
      setStatus("translated");
    });
  }

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

  const onArabicBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    translate([e.currentTarget.name as ArabicField], false);
  // Typing in an English field means the admin owns that text now.
  const onEnglishInput = (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    edited.current.add(e.currentTarget.name as EnglishField);
  const arabic = (name: ArabicField) => ({ ...field(name), dir: "rtl" as const, lang: "ar" });
  const english = (name: EnglishField) => ({ ...field(name), dir: "ltr" as const });
  const arabicBlur = canTranslate ? onArabicBlur : undefined;

  return (
    <form
      ref={formRef}
      action={action}
      className="max-w-3xl space-y-6 rounded-xl border border-border bg-surface p-6"
      noValidate
    >
      <input type="hidden" name="locale" value={locale} />
      {category && <input type="hidden" name="id" value={category.id} />}

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block text-sm font-semibold">
          {t.nameAr}
          <input {...arabic("nameAr")} onBlur={arabicBlur} required maxLength={80} defaultValue={category?.nameAr} className={input} />
          {fieldError("nameAr")}
        </label>
        <label className="block text-sm font-semibold">
          {t.nameEn}
          <input {...english("nameEn")} onInput={onEnglishInput} required maxLength={80} defaultValue={category?.nameEn} className={input} />
          {canTranslate && <span className="mt-1 block text-xs font-normal text-muted">{t.englishHint}</span>}
          {fieldError("nameEn")}
        </label>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block text-sm font-semibold">
          {t.descriptionAr}
          <textarea {...arabic("descriptionAr")} onBlur={arabicBlur} rows={3} maxLength={500} defaultValue={category?.descriptionAr} className={input} />
          {fieldError("descriptionAr")}
        </label>
        <label className="block text-sm font-semibold">
          {t.descriptionEn}
          <textarea {...english("descriptionEn")} onInput={onEnglishInput} rows={3} maxLength={500} defaultValue={category?.descriptionEn} className={input} />
          {fieldError("descriptionEn")}
        </label>
      </div>

      {canTranslate && (
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => translate(["nameAr", "descriptionAr"], true)}
            disabled={translating}
            className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-semibold hover:border-primary hover:text-primary disabled:opacity-60"
          >
            <Languages className="size-4" aria-hidden />
            {t.translate}
          </button>
          <span aria-live="polite" className="text-xs">
            {status === "translating" && <span className="text-muted">{t.translating}</span>}
            {status === "translated" && <span className="text-emerald-700 dark:text-emerald-400">{t.translated}</span>}
            {status === "failed" && <span className="text-red-600 dark:text-red-400">{t.translateFailed}</span>}
          </span>
        </div>
      )}

      <label className="block text-sm font-semibold">
        {t.slug}
        <input {...field("slug")} dir="ltr" maxLength={60} defaultValue={category?.slug} placeholder="living-rooms" className={input} />
        <span className="mt-1 block text-xs font-normal text-muted">{t.slugHint}</span>
        {fieldError("slug")}
      </label>

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
          // Wait for a running translation so the English fields are filled in when saving.
          disabled={pending || translating}
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
