import { lang } from "next/root-params";
import { notFound } from "next/navigation";
import { hasLocale, type Locale } from "./config";

const dictionaries = {
  ar: () => import("./dictionaries/ar.json").then((m) => m.default),
  en: () => import("./dictionaries/en.json").then((m) => m.default),
} satisfies Record<Locale, () => Promise<unknown>>;

export type Dictionary = Awaited<ReturnType<(typeof dictionaries)["en"]>>;

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
