/**
 * Suspense boundary for every dashboard page. The layout stays mounted on
 * navigations between pages, so its own boundary doesn't cover them; this one
 * shows a skeleton inside the dashboard frame while the page's admin data loads.
 */
export default function DashboardLoading() {
  return (
    <div className="space-y-8" aria-busy="true">
      <div className="h-9 w-56 animate-pulse rounded-lg bg-surface-muted" />
      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <li key={i} className="h-24 animate-pulse rounded-xl border border-border bg-surface-muted" />
        ))}
      </ul>
      <div className="h-64 animate-pulse rounded-xl border border-border bg-surface-muted" />
    </div>
  );
}
