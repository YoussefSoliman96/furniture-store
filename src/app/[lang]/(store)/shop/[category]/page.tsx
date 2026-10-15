import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getDictionary, getLocale } from "@/i18n/dictionaries";
import { getCategories, getCategoryBySlug, getProducts } from "@/lib/data/catalog";
import { categoryHref } from "@/config/navigation";
import { pageMetadata } from "@/components/store/page-placeholder";
import { CategoryChips, ProductGrid, ProductGridSkeleton } from "@/components/store/product-grid";
import { fill, formatNumber, loc } from "@/lib/format";

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/shop/[category]">) {
  const { category: slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();
  const locale = await getLocale();
  return {
    ...(await pageMetadata(loc(locale, category.nameAr, category.nameEn), categoryHref(slug))),
    description: loc(locale, category.descriptionAr, category.descriptionEn) || undefined,
  };
}

export default function CategoryPage({ params }: PageProps<"/[lang]/shop/[category]">) {
  // params are read inside Suspense so categories added after the build get an
  // instant shell, then are rendered and cached on first visit.
  return (
    <Suspense fallback={<ProductGridSkeleton />}>
      <CategoryContent params={params} />
    </Suspense>
  );
}

async function CategoryContent({ params }: Pick<PageProps<"/[lang]/shop/[category]">, "params">) {
  const { category: slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const locale = await getLocale();
  const t = await getDictionary();
  const [categories, products] = await Promise.all([getCategories(), getProducts(slug)]);

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="font-display text-4xl font-semibold sm:text-5xl">
        {loc(locale, category.nameAr, category.nameEn)}
      </h1>
      <p className="mt-3 max-w-2xl text-muted">
        {loc(locale, category.descriptionAr, category.descriptionEn)}{" "}
        · {fill(t.shop.productCount, { count: formatNumber(locale, products.length) })}
      </p>
      <CategoryChips categories={categories} locale={locale} allLabel={t.shop.all} activeSlug={slug} />
      <ProductGrid products={products} locale={locale} t={t.shop} />
    </section>
  );
}
