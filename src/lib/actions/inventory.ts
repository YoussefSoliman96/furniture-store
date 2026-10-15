"use server";

import { sql } from "drizzle-orm";
import { refresh, updateTag } from "next/cache";
import { db } from "@/db";
import { inventoryMovements, movementReason, products, type MovementReason } from "@/db/schema";
import { assertAdmin } from "@/lib/auth/guard";
import { TAGS } from "@/lib/data/catalog";

export type AdjustStockState =
  | { ok: true; at: number }
  | { error: "invalidQuantity" | "invalidReason" | "insufficient"; at: number }
  | undefined;

const UUID_RE = /^[0-9a-f-]{36}$/i;
const isReason = (value: string): value is MovementReason =>
  (movementReason.enumValues as readonly string[]).includes(value);

export async function adjustStock(_prev: AdjustStockState, formData: FormData): Promise<AdjustStockState> {
  const admin = await assertAdmin();
  const at = Date.now();
  const productId = String(formData.get("productId") ?? "");
  const delta = Number(formData.get("delta"));
  const reason = String(formData.get("reason") ?? "");
  const note = String(formData.get("note") ?? "").trim().slice(0, 200);

  if (!UUID_RE.test(productId)) throw new Error("Invalid product");
  if (!Number.isInteger(delta) || delta === 0 || Math.abs(delta) > 10_000) return { error: "invalidQuantity", at };
  if (!isReason(reason)) return { error: "invalidReason", at };

  // One statement: the stock change and its ledger entry land together or not at all,
  // and the guard keeps stock from going negative under concurrent edits.
  const result = await db.execute(sql`
    with updated as (
      update ${products}
      set stock = stock + ${delta}, updated_at = now()
      where id = ${productId} and stock + ${delta} >= 0
      returning id
    )
    insert into ${inventoryMovements} (product_id, delta, reason, note, created_by)
    select id, ${delta}, ${reason}, ${note}, ${admin.id} from updated
    returning id
  `);
  if (result.length === 0) return { error: "insufficient", at };

  updateTag(TAGS.products);
  refresh();
  return { ok: true, at };
}
