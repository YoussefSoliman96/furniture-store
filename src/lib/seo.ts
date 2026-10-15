import type { Metadata } from "next";
import { defaultLocale, locales, localizeHref, type Locale } from "@/i18n/config";

export const siteUrl = new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000");

export const ogLocale: Record<Locale, string> = { ar: "ar_EG", en: "en_US" };

/** Canonical URL + hreflang alternates for a locale-agnostic path like "/shop". */
export function alternatesFor(locale: Locale, path: string): Metadata["alternates"] {
  return {
    canonical: localizeHref(locale, path),
    languages: {
      ...Object.fromEntries(locales.map((l) => [l, localizeHref(l, path)])),
      "x-default": localizeHref(defaultLocale, path),
    },
  };
}
