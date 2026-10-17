// URL slugs: lowercase Latin letters, digits and dashes.

// Rough Egyptian-Arabic → Latin spelling, only used when there's no English name to build a slug from.
const ARABIC: Record<string, string> = {
  ا: "a", أ: "a", إ: "e", آ: "a", ء: "", ؤ: "o", ئ: "e", ى: "a", ة: "a",
  ب: "b", ت: "t", ث: "th", ج: "g", ح: "h", خ: "kh", د: "d", ذ: "z", ر: "r", ز: "z",
  س: "s", ش: "sh", ص: "s", ض: "d", ط: "t", ظ: "z", ع: "a", غ: "gh", ف: "f", ق: "k",
  ك: "k", ل: "l", م: "m", ن: "n", ه: "h", و: "w", ي: "y",
  "٠": "0", "١": "1", "٢": "2", "٣": "3", "٤": "4", "٥": "5", "٦": "6", "٧": "7", "٨": "8", "٩": "9",
};

const transliterate = (value: string) =>
  value
    .replace(/[ً-ْـ]/g, "") // harakat and tatweel
    .replace(/[؀-ۿ]/g, (ch) => ARABIC[ch] ?? "");

export const slugify = (value: string, maxLength = 80) =>
  transliterate(value)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, maxLength)
    .replace(/-+$/g, "");
