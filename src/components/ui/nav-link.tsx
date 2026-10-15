"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps } from "react";

/** Link that marks itself as the current page. `exact` for index routes like "/en". */
export function NavLink({
  href,
  exact = false,
  className = "",
  activeClassName = "",
  ...props
}: ComponentProps<typeof Link> & { href: string; exact?: boolean; activeClassName?: string }) {
  const pathname = usePathname();
  const active = exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`${className} ${active ? activeClassName : ""}`}
      {...props}
    />
  );
}
