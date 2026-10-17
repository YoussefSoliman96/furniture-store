import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, hasLocale, LOCALE_COOKIE, type Locale } from "@/i18n/config";
import { DEV_LOGIN_PATH, DEV_SIGNED_OUT_COOKIE, devAutoLoginEnabled } from "@/lib/auth/dev";

// Kept in sync with src/lib/auth/session.ts (not imported: that module pulls in the DB).
const SESSION_COOKIE = "aziz_session";

const ONE_YEAR = 60 * 60 * 24 * 365;

/** Pick a locale from the saved cookie, then Accept-Language, then the default. */
function detectLocale(request: NextRequest): Locale {
  const saved = request.cookies.get(LOCALE_COOKIE)?.value;
  if (saved && hasLocale(saved)) return saved;

  const accepted = (request.headers.get("accept-language") ?? "")
    .split(",")
    .map((part) => {
      const [tag, q] = part.trim().split(";q=");
      return { lang: tag.toLowerCase().split("-")[0], q: q ? Number(q) : 1 };
    })
    .sort((a, b) => b.q - a.q);

  const match = accepted.find((a) => hasLocale(a.lang))?.lang;
  return match && hasLocale(match) ? match : defaultLocale;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const first = pathname.split("/")[1] ?? "";

  if (hasLocale(first)) {
    // Dev only: sign in as the seeded admin instead of showing the login page.
    if (devAutoLoginEnabled() && !request.cookies.has(DEV_SIGNED_OUT_COOKIE)) {
      const toDashboard = pathname.startsWith(`/${first}/dashboard`) && !request.cookies.has(SESSION_COOKIE);
      if (toDashboard || pathname === `/${first}/login`) {
        const url = new URL(DEV_LOGIN_PATH, request.url);
        url.searchParams.set("next", toDashboard ? pathname + request.nextUrl.search : `/${first}/dashboard`);
        return NextResponse.redirect(url);
      }
    }

    // Optimistic gate only (no DB call): bounce visitors without a session cookie.
    // The dashboard layout and every admin action still verify the session and role.
    if (pathname.startsWith(`/${first}/dashboard`) && !request.cookies.has(SESSION_COOKIE)) {
      return NextResponse.redirect(new URL(`/${first}/login`, request.url));
    }

    // Remember the language the visitor is browsing in.
    const response = NextResponse.next();
    if (request.cookies.get(LOCALE_COOKIE)?.value !== first) {
      response.cookies.set(LOCALE_COOKIE, first, { path: "/", maxAge: ONE_YEAR, sameSite: "lax" });
    }
    return response;
  }

  const url = request.nextUrl.clone();
  url.pathname = `/${detectLocale(request)}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Skip Next internals, API routes and any file with an extension (images, icons, robots.txt…).
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
