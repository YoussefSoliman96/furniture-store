import { notFound, redirect } from "next/navigation";
import { localizeHref, type Locale } from "@/i18n/config";
import { getCurrentUser, type SessionUser } from "./session";

/**
 * For admin pages: signed-out visitors go to the login page; signed-in
 * non-admins get a 404 so the dashboard's existence isn't advertised.
 */
export async function requireAdminPage(locale: Locale): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) redirect(localizeHref(locale, "/login"));
  if (user.role !== "admin") notFound();
  return user;
}

/**
 * For Server Actions and admin data reads. Actions are public HTTP endpoints,
 * so every one must call this itself — never rely on the page being protected.
 */
export async function assertAdmin(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") throw new Error("Unauthorized");
  return user;
}
