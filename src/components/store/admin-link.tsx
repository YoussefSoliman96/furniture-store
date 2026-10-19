import Link from "next/link";
import { LayoutDashboard } from "lucide-react";
import { localizeHref, type Locale } from "@/i18n/config";
import { getCurrentUser } from "@/lib/auth/session";

/**
 * Link to the dashboard, shown only to signed-in admins. It reads the session, so render it
 * inside <Suspense>: the rest of the header stays in the cached static shell.
 */
export async function AdminLink({
  locale,
  label,
  variant,
}: {
  locale: Locale;
  label: string;
  variant: "header" | "menu";
}) {
  const user = await getCurrentUser();
  if (user?.role !== "admin") return null;
  const href = localizeHref(locale, "/dashboard");

  if (variant === "menu") {
    return (
      <Link
        href={href}
        className="flex items-center gap-3 rounded-lg bg-primary px-3 py-2.5 font-semibold text-primary-foreground hover:bg-primary-hover"
      >
        <LayoutDashboard className="size-4.5 shrink-0" aria-hidden />
        {label}
      </Link>
    );
  }
  return (
    <Link
      href={href}
      aria-label={label}
      title={label}
      className="inline-flex size-10 items-center justify-center gap-2 rounded-full text-primary transition-colors hover:bg-accent lg:w-auto lg:bg-primary lg:px-4 lg:text-sm lg:font-semibold lg:text-primary-foreground lg:hover:bg-primary-hover"
    >
      <LayoutDashboard className="size-5 shrink-0 lg:size-4" aria-hidden />
      <span className="max-lg:sr-only">{label}</span>
    </Link>
  );
}
