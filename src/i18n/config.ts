export const locales = ["ar", "en"] as const;
export type Locale = (typeof locales)[number];

// Egyptian audience: Arabic first, English as the alternative.
export const defaultLocale: Locale = "ar";

export const LOCALE_COOKIE = "NEXT_LOCALE";

export const hasLocale = (value: string): value is Locale =>
  (locales as readonly string[]).includes(value);

export const dirOf = (locale: Locale) => (locale === "ar" ? "rtl" : "ltr");

/** Prefix an app path with a locale, e.g. localizeHref("en", "/shop") -> "/en/shop". */
export const localizeHref = (locale: Locale, href: string) =>
  `/${locale}${href === "/" ? "" : href}`;

/** Swap the locale segment of a pathname, keeping the rest of the path. */
export const switchLocalePath = (pathname: string, to: Locale) => {
  const segments = pathname.split("/");
  if (hasLocale(segments[1] ?? "")) segments[1] = to;
  else segments.splice(1, 0, to);
  return segments.join("/") || `/${to}`;
};
