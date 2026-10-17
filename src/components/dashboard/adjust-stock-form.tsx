"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { adjustStock, type AdjustStockState } from "@/lib/actions/inventory";
import type { Dictionary } from "@/i18n/dictionaries";
import type { MovementReason } from "@/db/schema";
import { stockDirection } from "@/lib/stock-direction";

const control =
  "h-10 rounded-md border border-border bg-background px-2 text-sm outline-none transition-colors focus:border-primary md:h-auto md:py-1.5";

export function AdjustStockForm({ productId, t }: { productId: string; t: Dictionary["inventory"] }) {
  const [state, action, pending] = useActionState<AdjustStockState, FormData>(adjustStock, undefined);
  const formRef = useRef<HTMLFormElement>(null);
  const [reason, setReason] = useState<MovementReason>("restock");
  const direction = stockDirection[reason];

  // Clear the inputs after a successful change so it isn't applied twice by accident.
  useEffect(() => {
    if (state && "ok" in state) {
      formRef.current?.reset();
      setReason("restock"); // eslint-disable-line react-hooks/set-state-in-effect -- mirrors the form reset
    }
  }, [state]);

  return (
    <form ref={formRef} action={action} className="grid grid-cols-2 items-center gap-2 md:flex md:flex-wrap">
      <input type="hidden" name="productId" value={productId} />
      {/* The reason sets the direction; the sign shows which way this change will go. */}
      <div className="relative md:w-24" dir="ltr">
        <span
          aria-hidden
          title={direction > 0 ? t.direction.adds : direction < 0 ? t.direction.removes : t.direction.either}
          className={`pointer-events-none absolute inset-y-0 left-2.5 flex items-center text-base font-bold ${
            direction > 0 ? "text-emerald-700 dark:text-emerald-400" : direction < 0 ? "text-red-700 dark:text-red-400" : "text-muted"
          }`}
        >
          {direction > 0 ? "+" : direction < 0 ? "−" : "±"}
        </span>
        <input
          name="delta"
          type="number"
          step={1}
          min={direction === 0 ? undefined : 1}
          required
          aria-label={`${t.quantity} (${direction > 0 ? t.direction.adds : direction < 0 ? t.direction.removes : t.direction.either})`}
          title={t.quantityHint}
          className={`${control} w-full ps-7 tabular-nums`}
        />
      </div>
      <select
        name="reason"
        aria-label={t.reason}
        value={reason}
        onChange={(e) => setReason(e.currentTarget.value as MovementReason)}
        className={control}
      >
        {Object.entries(t.reasons).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
      <input name="note" maxLength={200} aria-label={t.note} placeholder={t.note} className={`${control} min-w-0 md:w-36`} />
      <button
        type="submit"
        disabled={pending}
        className="h-10 rounded-md bg-primary px-4 text-sm font-semibold md:h-auto md:px-3 md:py-1.5 text-primary-foreground hover:bg-primary-hover disabled:opacity-60"
      >
        {pending ? t.applying : t.apply}
      </button>
      <span aria-live="polite" className="text-xs max-md:col-span-2 max-md:empty:hidden">
        {state && "error" in state && <span className="text-red-600 dark:text-red-400">{t.errors[state.error]}</span>}
        {state && "ok" in state && <span className="text-emerald-700 dark:text-emerald-400">{t.updated}</span>}
      </span>
    </form>
  );
}
