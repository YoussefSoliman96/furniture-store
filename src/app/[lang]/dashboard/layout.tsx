import { Suspense } from "react";
import type { Metadata } from "next";
import { LogOut } from "lucide-react";
import { getDictionary, getLocale } from "@/i18n/dictionaries";
import { requireAdminPage } from "@/lib/auth/guard";
import { logout } from "@/lib/auth/actions";
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

export default function DashboardLayout({ children }: LayoutProps<"/[lang]/dashboard">) {
  // The session check reads cookies, so the whole admin area renders at request
  // time behind this boundary; nothing admin-specific is in the static shell.
  return (
    <Suspense fallback={<DashboardFallback />}>
      <AdminShell>{children}</AdminShell>
    </Suspense>
  );
}

async function AdminShell({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  const user = await requireAdminPage(locale);
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
          <span className="hidden text-sm text-muted md:inline">
            {t.dashboard.signedInAs} <strong className="text-foreground">{user.name}</strong>
          </span>
          <LanguageSwitcher to={otherLocale} text={t.language.switch} label={t.language.label} />
          <ThemeToggle label={t.theme.toggle} />
          <form action={logout}>
            <input type="hidden" name="locale" value={locale} />
            <button
              type="submit"
              aria-label={t.dashboard.logout}
              title={t.dashboard.logout}
              className="inline-flex size-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-accent"
            >
              <LogOut className="size-5 rtl:-scale-x-100" aria-hidden />
            </button>
          </form>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

function DashboardFallback() {
  return (
    <div className="flex min-h-dvh items-center justify-center">
      <span className="brand-mark h-14 w-11 animate-pulse text-primary" aria-hidden />
    </div>
  );
}
