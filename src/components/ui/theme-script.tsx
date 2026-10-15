export const THEME_COOKIE = "theme";

/**
 * Runs during HTML parsing, before first paint: applies the saved theme cookie,
 * falling back to the OS preference. Keeps pages statically prerendered (no
 * cookies() read on the server) without a light/dark flash.
 */
const script = `(function(){try{var m=document.cookie.match(/(?:^|; )${THEME_COOKIE}=(light|dark)/);var t=m?m[1]:(matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
