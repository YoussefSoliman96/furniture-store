import Link from "next/link";
import { ExternalLink, Eye, EyeOff, Pencil, Plus, Star, Trash2 } from "lucide-react";
import { localizeHref } from "@/i18n/config";
import { getDictionary, getLocale } from "@/i18n/dictionaries";
import { getAdminCategories, getAdminProducts } from "@/lib/data/admin";
import { deleteProduct, toggleProduct } from "@/lib/actions/products";
import { categoryHref } from "@/config/navigation";
import { formatNumber, formatPrice, loc } from "@/lib/format";
import { PageHeader } from "@/components/dashboard/page-header";
import { LiveFilter } from "@/components/dashboard/live-filter";
import { searchText } from "@/lib/search";
import { storefrontEnabled } from "@/lib/site-mode";

export async function generateMetadata() {
  const t = await getDictionary();
  return { title: t.adminProducts.title };
}

const iconBtn =
  "inline-flex size-10 items-center justify-center rounded-md text-muted md:size-8 transition-colors hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:opacity-30";

export default async function AdminProductsPage({ searchParams }: PageProps<"/[lang]/dashboard/products">) {
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q : "";
  const categoryId = typeof params.category === "string" ? params.category : "";
  const locale = await getLocale();
  const t = (await getDictionary()).adminProducts;
  // All products are loaded; the live filter narrows them in the browser as you type.
  const [rows, categories] = await Promise.all([getAdminProducts(), getAdminCategories()]);
  const showStoreLink = storefrontEnabled();

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

      <LiveFilter
        targetId="product-rows"
        emptyId="product-no-match"
        searchLabel={t.search}
        categoryLabel={t.category}
        allCategoriesLabel={t.allCategories}
        categories={categories.map((c) => ({ value: c.id, label: loc(locale, c.nameAr, c.nameEn) }))}
        defaultQuery={q}
        defaultCategory={categoryId}
      />

      <p id="product-no-match" hidden className="rounded-xl border border-dashed border-border p-10 text-center text-muted">
        {t.noMatch}
      </p>
      {rows.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border p-10 text-center text-muted">{t.empty}</p>
      ) : (
        // Table on desktop; on phones each row becomes a card.
        <div className="rounded-xl border border-border bg-surface md:overflow-x-auto">
          <table className="w-full text-sm max-md:block md:min-w-[760px]">
            <thead className="border-b border-border text-xs text-muted uppercase max-md:hidden">
              <tr>
                <th className="px-4 py-3 text-start font-semibold">{t.product}</th>
                <th className="px-4 py-3 text-start font-semibold">{t.category}</th>
                <th className="px-4 py-3 text-start font-semibold">{t.price}</th>
                <th className="px-4 py-3 text-start font-semibold">{t.stock}</th>
                <th className="px-4 py-3 text-start font-semibold">{t.status}</th>
                <th className="px-4 py-3 text-end font-semibold">{t.actions}</th>
              </tr>
            </thead>
            <tbody id="product-rows" className="divide-y divide-border max-md:block">
              {rows.map((p) => {
                const stockTone =
                  p.stock <= 0
                    ? "text-red-700 dark:text-red-400"
                    : p.stock <= p.lowStockThreshold
                      ? "text-amber-700 dark:text-amber-400"
                      : "";
                return (
                  <tr
                    key={p.id}
                    data-search={searchText(p.nameAr, p.nameEn, p.sku, p.categoryNameAr, p.categoryNameEn)}
                    data-category={p.categoryId}
                    className={`max-md:grid max-md:grid-cols-[1fr_auto] max-md:gap-x-3 max-md:gap-y-1 max-md:p-4 ${p.isActive ? "" : "bg-surface-muted/60"}`}
                  >
                    <td className="px-4 py-3 max-md:col-start-1 max-md:row-start-1 max-md:p-0">
                      <Link href={localizeHref(locale, `/dashboard/products/${p.id}`)} className="font-semibold hover:text-primary">
                        {loc(locale, p.nameAr, p.nameEn)}
                      </Link>
                      <p className="text-xs text-muted">
                      <bdi dir="ltr">{p.sku}</bdi>
                    </p>
                    </td>
                    <td className="px-4 py-3 text-muted max-md:col-start-1 max-md:row-start-2 max-md:p-0 max-md:text-xs">
                      {loc(locale, p.categoryNameAr, p.categoryNameEn)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap max-md:col-start-1 max-md:row-start-3 max-md:mt-2 max-md:p-0">
                      {formatPrice(locale, p.price)}
                      {p.compareAtPrice && (
                        <span className="ms-2 text-xs text-muted line-through">{formatPrice(locale, p.compareAtPrice)}</span>
                      )}
                    </td>
                    <td className={`px-4 py-3 font-bold tabular-nums max-md:col-start-2 max-md:row-start-3 max-md:mt-2 max-md:p-0 ${stockTone}`}>
                      <span className="me-1 text-xs font-normal text-muted md:hidden">{t.stock}:</span>
                      {formatNumber(locale, p.stock)}
                    </td>
                    <td className="px-4 py-3 max-md:col-span-2 max-md:row-start-4 max-md:mt-1 max-md:p-0">
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
                    <td className="px-4 py-3 max-md:col-start-2 max-md:row-span-2 max-md:row-start-1 max-md:-me-2 max-md:p-0">
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
                        {showStoreLink && (
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
                        )}
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
