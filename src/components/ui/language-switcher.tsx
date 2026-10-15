"use client";

import { Suspense } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Languages } from "lucide-react";
import { switchLocalePath, type Locale } from "@/i18n/config";

type Props = { to: Locale; text: string; label: string; className?: string };

/** Links to the current page in the other language (falls back to its home page
 *  while the pathname is unknown, e.g. in a prerendered shell). */
export function LanguageSwitcher(props: Props) {
  return (
    <Suspense fallback={<SwitchLink {...props} href={`/${props.to}`} />}>
      <CurrentPageSwitch {...props} />
    </Suspense>
  );
}

function CurrentPageSwitch(props: Props) {
  const pathname = usePathname();
  return <SwitchLink {...props} href={switchLocalePath(pathname, props.to)} />;
}

function SwitchLink({ to, text, label, className = "", href }: Props & { href: string }) {
  return (
    <Link
      href={href}
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
