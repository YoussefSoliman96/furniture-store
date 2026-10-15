import Link from "next/link";
import { Search, ShoppingBag, User } from "lucide-react";
import { localizeHref } from "@/i18n/config";
import { getDictionary, getLocale } from "@/i18n/dictionaries";
import { categories, categoryHref, mainNav } from "@/config/navigation";
import { Logo } from "@/components/ui/logo";
import { NavLink } from "@/components/ui/nav-link";
import { Drawer } from "@/components/ui/drawer";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LanguageSwitcher } from "@/components/ui/language-switcher";

const iconButton =
  "inline-flex size-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-accent";

export async function SiteHeader() {
  const locale = await getLocale();
  const t = await getDictionary();
  const otherLocale = locale === "ar" ? "en" : "ar";

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/75">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-2 px-4 sm:px-6 lg:h-20 lg:px-8">
        {/* Mobile: sidebar trigger */}
        <Drawer
          openLabel={t.nav.openMenu}
          closeLabel={t.nav.closeMenu}
          header={<Logo />}
          triggerClassName="-ms-2 lg:hidden"
        >
          <MobileNav />
        </Drawer>

        <Logo className="me-auto lg:me-0" />

        <nav aria-label={t.nav.home} className="mx-auto hidden lg:block">
          <ul className="flex items-center gap-1">
            {mainNav.map((item) => (
              <li key={item.key}>
                <NavLink
                  href={localizeHref(locale, item.href)}
                  exact={item.href === "/"}
                  className="rounded-full px-4 py-2 text-sm font-semibold text-muted transition-colors hover:text-foreground"
                  activeClassName="!text-primary"
                >
                  {t.nav[item.key]}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-0.5 sm:gap-1">
          <Link href={localizeHref(locale, "/search")} aria-label={t.nav.search} title={t.nav.search} className={iconButton}>
            <Search className="size-5" aria-hidden />
          </Link>
          <LanguageSwitcher
            to={otherLocale}
            text={t.language.switch}
            label={t.language.label}
            className="hidden sm:inline-flex"
          />
          <ThemeToggle label={t.theme.toggle} />
          <Link
            href={localizeHref(locale, "/account")}
            aria-label={t.nav.account}
            title={t.nav.account}
            className={`${iconButton} hidden sm:inline-flex`}
          >
            <User className="size-5" aria-hidden />
          </Link>
          <Link href={localizeHref(locale, "/cart")} aria-label={t.nav.cart} title={t.nav.cart} className={`${iconButton} relative`}>
            <ShoppingBag className="size-5" aria-hidden />
            <span className="absolute end-1 top-1 inline-flex size-4 items-center justify-center rounded-full bg-primary text-[0.6rem] font-bold text-primary-foreground">
              0
            </span>
          </Link>
        </div>
      </div>

      {/* Desktop: category strip */}
      <nav aria-label={t.nav.categories} className="hidden border-t border-border lg:block">
        <ul className="mx-auto flex h-11 max-w-7xl items-center justify-center gap-8 px-8 text-sm">
          {categories.map((slug) => (
            <li key={slug}>
              <NavLink
                href={localizeHref(locale, categoryHref(slug))}
                className="font-medium text-muted transition-colors hover:text-primary"
                activeClassName="!text-primary"
              >
                {t.categories[slug]}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}

/** Sidebar contents for small screens: main links, categories, and settings. */
async function MobileNav() {
  const locale = await getLocale();
  const t = await getDictionary();
  const otherLocale = locale === "ar" ? "en" : "ar";
  const item =
    "flex items-center rounded-lg px-3 py-2.5 font-semibold transition-colors hover:bg-accent";

  return (
    <div className="flex min-h-full flex-col gap-6 p-4">
      <nav aria-label={t.nav.home}>
        <ul className="space-y-1">
          {mainNav.map((link) => (
            <li key={link.key}>
              <NavLink
                href={localizeHref(locale, link.href)}
                exact={link.href === "/"}
                className={item}
                activeClassName="bg-accent text-primary"
              >
                {t.nav[link.key]}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <nav aria-label={t.nav.categories}>
        <p className="px-3 pb-2 text-xs font-bold tracking-wider text-muted uppercase">{t.nav.categories}</p>
        <ul className="space-y-1">
          {categories.map((slug) => (
            <li key={slug}>
              <NavLink
                href={localizeHref(locale, categoryHref(slug))}
                className={`${item} font-medium text-muted`}
                activeClassName="bg-accent !text-primary"
              >
                {t.categories[slug]}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-auto flex items-center justify-between border-t border-border pt-4">
        <LanguageSwitcher to={otherLocale} text={t.language.switch} label={t.language.label} />
        <Link href={localizeHref(locale, "/account")} className="inline-flex h-10 items-center gap-2 rounded-full px-3 text-sm font-semibold hover:bg-accent">
          <User className="size-4" aria-hidden />
          {t.nav.account}
        </Link>
      </div>
    </div>
  );
}
