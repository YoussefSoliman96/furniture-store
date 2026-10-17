import { eq } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import type { NextRequest } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { defaultLocale } from "@/i18n/config";
import { devAutoLoginEnabled } from "@/lib/auth/dev";
import { createSession } from "@/lib/auth/session";

// Only dashboard pages are valid targets, so this can't be used as an open redirect.
const NEXT_RE = /^\/(ar|en)\/dashboard(\/[\w\-/]*)?(\?[\w\-=&%]*)?$/;

/** Signs in as ADMIN_EMAIL and continues to `next`. 404 unless dev auto sign-in is on. */
export async function GET(request: NextRequest) {
  if (!devAutoLoginEnabled()) notFound();

  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const [admin] = email
    ? await db.select({ id: users.id, role: users.role }).from(users).where(eq(users.email, email)).limit(1)
    : [];
  if (!admin || admin.role !== "admin") {
    return new Response("DEV_AUTO_LOGIN: ADMIN_EMAIL is not an admin in this database. Run npm run db:seed.", {
      status: 500,
    });
  }

  await createSession(admin.id);
  const next = request.nextUrl.searchParams.get("next") ?? "";
  redirect(NEXT_RE.test(next) ? next : `/${defaultLocale}/dashboard`);
}
