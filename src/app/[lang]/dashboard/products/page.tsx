import Link from "next/link";
import { ExternalLink, Eye, EyeOff, Pencil, Plus, Search, Star, Trash2 } from "lucide-react";
import { localizeHref } from "@/i18n/config";
import { getDictionary, getLocale } from "@/i18n/dictionaries";
import { getAdminCategories, getAdminProducts } from "@/lib/data/admin";
import { deleteProduct, toggleProduct } from "@/lib/actions/products";
import { categoryHref } from "@/config/navigation";
import { formatNumber, formatPrice, loc } from "@/lib/format";
import { PageHeader } from "@/components/dashboard/page-header";

export async function generateMetadata() {
  const t = await getDictionary();
  return { title: t.adminProducts.title };
}

const iconBtn =
  "inline-flex size-8 items-center justify-center rounded-md text-muted transition-colors hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:opacity-30";
const control =
  "rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-primary";

export default async function AdminProductsPage({ searchParams }: PageProps<"/[lang]/dashboard/products">) {
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q : "";
  const categoryId = typeof params.category === "string" ? params.category : "";
  const locale = await getLocale();
  const t = (await getDictionary()).adminProducts;
  const [rows, categories] = await Promise.all([getAdminProducts({ q, categoryId }), getAdminCategories()]);
  const filtered = Boolean(q || categoryId);

  return (
    <div className="space-y-6">
      <PageHeader title={t.title} intro={t.intro}>
        <Link
          href={localizeHref(locale, categoryId ? `/dashboard/products/new?category=${categoryId}` : "/dashboard/products/new")}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary-hover"
        >
          <Plus className="size-4" aria-hidden />
          {t.new}
        </Link>
      </PageHeader>

      <form role="search" className="flex flex-wrap gap-2">
        <label className="relative min-w-56 flex-1">
          <span className="sr-only">{t.search}</span>
          <Search className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden />
          <input name="q" type="search" defaultValue={q} placeholder={t.search} className={`${control} w-full ps-9`} />
        </label>
        <select name="category" defaultValue={categoryId} aria-label={t.category} className={control}>
          <option value="">{t.allCategories}</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {loc(locale, c.nameAr, c.nameEn)}
            </option>
          ))}
        </select>
        <button type="submit" className="rounded-lg border border-border px-4 py-2 text-sm font-semibold hover:border-primary hover:text-primary">
          <Search className="size-4 sm:hidden" aria-hidden />
          <span className="max-sm:sr-only">{t.searchButton}</span>
        </button>
      </form>

      {rows.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border p-10 text-center text-muted">
          {filtered ? t.noMatch : t.empty}
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border bg-surface">
          <table className="w-full min-w-[760px] text-sm">
            <thead className="border-b border-border text-xs text-muted uppercase">
              <tr>
                <th className="px-4 py-3 text-start font-semibold">{t.product}</th>
                <th className="px-4 py-3 text-start font-semibold">{t.category}</th>
                <th className="px-4 py-3 text-start font-semibold">{t.price}</th>
                <th className="px-4 py-3 text-start font-semibold">{t.stock}</th>
                <th className="px-4 py-3 text-start font-semibold">{t.status}</th>
                <th className="px-4 py-3 text-end font-semibold">{t.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((p) => {
                const stockTone =
                  p.stock <= 0
                    ? "text-red-700 dark:text-red-400"
                    : p.stock <= p.lowStockThreshold
                      ? "text-amber-700 dark:text-amber-400"
                      : "";
                return (
                  <tr key={p.id} className={p.isActive ? "" : "bg-surface-muted/60"}>
                    <td className="px-4 py-3">
                      <Link href={localizeHref(locale, `/dashboard/products/${p.id}`)} className="font-semibold hover:text-primary">
                        {loc(locale, p.nameAr, p.nameEn)}
                      </Link>
                      <p className="text-xs text-muted" dir="ltr">
                        {p.sku}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-muted">{loc(locale, p.categoryNameAr, p.categoryNameEn)}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {formatPrice(locale, p.price)}
                      {p.compareAtPrice && (
                        <span className="ms-2 text-xs text-muted line-through">{formatPrice(locale, p.compareAtPrice)}</span>
                      )}
                    </td>
                    <td className={`px-4 py-3 font-bold tabular-nums ${stockTone}`}>{formatNumber(locale, p.stock)}</td>
                    <td className="px-4 py-3">
                      <span className="flex flex-wrap items-center gap-1.5">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                            p.isActive ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300" : "bg-foreground/10 text-muted"
                          }`}
                        >
                          {p.isActive ? t.visible : t.hidden}
                        </span>
                        {p.isFeatured && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-accent px-2.5 py-0.5 text-xs font-bold text-primary">
                            <Star className="size-3" aria-hidden />
                            {t.featured}
                          </span>
                        )}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <form action={toggleProduct}>
                          <input type="hidden" name="id" value={p.id} />
                          <button type="submit" aria-label={p.isActive ? t.hide : t.show} title={p.isActive ? t.hide : t.show} className={iconBtn}>
                            {p.isActive ? <EyeOff className="size-4" aria-hidden /> : <Eye className="size-4" aria-hidden />}
                          </button>
                        </form>
                        <Link href={localizeHref(locale, `/dashboard/products/${p.id}`)} aria-label={t.edit} title={t.edit} className={iconBtn}>
                          <Pencil className="size-4" aria-hidden />
                        </Link>
                        <a
                          href={localizeHref(locale, `${categoryHref(p.categorySlug)}/${p.slug}`)}
                          target="_blank"
                          rel="noopener"
                          aria-label={t.viewInStore}
                          title={t.viewInStore}
                          className={iconBtn}
                        >
                          <ExternalLink className="size-4 rtl:-scale-x-100" aria-hidden />
                        </a>
                        {p.hasSales ? (
                          <button type="button" disabled aria-label={t.delete} title={t.hasSales} className={iconBtn}>
                            <Trash2 className="size-4" aria-hidden />
                          </button>
                        ) : (
                          <details className="relative">
                            <summary aria-label={t.delete} title={t.delete} className={`${iconBtn} cursor-pointer list-none hover:text-red-600`}>
                              <Trash2 className="size-4" aria-hidden />
                            </summary>
                            <div className="absolute end-0 top-9 z-10 w-60 rounded-lg border border-border bg-surface p-3 text-start shadow-lg">
                              <p className="mb-2 text-xs text-muted">{t.deleteWarning}</p>
                              <form action={deleteProduct}>
                                <input type="hidden" name="id" value={p.id} />
                                <button type="submit" className="w-full rounded-md bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700">
                                  {t.confirmDelete}
                                </button>
                              </form>
                            </div>
                          </details>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
