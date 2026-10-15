import Link from "next/link";
import { localizeHref } from "@/i18n/config";
import { getDictionary, getLocale } from "@/i18n/dictionaries";

export default async function NotFound() {
  const locale = await getLocale();
  const t = await getDictionary();
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 px-4 py-24 text-center">
      <span className="brand-mark h-20 w-16 text-primary" aria-hidden />
      <h1 className="font-display text-4xl font-semibold">{t.notFound.title}</h1>
      <p className="text-muted">{t.notFound.text}</p>
      <Link
        href={localizeHref(locale, "/")}
        className="mt-2 rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary-hover"
      >
        {t.notFound.back}
      </Link>
    </main>
  );
}
