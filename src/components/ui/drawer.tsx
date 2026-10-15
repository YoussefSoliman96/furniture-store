"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

/**
 * Off-canvas sidebar built on <dialog>: focus trapping, Esc to close and the
 * backdrop come from the browser. Slides in from the inline-start edge, so it
 * opens from the left in English and from the right in Arabic.
 */
export function Drawer({
  openLabel,
  closeLabel,
  header,
  children,
  triggerClassName = "",
}: {
  openLabel: string;
  closeLabel: string;
  header: ReactNode;
  children: ReactNode;
  triggerClassName?: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const pathname = usePathname();

  // Close after navigating from a link inside the drawer.
  useEffect(() => {
    ref.current?.close();
  }, [pathname]);

  return (
    <>
      <button
        type="button"
        onClick={() => ref.current?.showModal()}
        aria-label={openLabel}
        title={openLabel}
        className={`inline-flex size-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-accent ${triggerClassName}`}
      >
        <Menu className="size-5" aria-hidden />
      </button>
      <dialog
        ref={ref}
        aria-label={openLabel}
        onClick={(e) => e.target === e.currentTarget && e.currentTarget.close()}
        className="drawer bg-surface text-foreground shadow-2xl"
      >
        <div className="flex h-full flex-col">
          <div className="flex h-16 shrink-0 items-center justify-between gap-2 border-b border-border px-4">
            {header}
            <button
              type="button"
              onClick={() => ref.current?.close()}
              aria-label={closeLabel}
              title={closeLabel}
              className="inline-flex size-10 items-center justify-center rounded-full transition-colors hover:bg-accent"
            >
              <X className="size-5" aria-hidden />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">{children}</div>
        </div>
      </dialog>
    </>
  );
}
