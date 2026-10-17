"use server";

import { assertAdmin } from "@/lib/auth/guard";
import { translateToEnglish, translationEnabled } from "@/lib/translate";

export type TranslateResult = { ok: true; values: Record<string, string> } | { ok: false; error: "disabled" | "failed" };

const MAX_FIELDS = 8;
const MAX_LENGTH = 2000;

/** Admin-only: Arabic → English for form fields. Keys come back unchanged. */
export async function translateFields(fields: Record<string, string>): Promise<TranslateResult> {
  await assertAdmin();
  if (!translationEnabled()) return { ok: false, error: "disabled" };

  const entries = Object.entries(fields ?? {})
    .filter(([key, value]) => /^\w{1,40}$/.test(key) && typeof value === "string")
    .slice(0, MAX_FIELDS)
    .map(([key, value]) => [key, value.trim().slice(0, MAX_LENGTH)] as const)
    .filter(([, value]) => value);
  if (entries.length === 0) return { ok: true, values: {} };

  try {
    return { ok: true, values: await translateToEnglish(Object.fromEntries(entries)) };
  } catch (error) {
    console.error("translateFields failed:", error);
    return { ok: false, error: "failed" };
  }
}
