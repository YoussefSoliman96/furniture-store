"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { users } from "@/db/schema";
import { defaultLocale, hasLocale, localizeHref } from "@/i18n/config";
import { getDummyHash, verifyPassword } from "./password";
import { createSession, destroySession } from "./session";

export type LoginState = { error?: "missing" | "invalid" | "notAdmin" | "locked"; email?: string } | undefined;

// Basic brute-force brake: 5 failures per email locks it for 15 minutes.
// In-memory, so per server instance; move to the DB/Redis when scaling out.
const MAX_FAILURES = 5;
const LOCK_MS = 15 * 60 * 1000;
const failures = new Map<string, { count: number; until: number }>();

const localeFrom = (formData: FormData) => {
  const value = String(formData.get("locale") ?? "");
  return hasLocale(value) ? value : defaultLocale;
};

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const locale = localeFrom(formData);
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { error: "missing", email };

  const record = failures.get(email);
  if (record && record.count >= MAX_FAILURES && record.until > Date.now()) return { error: "locked", email };

  const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  // Always run a hash comparison so unknown emails aren't detectable by timing.
  const valid = await verifyPassword(password, user?.passwordHash ?? (await getDummyHash()));

  if (!user || !valid) {
    const count = (record && record.until > Date.now() ? record.count : 0) + 1;
    failures.set(email, { count, until: Date.now() + LOCK_MS });
    return { error: "invalid", email };
  }
  failures.delete(email);

  if (user.role !== "admin") return { error: "notAdmin", email };

  await createSession(user.id);
  redirect(localizeHref(locale, "/dashboard"));
}

export async function logout(formData: FormData) {
  await destroySession();
  redirect(localizeHref(localeFrom(formData), "/login"));
}
