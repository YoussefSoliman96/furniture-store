import type { MetadataRoute } from "next";
import { locales, localizeHref } from "@/i18n/config";
import { categories, categoryHref, mainNav } from "@/config/navigation";
import { siteUrl } from "@/lib/seo";

/** Public pages in every locale, each listing its hreflang alternates. */
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [...mainNav.map((item) => item.href), ...categories.map(categoryHref)];
  const url = (locale: (typeof locales)[number], path: string) =>
    new URL(localizeHref(locale, path), siteUrl).toString();

  return paths.flatMap((path) =>
    locales.map((locale) => ({
      url: url(locale, path),
      alternates: { languages: Object.fromEntries(locales.map((l) => [l, url(l, path)])) },
    })),
  );
}
