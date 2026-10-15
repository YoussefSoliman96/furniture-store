"use client";

import { Suspense, type ComponentProps } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type LinkProps = ComponentProps<typeof Link> & { href: string };
type ActiveOptions = { exact?: boolean; activeClassName?: string };

/**
 * Link that marks itself as the current page. `exact` for index routes like "/en".
 * The pathname is unknown while prerendering the shell of not-yet-built dynamic
 * routes, so the active state resolves behind Suspense; the fallback is the same
 * link without it, keeping the markup crawlable and the layout static.
 */
export function NavLink({ exact, activeClassName, ...props }: LinkProps & ActiveOptions) {
  return (
    <Suspense fallback={<Link {...props} />}>
      <ActiveLink {...props} exact={exact} activeClassName={activeClassName} />
    </Suspense>
  );
}

function ActiveLink({ exact = false, activeClassName = "", className = "", ...props }: LinkProps & ActiveOptions) {
  const pathname = usePathname();
  const active = exact ? pathname === props.href : pathname === props.href || pathname.startsWith(`${props.href}/`);
  return (
    <Link
      {...props}
      aria-current={active ? "page" : undefined}
      className={`${className} ${active ? activeClassName : ""}`}
    />
  );
}
