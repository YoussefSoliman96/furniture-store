import type { Dictionary } from "@/i18n/dictionaries";

export const dashboardSections = ["products", "inventory", "orders", "customers", "settings"] as const;

export type DashboardSection = (typeof dashboardSections)[number];

export type DashboardLabels = Dictionary["dashboard"];

export const isDashboardSection = (value: string): value is DashboardSection =>
  (dashboardSections as readonly string[]).includes(value);
