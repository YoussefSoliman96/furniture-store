import type { Metadata } from "next";
import { getDictionary, getLocale } from "@/i18n/dictionaries";
import { Logo } from "@/components/ui/logo";
import { Drawer } from "@/components/ui/drawer";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { DashboardNav, DashboardSidebar } from "@/components/dashboard/dashboard-nav";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary();
  return {
    title: { default: t.dashboard.title, template: `%s | ${t.dashboard.title}` },
    // Internal tool: keep it out of search results.
    robots: { index: false, follow: false },
  };
}

export default async function DashboardLayout({ children }: LayoutProps<"/[lang]/dashboard">) {
  const locale = await getLocale();
  const t = await getDictionary();
  const otherLocale = locale === "ar" ? "en" : "ar";

  return (
    <div className="flex min-h-dvh bg-background">
      <DashboardSidebar locale={locale} labels={t.dashboard} brand={<Logo href="/dashboard" />} />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-2 border-b border-border bg-background/90 px-4 backdrop-blur sm:px-6">
          <Drawer
            openLabel={t.nav.openMenu}
            closeLabel={t.nav.closeMenu}
            header={<Logo href="/dashboard" />}
            triggerClassName="-ms-2 lg:hidden"
          >
            <div className="flex min-h-full flex-col">
              <DashboardNav locale={locale} labels={t.dashboard} />
            </div>
          </Drawer>
          <p className="me-auto truncate font-semibold">{t.dashboard.title}</p>
          <LanguageSwitcher to={otherLocale} text={t.language.switch} label={t.language.label} />
          <ThemeToggle label={t.theme.toggle} />
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
