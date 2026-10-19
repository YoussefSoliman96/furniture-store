"use client";

import { useCallback, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import { matchesSearch } from "@/lib/search";

type Option = { value: string; label: string };

const control =
  "h-10 rounded-lg border border-border bg-background px-3 text-sm outline-none transition-colors focus:border-primary";

/**
 * Filters a server-rendered list as you type: rows inside #targetId carry `data-search`
 * (normalized text) and optionally `data-category`. Rows are hidden in place, so it is instant
 * and the forms in each row keep working. The query and category are kept in the URL.
 */
export function LiveFilter({
  targetId,
  emptyId,
  searchLabel,
  categoryLabel,
  allCategoriesLabel,
  categories,
  defaultQuery = "",
  defaultCategory = "",
}: {
  targetId: string;
  /** Element shown when nothing matches. */
  emptyId: string;
  searchLabel: string;
  categoryLabel?: string;
  allCategoriesLabel?: string;
  categories?: Option[];
  defaultQuery?: string;
  defaultCategory?: string;
}) {
  const queryRef = useRef<HTMLInputElement>(null);
  const categoryRef = useRef<HTMLSelectElement>(null);

  const apply = useCallback(() => {
    const query = queryRef.current?.value ?? "";
    const category = categoryRef.current?.value ?? "";
    const rows = document.querySelectorAll<HTMLElement>(`#${targetId} [data-search]`);
    let shown = 0;
    for (const row of rows) {
      const match =
        matchesSearch(row.dataset.search ?? "", query) && (!category || row.dataset.category === category);
      row.hidden = !match;
      if (match) shown++;
    }
    const empty = document.getElementById(emptyId);
    if (empty) empty.hidden = shown > 0 || rows.length === 0;

    const url = new URL(window.location.href);
    for (const [key, value] of [["q", query.trim()], ["category", category]] as const) {
      if (value) url.searchParams.set(key, value);
      else url.searchParams.delete(key);
    }
    window.history.replaceState(window.history.state, "", url);
  }, [targetId, emptyId]);

  // Apply the initial filter, and re-apply when the list re-renders (e.g. after hiding a product).
  useEffect(() => {
    apply();
    const target = document.getElementById(targetId);
    if (!target) return;
    const observer = new MutationObserver(apply);
    observer.observe(target, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [apply, targetId]);

  return (
    <div role="search" className="flex flex-wrap gap-2">
      <label className="relative min-w-56 flex-1">
        <span className="sr-only">{searchLabel}</span>
        <Search className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden />
        <input
          ref={queryRef}
          type="search"
          defaultValue={defaultQuery}
          placeholder={searchLabel}
          onInput={apply}
          autoComplete="off"
          className={`${control} w-full ps-9`}
        />
      </label>
      {categories && (
        <select
          ref={categoryRef}
          defaultValue={defaultCategory}
          onChange={apply}
          aria-label={categoryLabel}
          className={control}
        >
          <option value="">{allCategoriesLabel}</option>
          {categories.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}
