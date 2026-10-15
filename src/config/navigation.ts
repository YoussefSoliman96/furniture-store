import type { Dictionary } from "@/i18n/dictionaries";

export const FACEBOOK_URL = "https://www.facebook.com/profile.php?id=100054214761654";

export const mainNav = [
  { key: "home", href: "/" },
  { key: "shop", href: "/shop" },
  { key: "collections", href: "/collections" },
  { key: "about", href: "/about" },
  { key: "contact", href: "/contact" },
] as const satisfies readonly { key: keyof Dictionary["nav"]; href: string }[];

export const categories = [
  "living",
  "bedrooms",
  "dining",
  "kids",
  "office",
  "decor",
] as const satisfies readonly (keyof Dictionary["categories"])[];

export type CategorySlug = (typeof categories)[number];

export const categoryHref = (slug: CategorySlug) => `/shop/${slug}`;
