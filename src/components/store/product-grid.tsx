import Link from "next/link";
import { localizeHref, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Category } from "@/db/schema";
import type { CatalogProduct } from "@/lib/data/catalog";
import { categoryHref } from "@/config/navigation";
import { loc } from "@/lib/format";
import { CategoryIcon } from "@/components/ui/category-icon";
import { ProductCard } from "./product-card";

export function ProductGrid({
  products,
  locale,
  t,
}: {
  products: CatalogProduct[];
  locale: Locale;
  t: Dictionary["shop"];
}) {
  if (products.length === 0) {
    return (
      <p className="mt-10 rounded-2xl border border-dashed border-border p-10 text-center text-muted">{t.empty}</p>
    );
  }
  return (
    <ul className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((p) => (
        <li key={p.id} className="flex [&>a]:w-full">
          <ProductCard product={p} locale={locale} t={t} />
        </li>
      ))}
    </ul>
  );
}

export function ProductGridSkeleton() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="h-12 w-64 animate-pulse rounded-lg bg-surface-muted" />
      <div className="mt-4 h-5 w-96 max-w-full animate-pulse rounded bg-surface-muted" />
      <ul className="mt-16 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }, (_, i) => (
          <li key={i} className="aspect-[3/4] animate-pulse rounded-2xl bg-surface-muted" />
        ))}
      </ul>
    </section>
  );
}

/** Horizontal, scrollable category filter links. */
export function CategoryChips({
  categories,
  locale,
  allLabel,
  activeSlug,
}: {
  categories: Category[];
  locale: Locale;
  allLabel: string;
  activeSlug?: string;
}) {
  const chip =
    "inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors";
  const on = "border-primary bg-primary text-primary-foreground";
  const off = "border-border bg-surface text-muted hover:border-primary hover:text-primary";
  return (
    <nav className="-mx-4 mt-8 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
      <ul className="flex gap-2">
        <li>
          <Link href={localizeHref(locale, "/shop")} className={`${chip} ${activeSlug ? off : on}`}>
            {allLabel}
          </Link>
        </li>
        {categories.map((c) => (
          <li key={c.id}>
            <Link
              href={localizeHref(locale, categoryHref(c.slug))}
              aria-current={c.slug === activeSlug ? "page" : undefined}
              className={`${chip} ${c.slug === activeSlug ? on : off}`}
            >
              <CategoryIcon name={c.icon} className="size-4" />
              {loc(locale, c.nameAr, c.nameEn)}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
