import type { MetadataRoute } from "next";
import { locales, localizeHref, type Locale } from "@/i18n/config";
import { categoryHref, mainNav, productHref } from "@/config/navigation";
import { getCategories, getProducts } from "@/lib/data/catalog";
import { siteUrl } from "@/lib/seo";
import { storefrontEnabled } from "@/lib/site-mode";

/** Public pages in every locale, each listing its hreflang alternates. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!storefrontEnabled()) return [];
  const [categories, products] = await Promise.all([getCategories(), getProducts()]);
  const paths = [
    ...mainNav.map((item) => item.href),
    ...categories.map((c) => categoryHref(c.slug)),
    ...products.map((p) => productHref(p.categorySlug, p.slug)),
  ];
  const url = (locale: Locale, path: string) => new URL(localizeHref(locale, path), siteUrl).toString();

  return paths.flatMap((path) =>
    locales.map((locale) => ({
      url: url(locale, path),
      alternates: { languages: Object.fromEntries(locales.map((l) => [l, url(l, path)])) },
    })),
  );
}
