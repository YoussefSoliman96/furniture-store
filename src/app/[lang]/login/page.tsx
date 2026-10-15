import type { Metadata } from "next";
import { getDictionary, getLocale } from "@/i18n/dictionaries";
import { Logo } from "@/components/ui/logo";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { LoginForm } from "./login-form";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary();
  return { title: t.auth.title, robots: { index: false, follow: false } };
}

export default async function LoginPage() {
  const locale = await getLocale();
  const t = await getDictionary();
  return (
    <main className="flex flex-1 flex-col items-center justify-center bg-accent px-4 py-16">
      <div className="absolute end-4 top-4 flex items-center gap-1">
        <LanguageSwitcher to={locale === "ar" ? "en" : "ar"} text={t.language.switch} label={t.language.label} />
        <ThemeToggle label={t.theme.toggle} />
      </div>
      <div className="w-full max-w-sm rounded-2xl border border-border bg-surface p-8 shadow-sm">
        <Logo className="mx-auto mb-6 w-fit" />
        <h1 className="text-center text-xl font-bold">{t.auth.title}</h1>
        <p className="mt-1 mb-6 text-center text-sm text-muted">{t.auth.subtitle}</p>
        <LoginForm locale={locale} t={t.auth} />
      </div>
    </main>
  );
}
