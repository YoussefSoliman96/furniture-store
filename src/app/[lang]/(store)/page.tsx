import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { localizeHref } from "@/i18n/config";
import { getDictionary, getLocale } from "@/i18n/dictionaries";
import { categoryHref } from "@/config/navigation";
import { getCategories, getFeaturedProducts } from "@/lib/data/catalog";
import { loc } from "@/lib/format";
import { CategoryIcon } from "@/components/ui/category-icon";
import { ProductGrid } from "@/components/store/product-grid";

export default async function HomePage() {
  const locale = await getLocale();
  const t = await getDictionary();
  const [categories, featured] = await Promise.all([getCategories(), getFeaturedProducts()]);
  const Arrow = locale === "ar" ? ArrowLeft : ArrowRight;

  return (
    <>
      <section className="relative overflow-hidden bg-accent">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 lg:px-8 lg:py-24">
          <div>
            <p className="mb-4 text-sm font-semibold tracking-[0.2em] text-primary uppercase rtl:tracking-normal">
              {t.meta.tagline}
            </p>
            <h1 className="font-display text-4xl leading-tight font-semibold text-foreground sm:text-5xl lg:text-6xl">
              {t.home.heroTitle}
            </h1>
            <p className="mt-5 max-w-md text-lg text-muted">{t.home.heroText}</p>
            <Link
              href={localizeHref(locale, "/shop")}
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
            >
              {t.home.heroCta}
              <Arrow className="size-4" aria-hidden />
            </Link>
          </div>
          <div className="relative mx-auto hidden aspect-square w-full max-w-sm md:block" aria-hidden>
            <div className="absolute inset-0 rounded-full bg-surface/60" />
            <span className="brand-mark absolute inset-16 text-primary/90" />
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="font-display text-3xl font-semibold text-foreground">{t.nav.categories}</h2>
        <ul className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {categories.map((c) => (
            <li key={c.id}>
              <Link
                href={localizeHref(locale, categoryHref(c.slug))}
                className="group flex h-full flex-col gap-3 rounded-2xl border border-border bg-surface-muted p-5 transition-colors hover:border-primary"
              >
                <span className="inline-flex size-12 items-center justify-center rounded-xl bg-surface text-primary">
                  <CategoryIcon name={c.icon} className="size-6" />
                </span>
                <span className="font-semibold text-foreground transition-colors group-hover:text-primary">
                  {loc(locale, c.nameAr, c.nameEn)}
                </span>
                <span className="line-clamp-2 text-sm text-muted">{loc(locale, c.descriptionAr, c.descriptionEn)}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {featured.length > 0 && (
        <section className="mx-auto w-full max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-4">
            <h2 className="font-display text-3xl font-semibold text-foreground">{t.shop.featured}</h2>
            <Link
              href={localizeHref(locale, "/shop")}
              className="inline-flex min-h-10 items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
            >
              {t.shop.viewAll}
              <Arrow className="size-4" aria-hidden />
            </Link>
          </div>
          <ProductGrid products={featured} locale={locale} t={t.shop} />
        </section>
      )}
    </>
  );
}
