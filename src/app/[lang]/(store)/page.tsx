import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { localizeHref } from "@/i18n/config";
import { getDictionary, getLocale } from "@/i18n/dictionaries";
import { categories, categoryHref } from "@/config/navigation";

export default async function HomePage() {
  const locale = await getLocale();
  const t = await getDictionary();
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
        <ul className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
          {categories.map((slug) => (
            <li key={slug}>
              <Link
                href={localizeHref(locale, categoryHref(slug))}
                className="group flex aspect-[4/3] items-end rounded-2xl border border-border bg-surface-muted p-5 transition-colors hover:border-primary"
              >
                <span className="font-semibold text-foreground transition-colors group-hover:text-primary">
                  {t.categories[slug]}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
