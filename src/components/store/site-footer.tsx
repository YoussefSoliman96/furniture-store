import Link from "next/link";
import { localizeHref } from "@/i18n/config";
import { getDictionary, getLocale } from "@/i18n/dictionaries";
import { categoryHref, FACEBOOK_URL, mainNav } from "@/config/navigation";
import { getCategories } from "@/lib/data/catalog";
import { loc } from "@/lib/format";
import { Logo } from "@/components/ui/logo";

export async function SiteFooter() {
  const locale = await getLocale();
  const t = await getDictionary();
  const categories = await getCategories();
  const linkClass = "text-muted transition-colors hover:text-primary";

  return (
    <footer className="mt-auto border-t border-border bg-surface-muted">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div className="space-y-4">
          <Logo />
          <p className="max-w-xs text-sm leading-relaxed text-muted">{t.footer.about}</p>
        </div>

        <FooterColumn title={t.footer.shop}>
          {categories.map((c) => (
            <li key={c.id}>
              <Link href={localizeHref(locale, categoryHref(c.slug))} className={linkClass}>
                {loc(locale, c.nameAr, c.nameEn)}
              </Link>
            </li>
          ))}
        </FooterColumn>

        <FooterColumn title={t.footer.company}>
          {mainNav
            .filter((item) => item.href !== "/")
            .map((item) => (
              <li key={item.key}>
                <Link href={localizeHref(locale, item.href)} className={linkClass}>
                  {t.nav[item.key]}
                </Link>
              </li>
            ))}
        </FooterColumn>

        <FooterColumn title={t.footer.follow}>
          <li>
            <a
              href={FACEBOOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 ${linkClass}`}
            >
              <FacebookIcon />
              Facebook
            </a>
          </li>
        </FooterColumn>
      </div>

      <div className="border-t border-border">
        <p className="mx-auto max-w-7xl px-4 py-5 text-center text-xs text-muted sm:px-6 lg:px-8">
          © {t.meta.title} — {t.footer.rights}
        </p>
      </div>
    </footer>
  );
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="mb-4 text-sm font-bold text-foreground">{title}</h2>
      {/* Phones: 40px-tall links so they are easy to tap; desktop keeps the tighter list. */}
      <ul className="text-sm md:space-y-2.5 [&_a]:inline-flex [&_a]:min-h-10 [&_a]:items-center md:[&_a]:min-h-0">{children}</ul>
    </div>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden>
      <path d="M24 12.07C24 5.41 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.04V9.41c0-3.02 1.8-4.7 4.54-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.5c-1.5 0-1.96.93-1.96 1.89v2.26h3.32l-.53 3.5h-2.8V24C19.62 23.1 24 18.1 24 12.07z" />
    </svg>
  );
}
