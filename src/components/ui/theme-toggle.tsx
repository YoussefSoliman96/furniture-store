"use client";

import { useLayoutEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { THEME_COOKIE } from "./theme-script";

const ONE_YEAR = 60 * 60 * 24 * 365;

function currentTheme() {
  const saved = document.cookie.match(new RegExp(`(?:^|; )${THEME_COOKIE}=(light|dark)`))?.[1];
  if (saved) return saved;
  return matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function ThemeToggle({ label, className = "" }: { label: string; className?: string }) {
  // React's dev-mode remount resets <html> attributes; re-apply. No-op in production.
  useLayoutEffect(() => {
    document.documentElement.setAttribute("data-theme", currentTheme());
  }, []);

  function toggle() {
    const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    document.cookie = `${THEME_COOKIE}=${next}; path=/; max-age=${ONE_YEAR}; SameSite=Lax`;
  }

  // Both icons render; CSS shows the right one, so server and client markup match.
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className={`inline-flex size-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-accent ${className}`}
    >
      <Moon className="size-5 dark:hidden" aria-hidden />
      <Sun className="hidden size-5 dark:block" aria-hidden />
    </button>
  );
}
