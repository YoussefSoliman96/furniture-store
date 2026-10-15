import type { Metadata } from "next";
import { getDictionary, getLocale } from "@/i18n/dictionaries";
import { alternatesFor } from "@/lib/seo";

/** Temporary page body for routes whose content isn't built yet. */
export async function PagePlaceholder({ title }: { title: string }) {
  const t = await getDictionary();
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="font-display text-4xl font-semibold text-foreground sm:text-5xl">{title}</h1>
      <p className="mt-4 text-muted">{t.home.placeholder}</p>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="aspect-[4/3] rounded-2xl border border-border bg-surface-muted" />
        ))}
      </div>
    </section>
  );
}

/** Title + canonical/hreflang metadata for a localized page. */
export async function pageMetadata(title: string, path: string): Promise<Metadata> {
  return { title, alternates: alternatesFor(await getLocale(), path) };
}
