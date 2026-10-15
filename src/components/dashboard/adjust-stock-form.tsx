"use client";

import { useActionState, useEffect, useRef } from "react";
import { adjustStock, type AdjustStockState } from "@/lib/actions/inventory";
import type { Dictionary } from "@/i18n/dictionaries";

const control =
  "rounded-md border border-border bg-background px-2 py-1.5 text-sm outline-none transition-colors focus:border-primary";

export function AdjustStockForm({ productId, t }: { productId: string; t: Dictionary["inventory"] }) {
  const [state, action, pending] = useActionState<AdjustStockState, FormData>(adjustStock, undefined);
  const formRef = useRef<HTMLFormElement>(null);

  // Clear the inputs after a successful change so it isn't applied twice by accident.
  useEffect(() => {
    if (state && "ok" in state) formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={action} className="flex flex-wrap items-center gap-2">
      <input type="hidden" name="productId" value={productId} />
      <input
        name="delta"
        type="number"
        step={1}
        required
        dir="ltr"
        aria-label={t.quantity}
        title={t.quantityHint}
        placeholder="±"
        className={`${control} w-20 tabular-nums`}
      />
      <select name="reason" aria-label={t.reason} defaultValue="restock" className={control}>
        {Object.entries(t.reasons).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
      <input name="note" maxLength={200} aria-label={t.note} placeholder={t.note} className={`${control} w-36`} />
      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground hover:bg-primary-hover disabled:opacity-60"
      >
        {pending ? t.applying : t.apply}
      </button>
      <span aria-live="polite" className="text-xs">
        {state && "error" in state && <span className="text-red-600 dark:text-red-400">{t.errors[state.error]}</span>}
        {state && "ok" in state && <span className="text-emerald-700 dark:text-emerald-400">{t.updated}</span>}
      </span>
    </form>
  );
}
