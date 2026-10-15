import type { Dictionary } from "@/i18n/dictionaries";

export const FACEBOOK_URL = "https://www.facebook.com/profile.php?id=100054214761654";

export const mainNav = [
  { key: "home", href: "/" },
  { key: "shop", href: "/shop" },
  { key: "collections", href: "/collections" },
  { key: "about", href: "/about" },
  { key: "contact", href: "/contact" },
] as const satisfies readonly { key: keyof Dictionary["nav"]; href: string }[];

// Categories are managed by admins in the dashboard; see lib/data/catalog.ts.
export const categoryHref = (slug: string) => `/shop/${slug}`;
export const productHref = (categorySlug: string, productSlug: string) =>
  `/shop/${categorySlug}/${productSlug}`;
