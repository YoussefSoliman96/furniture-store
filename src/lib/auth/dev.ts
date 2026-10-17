// Development-only convenience: sign in as the seeded admin automatically.
// Imported by the proxy, so this module must stay free of DB imports.

/** On only under `next dev` with DEV_AUTO_LOGIN=true; never in a production build. */
export const devAutoLoginEnabled = () =>
  process.env.NODE_ENV === "development" && process.env.DEV_AUTO_LOGIN === "true";

/** Set by "Sign out" so auto sign-in pauses until the next manual sign-in. */
export const DEV_SIGNED_OUT_COOKIE = "aziz_dev_signed_out";

export const DEV_LOGIN_PATH = "/api/dev-login";
