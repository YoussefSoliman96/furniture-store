"use client";

import { useActionState } from "react";
import { login, type LoginState } from "@/lib/auth/actions";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";

export function LoginForm({ locale, t }: { locale: Locale; t: Dictionary["auth"] }) {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, undefined);
  const input =
    "mt-1.5 block w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-foreground outline-none transition-colors focus:border-primary";

  return (
    <form action={action} className="space-y-4" noValidate>
      <input type="hidden" name="locale" value={locale} />
      <label className="block text-sm font-semibold">
        {t.email}
        <input
          name="email"
          type="email"
          dir="ltr"
          autoComplete="username"
          required
          defaultValue={state?.email}
          className={input}
        />
      </label>
      <label className="block text-sm font-semibold">
        {t.password}
        <input name="password" type="password" dir="ltr" autoComplete="current-password" required className={input} />
      </label>
      {state?.error && (
        <p role="alert" className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-700 dark:text-red-300">
          {t.errors[state.error]}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-primary px-4 py-2.5 font-semibold text-primary-foreground transition-colors hover:bg-primary-hover disabled:opacity-60"
      >
        {pending ? t.submitting : t.submit}
      </button>
    </form>
  );
}
