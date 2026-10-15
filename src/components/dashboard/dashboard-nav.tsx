"use client";

import { useState } from "react";
import {
  Boxes,
  ChevronsLeft,
  LayoutDashboard,
  Package,
  Receipt,
  Settings,
  Store,
  Users,
} from "lucide-react";
import { localizeHref, type Locale } from "@/i18n/config";
import { NavLink } from "@/components/ui/nav-link";
import { dashboardSections, type DashboardLabels } from "./sections";

const icons = {
  overview: LayoutDashboard,
  products: Package,
  inventory: Boxes,
  orders: Receipt,
  customers: Users,
  settings: Settings,
} as const;

const itemClass =
  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-muted transition-colors hover:bg-accent hover:text-foreground";

/** Section links. Used in the desktop sidebar and inside the mobile drawer. */
export function DashboardNav({
  locale,
  labels,
  collapsed = false,
}: {
  locale: Locale;
  labels: DashboardLabels;
  collapsed?: boolean;
}) {
  return (
    <nav aria-label={labels.title} className="flex flex-1 flex-col gap-1 p-3">
      {(["overview", ...dashboardSections] as const).map((key) => {
        const Icon = icons[key];
        const href = localizeHref(locale, key === "overview" ? "/dashboard" : `/dashboard/${key}`);
        return (
          <NavLink
            key={key}
            href={href}
            exact={key === "overview"}
            title={collapsed ? labels[key] : undefined}
            className={`${itemClass} ${collapsed ? "justify-center" : ""}`}
            activeClassName="bg-accent !text-primary"
          >
            <Icon className="size-5 shrink-0" aria-hidden />
            <span className={collapsed ? "sr-only" : ""}>{labels[key]}</span>
          </NavLink>
        );
      })}

      <NavLink
        href={localizeHref(locale, "/")}
        exact
        title={collapsed ? labels.backToStore : undefined}
        className={`${itemClass} mt-auto ${collapsed ? "justify-center" : ""}`}
      >
        <Store className="size-5 shrink-0" aria-hidden />
        <span className={collapsed ? "sr-only" : ""}>{labels.backToStore}</span>
      </NavLink>
    </nav>
  );
}

/** Desktop sidebar that can collapse to an icon rail. */
export function DashboardSidebar({
  locale,
  labels,
  brand,
}: {
  locale: Locale;
  labels: DashboardLabels;
  brand: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const toggleLabel = collapsed ? labels.expand : labels.collapse;

  return (
    <aside
      className={`sticky top-0 hidden h-dvh shrink-0 flex-col border-e border-border bg-surface transition-[width] duration-200 lg:flex ${
        collapsed ? "w-[4.5rem]" : "w-64"
      }`}
    >
      <div className={`flex h-16 items-center border-b border-border px-4 ${collapsed ? "justify-center" : ""}`}>
        {collapsed ? <span className="brand-mark h-9 w-7 text-primary" aria-hidden /> : brand}
      </div>
      <DashboardNav locale={locale} labels={labels} collapsed={collapsed} />
      <button
        type="button"
        onClick={() => setCollapsed((c) => !c)}
        aria-label={toggleLabel}
        aria-expanded={!collapsed}
        title={toggleLabel}
        className="m-3 mt-0 inline-flex h-10 items-center justify-center rounded-lg text-muted transition-colors hover:bg-accent hover:text-foreground"
      >
        <ChevronsLeft
          className={`size-5 transition-transform rtl:-scale-x-100 ${collapsed ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>
    </aside>
  );
}
