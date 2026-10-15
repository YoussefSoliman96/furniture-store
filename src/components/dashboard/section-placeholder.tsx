import { getDictionary } from "@/i18n/dictionaries";

/** Temporary body for dashboard sections that aren't built yet. */
export async function SectionPlaceholder({ title, stats = false }: { title: string; stats?: boolean }) {
  const t = await getDictionary();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="mt-1 text-sm text-muted">{t.dashboard.placeholder}</p>
      </div>
      {stats && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="h-28 rounded-xl border border-border bg-surface" />
          ))}
        </div>
      )}
      <div className="h-96 rounded-xl border border-dashed border-border bg-surface" />
    </div>
  );
}
