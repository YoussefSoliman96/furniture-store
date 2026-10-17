import Link from "next/link";
import { AlertTriangle, Boxes, Coins, Package, PackageX, Tags } from "lucide-react";
import { localizeHref } from "@/i18n/config";
import { getDictionary, getLocale } from "@/i18n/dictionaries";
import { getDashboardStats } from "@/lib/data/admin";
import { formatNumber, formatPrice, loc } from "@/lib/format";
import { PageHeader } from "@/components/dashboard/page-header";

export async function generateMetadata() {
  const t = await getDictionary();
  // The layout's title template only applies to child segments, not this page.
  return { title: { absolute: `${t.dashboard.overview} | ${t.dashboard.title}` } };
}

export default async function DashboardOverview() {
  const locale = await getLocale();
  const t = await getDictionary();
  const stats = await getDashboardStats();
  const s = t.dashboard.stats;

  const tiles = [
    { label: s.products, value: formatNumber(locale, stats.products), icon: Package },
    { label: s.categories, value: formatNumber(locale, stats.categories), icon: Tags },
    { label: s.stockUnits, value: formatNumber(locale, stats.units), icon: Boxes },
    { label: s.stockValue, value: formatPrice(locale, stats.value), icon: Coins },
    { label: s.lowStock, value: formatNumber(locale, stats.low), icon: AlertTriangle, warn: stats.low > 0 },
    { label: s.outOfStock, value: formatNumber(locale, stats.out), icon: PackageX, warn: stats.out > 0 },
  ];

  return (
    <div className="space-y-8">
      <PageHeader title={t.dashboard.overview} />

      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {tiles.map(({ label, value, icon: Icon, warn }) => (
          <li key={label} className="flex items-center gap-4 rounded-xl border border-border bg-surface p-5">
            <span
              className={`inline-flex size-11 shrink-0 items-center justify-center rounded-lg ${
                warn ? "bg-amber-500/15 text-amber-600 dark:text-amber-400" : "bg-accent text-primary"
              }`}
            >
              <Icon className="size-5" aria-hidden />
            </span>
            <div className="min-w-0">
              <p className="text-sm text-muted">{label}</p>
              <p className="truncate text-2xl font-bold tabular-nums">{value}</p>
            </div>
          </li>
        ))}
      </ul>

      <section className="rounded-xl border border-border bg-surface">
        <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-4">
          <h2 className="font-bold">{t.dashboard.lowStockList}</h2>
          <Link
            href={localizeHref(locale, "/dashboard/inventory?filter=low")}
            className="text-sm font-semibold text-primary hover:underline"
          >
            {t.dashboard.viewInventory}
          </Link>
        </div>
        {stats.lowStock.length === 0 ? (
          <p className="px-5 py-6 text-sm text-muted">{t.dashboard.allGood}</p>
        ) : (
          <ul className="divide-y divide-border">
            {stats.lowStock.map((p) => (
              <li key={p.id} className="flex items-center justify-between gap-4 px-5 py-3 text-sm">
                <span>
                  <span className="font-semibold">{loc(locale, p.nameAr, p.nameEn)}</span>
                  <span className="ms-2 text-muted" dir="ltr">{p.sku}</span>
                </span>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-bold tabular-nums ${
                    p.stock <= 0
                      ? "bg-red-500/15 text-red-700 dark:text-red-300"
                      : "bg-amber-500/15 text-amber-700 dark:text-amber-300"
                  }`}
                >
                  {formatNumber(locale, p.stock)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
