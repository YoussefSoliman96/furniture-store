import type { Locale } from "@/i18n/config";

/** Pick the Arabic or English variant of a bilingual field. */
export const loc = (locale: Locale, ar: string, en: string) => (locale === "ar" ? ar : en);

const intlLocale = (locale: Locale) => (locale === "ar" ? "ar-EG" : "en-EG");

export const formatPrice = (locale: Locale, amount: number) =>
  new Intl.NumberFormat(intlLocale(locale), {
    style: "currency",
    currency: "EGP",
    maximumFractionDigits: 0,
  }).format(amount);

export const formatNumber = (locale: Locale, value: number) =>
  new Intl.NumberFormat(intlLocale(locale)).format(value);

/** Server-side date formatting, pinned to Cairo time so output doesn't depend on the host. */
export const formatDateTime = (locale: Locale, date: Date) =>
  new Intl.DateTimeFormat(intlLocale(locale), {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Africa/Cairo",
  }).format(date);

/** Fill "{name}" placeholders in a dictionary string. */
export const fill = (template: string, values: Record<string, string | number>) =>
  template.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? `{${key}}`));
