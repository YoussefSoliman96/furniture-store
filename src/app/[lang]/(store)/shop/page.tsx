import { getDictionary, getLocale } from "@/i18n/dictionaries";
import { getCategories, getProducts } from "@/lib/data/catalog";
import { pageMetadata } from "@/components/store/page-placeholder";
import { CategoryChips, ProductGrid } from "@/components/store/product-grid";
import { fill, formatNumber } from "@/lib/format";

export async function generateMetadata() {
  const t = await getDictionary();
  return pageMetadata(t.shop.title, "/shop");
}

export default async function ShopPage() {
  const locale = await getLocale();
  const t = await getDictionary();
  const [categories, products] = await Promise.all([getCategories(), getProducts()]);

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="font-display text-4xl font-semibold sm:text-5xl">{t.shop.title}</h1>
      <p className="mt-3 text-muted">
        {t.shop.intro} · {fill(t.shop.productCount, { count: formatNumber(locale, products.length) })}
      </p>
      <CategoryChips categories={categories} locale={locale} allLabel={t.shop.all} />
      <ProductGrid products={products} locale={locale} t={t.shop} />
    </section>
  );
}
