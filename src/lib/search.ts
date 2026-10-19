// Forgiving text search for admin lists: Arabic spelling variants, accents and word order
// don't matter. Shared by the server (to build each row's search text) and the browser.

const ARABIC_DIGITS = "٠١٢٣٤٥٦٧٨٩";

/** Lowercase, strip accents/harakat, unify Arabic letter variants and digits, collapse spaces. */
export function normalizeSearch(text: string) {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "") // Latin accents
    .replace(/[ً-ٰٟـ]/g, "") // harakat, dagger alef, tatweel
    .replace(/[أإآٱ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/ؤ/g, "و")
    .replace(/ئ/g, "ي")
    .replace(/[٠-٩]/g, (d) => String(ARABIC_DIGITS.indexOf(d)))
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
}

/** The text a row is searched by: every given field, normalized and joined. */
export const searchText = (...fields: (string | null | undefined)[]) => normalizeSearch(fields.filter(Boolean).join(" "));

/** True when every word of the query appears somewhere in the (normalized) row text. */
export function matchesSearch(rowText: string, query: string) {
  const words = normalizeSearch(query).split(" ").filter(Boolean);
  return words.every((word) => rowText.includes(word));
}
