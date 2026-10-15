import Link from "next/link";
import { localizeHref } from "@/i18n/config";
import { getDictionary, getLocale } from "@/i18n/dictionaries";

export async function Logo({ href = "/", className = "" }: { href?: string; className?: string }) {
  const locale = await getLocale();
  const { brand, meta } = await getDictionary();
  return (
    <Link
      href={localizeHref(locale, href)}
      aria-label={meta.title}
      className={`flex shrink-0 items-center gap-2.5 text-primary ${className}`}
    >
      <span className="brand-mark h-10 w-8" aria-hidden />
      <span className="flex flex-col leading-none" aria-hidden>
        <span className="font-display text-2xl font-semibold tracking-wide uppercase rtl:tracking-normal">{brand.name}</span>
        <span className="text-[0.65rem] font-semibold tracking-[0.25em] text-muted uppercase rtl:tracking-normal rtl:text-xs">{brand.sub}</span>
      </span>
    </Link>
  );
}
