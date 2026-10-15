import { lang } from "next/root-params";
import { notFound } from "next/navigation";
import { hasLocale, type Locale } from "./config";

// English is the source of truth for keys; Arabic must match its shape.
export type Dictionary = typeof import("./dictionaries/en.json");

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  ar: () => import("./dictionaries/ar.json").then((m) => m.default),
  en: () => import("./dictionaries/en.json").then((m) => m.default),
};

/** Current locale from the `[lang]` root segment. Server Components only. */
export async function getLocale(): Promise<Locale> {
  const locale = await lang();
  if (!hasLocale(locale)) notFound();
  return locale;
}

/** Dictionary for the current locale. Server Components only. */
export async function getDictionary(): Promise<Dictionary> {
  return dictionaries[await getLocale()]();
}
