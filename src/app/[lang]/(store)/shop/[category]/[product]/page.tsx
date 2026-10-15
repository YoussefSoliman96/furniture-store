import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ShoppingBag } from "lucide-react";
import { localizeHref } from "@/i18n/config";
import { getDictionary, getLocale } from "@/i18n/dictionaries";
import { getProduct, getProducts } from "@/lib/data/catalog";
import { categoryHref, productHref } from "@/config/navigation";
import { pageMetadata } from "@/components/store/page-placeholder";
import { ProductImage } from "@/components/store/product-image";
import { StockBadge } from "@/components/store/product-card";
import { fill, formatPrice, loc } from "@/lib/format";
import { siteUrl } from "@/lib/seo";

export async function generateStaticParams({ params }: { params: { category: string } }) {
  const products = await getProducts(params.category);
  return products.map((p) => ({ product: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/shop/[category]/[product]">) {
  const { category, product: slug } = await params;
  const product = await getProduct(category, slug);
  if (!product) notFound();
  const locale = await getLocale();
  return {
    ...(await pageMetadata(loc(locale, product.nameAr, product.nameEn), productHref(category, slug))),
    description: loc(locale, product.descriptionAr, product.descriptionEn),
  };
}

export default function ProductPage({ params }: PageProps<"/[lang]/shop/[category]/[product]">) {
  // params are read inside Suspense so products added after the build get an
  // instant shell, then are rendered and cached on first visit.
  return (
    <Suspense fallback={<ProductSkeleton />}>
      <ProductContent params={params} />
    </Suspense>
  );
}

function ProductSkeleton() {
  return (
    <section className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-2 lg:px-8">
      <div className="aspect-[4/3] animate-pulse rounded-2xl bg-surface-muted" />
      <div className="space-y-4">
        <div className="h-4 w-24 animate-pulse rounded bg-surface-muted" />
        <div className="h-9 w-3/4 animate-pulse rounded bg-surface-muted" />
        <div className="h-7 w-32 animate-pulse rounded bg-surface-muted" />
        <div className="h-24 animate-pulse rounded bg-surface-muted" />
      </div>
    </section>
  );
}

async function ProductContent({ params }: Pick<PageProps<"/[lang]/shop/[category]/[product]">, "params">) {
  const { category, product: slug } = await params;
  const product = await getProduct(category, slug);
  if (!product) notFound();

  const locale = await getLocale();
  const t = await getDictionary();
  const name = loc(locale, product.nameAr, product.nameEn);
  const categoryName = loc(locale, product.categoryNameAr, product.categoryNameEn);
  const Back = locale === "ar" ? ArrowRight : ArrowLeft;
  const onSale = product.compareAtPrice !== null && product.compareAtPrice > product.price;

  // Product structured data for rich results (price, availability).
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    sku: product.sku,
    description: loc(locale, product.descriptionAr, product.descriptionEn),
    category: categoryName,
    brand: { "@type": "Brand", name: t.meta.title },
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "EGP",
      availability: `https://schema.org/${product.stock > 0 ? "InStock" : "OutOfStock"}`,
      url: new URL(localizeHref(locale, productHref(category, slug)), siteUrl).toString(),
    },
  };

  const details = [
    [t.shop.material, loc(locale, product.materialAr, product.materialEn)],
    [t.shop.dimensions, product.dimensions],
    [t.shop.sku, product.sku],
  ].filter(([, value]) => value);

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <Link
        href={localizeHref(locale, categoryHref(category))}
        className="inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-primary"
      >
        <Back className="size-4" aria-hidden />
        {fill(t.shop.backTo, { name: categoryName })}
      </Link>

      <div className="mt-6 grid gap-8 md:grid-cols-2 lg:gap-12">
        <ProductImage icon={product.categoryIcon} seed={product.sku} className="rounded-2xl" />

        <div className="flex flex-col">
          <p className="text-sm font-semibold text-primary">{categoryName}</p>
          <h1 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">{name}</h1>
          <p className="mt-4 flex flex-wrap items-center gap-3">
            <span className="text-2xl font-bold text-primary">{formatPrice(locale, product.price)}</span>
            {onSale && <s className="text-muted">{formatPrice(locale, product.compareAtPrice!)}</s>}
            {product.stock > product.lowStockThreshold ? (
              <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">{t.shop.inStock}</span>
            ) : (
              <StockBadge stock={product.stock} threshold={product.lowStockThreshold} t={t.shop} />
            )}
          </p>
          <p className="mt-6 leading-relaxed text-muted">{loc(locale, product.descriptionAr, product.descriptionEn)}</p>

          <dl className="mt-6 divide-y divide-border rounded-xl border border-border bg-surface">
            {details.map(([label, value]) => (
              <div key={label} className="flex justify-between gap-4 px-4 py-3 text-sm">
                <dt className="text-muted">{label}</dt>
                <dd className="text-end font-semibold" dir="auto">
                  {value}
                </dd>
              </div>
            ))}
          </dl>

          <button
            type="button"
            disabled
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground opacity-60"
          >
            <ShoppingBag className="size-5" aria-hidden />
            {t.shop.addToCart}
          </button>
          <p className="mt-3 text-sm text-muted">{t.shop.orderingSoon}</p>
        </div>
      </div>
    </section>
  );
}
