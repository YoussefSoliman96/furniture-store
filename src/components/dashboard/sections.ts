import type { Dictionary } from "@/i18n/dictionaries";

/** Every dashboard nav entry, in sidebar order. */
export const dashboardNav = [
  "overview",
  "categories",
  "products",
  "inventory",
  "orders",
  "customers",
  "settings",
] as const;

/** Sections that still render the generic placeholder via /dashboard/[section]. */
export const placeholderSections = ["products", "orders", "customers", "settings"] as const;

export type PlaceholderSection = (typeof placeholderSections)[number];

export type DashboardLabels = Dictionary["dashboard"];

export const isPlaceholderSection = (value: string): value is PlaceholderSection =>
  (placeholderSections as readonly string[]).includes(value);
