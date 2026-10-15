"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Languages } from "lucide-react";
import { switchLocalePath, type Locale } from "@/i18n/config";

export function LanguageSwitcher({
  to,
  text,
  label,
  className = "",
}: {
  to: Locale;
  text: string;
  label: string;
  className?: string;
}) {
  const pathname = usePathname();
  return (
    <Link
      href={switchLocalePath(pathname, to)}
      hrefLang={to}
      lang={to}
      aria-label={label}
      title={label}
      className={`inline-flex h-10 items-center gap-1.5 rounded-full px-3 text-sm font-semibold text-foreground transition-colors hover:bg-accent ${className}`}
    >
      <Languages className="size-4" aria-hidden />
      {text}
    </Link>
  );
}
