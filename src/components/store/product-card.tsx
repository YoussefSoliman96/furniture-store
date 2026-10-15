import Link from "next/link";
import { localizeHref, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import type { CatalogProduct } from "@/lib/data/catalog";
import { fill, formatPrice, loc } from "@/lib/format";
import { productHref } from "@/config/navigation";
import { ProductImage } from "./product-image";

export function ProductCard({
  product,
  locale,
  t,
}: {
  product: CatalogProduct;
  locale: Locale;
  t: Dictionary["shop"];
}) {
  const name = loc(locale, product.nameAr, product.nameEn);
  return (
    <Link
      href={localizeHref(locale, productHref(product.categorySlug, product.slug))}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-surface transition-shadow hover:shadow-lg"
    >
      <div className="relative">
        <ProductImage icon={product.categoryIcon} seed={product.sku} />
        <div className="absolute start-3 top-3 flex gap-1.5">
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <span className="rounded-full bg-primary px-2.5 py-0.5 text-xs font-bold text-primary-foreground">
              {t.sale}
            </span>
          )}
          <StockBadge stock={product.stock} threshold={product.lowStockThreshold} t={t} />
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <p className="text-xs text-muted">{loc(locale, product.categoryNameAr, product.categoryNameEn)}</p>
        <h3 className="font-semibold text-foreground transition-colors group-hover:text-primary">{name}</h3>
        <p className="mt-auto flex items-baseline gap-2 pt-2">
          <span className="font-bold text-primary">{formatPrice(locale, product.price)}</span>
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <s className="text-sm text-muted">{formatPrice(locale, product.compareAtPrice)}</s>
          )}
        </p>
      </div>
    </Link>
  );
}

export function StockBadge({
  stock,
  threshold,
  t,
}: {
  stock: number;
  threshold: number;
  t: Dictionary["shop"];
}) {
  if (stock <= 0) {
    return (
      <span className="rounded-full bg-foreground/80 px-2.5 py-0.5 text-xs font-bold text-background">
        {t.outOfStock}
      </span>
    );
  }
  if (stock <= threshold) {
    return (
      <span className="rounded-full bg-amber-500/90 px-2.5 py-0.5 text-xs font-bold text-white">
        {fill(t.lowStock, { count: stock })}
      </span>
    );
  }
  return null;
}
