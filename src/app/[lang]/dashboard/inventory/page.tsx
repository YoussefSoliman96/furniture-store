import Link from "next/link";
import { Plus } from "lucide-react";
import { localizeHref } from "@/i18n/config";
import { getDictionary, getLocale } from "@/i18n/dictionaries";
import { getInventory, getRecentMovements, type StockFilter } from "@/lib/data/admin";
import { fill, formatDateTime, formatNumber, loc } from "@/lib/format";
import { PageHeader } from "@/components/dashboard/page-header";
import { AdjustStockForm } from "@/components/dashboard/adjust-stock-form";

export async function generateMetadata() {
  const t = await getDictionary();
  return { title: t.inventory.title };
}

const filters: StockFilter[] = ["all", "low", "out"];

export default async function InventoryPage({ searchParams }: PageProps<"/[lang]/dashboard/inventory">) {
  const raw = (await searchParams).filter;
  const filter = filters.find((f) => f === raw) ?? "all";
  const locale = await getLocale();
  const t = (await getDictionary()).inventory;
  const [items, movements] = await Promise.all([getInventory(filter), getRecentMovements()]);

  return (
    <div className="space-y-6">
      <PageHeader title={t.title} intro={t.intro}>
        <Link
          href={localizeHref(locale, "/dashboard/products/new?from=inventory")}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary-hover"
        >
          <Plus className="size-4" aria-hidden />
          {t.addProduct}
        </Link>
      </PageHeader>

      <nav className="flex gap-2">
        {filters.map((f) => (
          <Link
            key={f}
            href={localizeHref(locale, f === "all" ? "/dashboard/inventory" : `/dashboard/inventory?filter=${f}`)}
            aria-current={f === filter ? "page" : undefined}
            className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors ${
              f === filter
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-surface text-muted hover:border-primary hover:text-primary"
            }`}
          >
            {t.filters[f]}
          </Link>
        ))}
      </nav>

      {/* Table on desktop; on phones each row becomes a card (same markup, so forms aren't duplicated). */}
      <div className="rounded-xl border border-border bg-surface md:overflow-x-auto">
        <table className="w-full text-sm max-md:block md:min-w-[860px]">
          <thead className="border-b border-border text-xs text-muted uppercase max-md:hidden">
            <tr>
              <th className="px-4 py-3 text-start font-semibold">{t.product}</th>
              <th className="px-4 py-3 text-start font-semibold">{t.category}</th>
              <th className="px-4 py-3 text-start font-semibold">{t.stock}</th>
              <th className="px-4 py-3 text-start font-semibold">{t.adjust}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border max-md:block">
            {items.length === 0 && (
              <tr className="max-md:block">
                <td colSpan={4} className="px-4 py-8 text-center text-muted max-md:block">
                  {t.noProducts}
                </td>
              </tr>
            )}
            {items.map((p) => {
              const status = p.stock <= 0 ? "out" : p.stock <= p.lowStockThreshold ? "low" : "ok";
              return (
                <tr key={p.id} className="max-md:grid max-md:grid-cols-[1fr_auto] max-md:gap-x-3 max-md:gap-y-1 max-md:p-4">
                  <td className="px-4 py-3 max-md:col-start-1 max-md:row-start-1 max-md:p-0">
                    <Link
                      href={localizeHref(locale, `/dashboard/products/${p.id}?from=inventory`)}
                      title={t.editProduct}
                      className="font-semibold hover:text-primary"
                    >
                      {loc(locale, p.nameAr, p.nameEn)}
                    </Link>
                    <p className="text-xs text-muted">
                      <bdi dir="ltr">{p.sku}</bdi>
                    </p>
                  </td>
                  <td className="px-4 py-3 text-muted max-md:col-start-1 max-md:row-start-2 max-md:p-0 max-md:text-xs">
                    {loc(locale, p.categoryNameAr, p.categoryNameEn)}
                  </td>
                  <td className="px-4 py-3 max-md:col-start-2 max-md:row-span-2 max-md:row-start-1 max-md:self-center max-md:p-0">
                    <span className="flex items-center gap-2">
                      <span className="w-8 text-lg font-bold tabular-nums">{formatNumber(locale, p.stock)}</span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                          status === "out"
                            ? "bg-red-500/15 text-red-700 dark:text-red-300"
                            : status === "low"
                              ? "bg-amber-500/15 text-amber-700 dark:text-amber-300"
                              : "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                        }`}
                      >
                        {t.statuses[status]}
                      </span>
                    </span>
                  </td>
                  <td className="px-4 py-3 max-md:col-span-2 max-md:mt-3 max-md:p-0">
                    <AdjustStockForm productId={p.id} t={t} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <section className="rounded-xl border border-border bg-surface">
        <h2 className="border-b border-border px-5 py-4 font-bold">{t.recent}</h2>
        {movements.length === 0 ? (
          <p className="px-5 py-6 text-sm text-muted">{t.noMovements}</p>
        ) : (
          <ul className="divide-y divide-border text-sm">
            {movements.map((m) => (
              <li key={m.id} className="flex flex-wrap items-center gap-x-4 gap-y-1 px-5 py-3">
                <span
                  dir="ltr"
                  className={`w-14 font-bold tabular-nums ${m.delta > 0 ? "text-emerald-700 dark:text-emerald-400" : "text-red-700 dark:text-red-400"}`}
                >
                  {m.delta > 0 ? `+${m.delta}` : m.delta}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="font-semibold">{loc(locale, m.productNameAr, m.productNameEn)}</span>
                  <span className="ms-2 text-muted">
                    {t.reasons[m.reason]}
                    {m.note && ` — ${m.note}`}
                  </span>
                </span>
                <span className="text-xs text-muted">
                  {m.userName && `${fill(t.by, { name: m.userName })} · `}
                  {formatDateTime(locale, m.createdAt)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
