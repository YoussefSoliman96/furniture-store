import { getDictionary } from "@/i18n/dictionaries";

/** Body for dashboard sections that aren't built yet: the pulsing logo from the loading screen. */
export async function SectionPlaceholder({ title }: { title: string }) {
  const t = await getDictionary();
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{title}</h1>
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-5 rounded-xl border border-dashed border-border bg-surface p-8 text-center">
        <span className="brand-mark h-20 w-16 animate-pulse text-primary" aria-hidden />
        <div>
          <p className="font-display text-xl font-semibold">{t.dashboard.comingSoon}</p>
          <p className="mt-1 text-sm text-muted">{t.dashboard.placeholder}</p>
        </div>
      </div>
    </div>
  );
}
