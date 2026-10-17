import Link from "next/link";
import { ChevronDown, ChevronUp, Eye, EyeOff, Pencil, Plus, Trash2 } from "lucide-react";
import { localizeHref } from "@/i18n/config";
import { getDictionary, getLocale } from "@/i18n/dictionaries";
import { getAdminCategories } from "@/lib/data/admin";
import { deleteCategory, moveCategory, toggleCategory } from "@/lib/actions/categories";
import { formatNumber, loc } from "@/lib/format";
import { CategoryIcon } from "@/components/ui/category-icon";
import { PageHeader } from "@/components/dashboard/page-header";

export async function generateMetadata() {
  const t = await getDictionary();
  return { title: t.adminCategories.title };
}

const iconBtn =
  "inline-flex size-8 items-center justify-center rounded-md text-muted transition-colors hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:opacity-30";

export default async function AdminCategoriesPage() {
  const locale = await getLocale();
  const t = (await getDictionary()).adminCategories;
  const rows = await getAdminCategories();

  return (
    <div className="space-y-6">
      <PageHeader title={t.title} intro={t.intro}>
        <Link
          href={localizeHref(locale, "/dashboard/categories/new")}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary-hover"
        >
          <Plus className="size-4" aria-hidden />
          {t.new}
        </Link>
      </PageHeader>

      {rows.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border p-10 text-center text-muted">{t.empty}</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border bg-surface">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="border-b border-border text-start text-xs text-muted uppercase">
              <tr>
                <th className="w-24 px-4 py-3 text-start font-semibold">{t.order}</th>
                <th className="px-4 py-3 text-start font-semibold">{t.title}</th>
                <th className="px-4 py-3 text-start font-semibold">{t.products}</th>
                <th className="px-4 py-3 text-start font-semibold">{t.status}</th>
                <th className="px-4 py-3 text-end font-semibold">{t.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((c, i) => (
                <tr key={c.id} className={c.isActive ? "" : "bg-surface-muted/60"}>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <form action={moveCategory}>
                        <input type="hidden" name="id" value={c.id} />
                        <input type="hidden" name="direction" value="up" />
                        <button type="submit" disabled={i === 0} aria-label={t.moveUp} title={t.moveUp} className={iconBtn}>
                          <ChevronUp className="size-4" aria-hidden />
                        </button>
                      </form>
                      <form action={moveCategory}>
                        <input type="hidden" name="id" value={c.id} />
                        <input type="hidden" name="direction" value="down" />
                        <button
                          type="submit"
                          disabled={i === rows.length - 1}
                          aria-label={t.moveDown}
                          title={t.moveDown}
                          className={iconBtn}
                        >
                          <ChevronDown className="size-4" aria-hidden />
                        </button>
                      </form>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent text-primary">
                        <CategoryIcon name={c.icon} className="size-4.5" />
                      </span>
                      <div className="min-w-0">
                        <p className="font-semibold">{loc(locale, c.nameAr, c.nameEn)}</p>
                        <p className="text-xs text-muted">
                          {/* The name in the other language, when it differs from the one shown above. */}
                          {(locale === "ar" ? c.nameEn : c.nameEn && c.nameAr) && (
                            <>{locale === "ar" ? c.nameEn : c.nameAr} · </>
                          )}
                          <span dir="ltr">/{c.slug}</span>
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 tabular-nums">{formatNumber(locale, c.productCount)}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                        c.isActive
                          ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                          : "bg-foreground/10 text-muted"
                      }`}
                    >
                      {c.isActive ? t.visible : t.hidden}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <form action={toggleCategory}>
                        <input type="hidden" name="id" value={c.id} />
                        <button type="submit" aria-label={c.isActive ? t.hide : t.show} title={c.isActive ? t.hide : t.show} className={iconBtn}>
                          {c.isActive ? <EyeOff className="size-4" aria-hidden /> : <Eye className="size-4" aria-hidden />}
                        </button>
                      </form>
                      <Link
                        href={localizeHref(locale, `/dashboard/categories/${c.id}`)}
                        aria-label={t.edit}
                        title={t.edit}
                        className={iconBtn}
                      >
                        <Pencil className="size-4" aria-hidden />
                      </Link>
                      {c.productCount > 0 ? (
                        <button type="button" disabled aria-label={t.delete} title={t.hasProducts} className={iconBtn}>
                          <Trash2 className="size-4" aria-hidden />
                        </button>
                      ) : (
                        <details className="relative">
                          <summary aria-label={t.delete} title={t.delete} className={`${iconBtn} cursor-pointer list-none hover:text-red-600`}>
                            <Trash2 className="size-4" aria-hidden />
                          </summary>
                          <div className="absolute end-0 top-9 z-10 w-56 rounded-lg border border-border bg-surface p-3 text-start shadow-lg">
                            <p className="mb-2 text-xs text-muted">{t.deleteWarning}</p>
                            <form action={deleteCategory}>
                              <input type="hidden" name="id" value={c.id} />
                              <button
                                type="submit"
                                className="w-full rounded-md bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700"
                              >
                                {t.confirmDelete}
                              </button>
                            </form>
                          </div>
                        </details>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
