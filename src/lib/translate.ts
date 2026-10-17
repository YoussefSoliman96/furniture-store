import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
import { z } from "zod";

// Arabic → English for catalog text the admin writes (names, descriptions).
// Runs only on the server; the API key never reaches the browser.

/** Translation is available when an Anthropic API key is configured. */
export const translationEnabled = () => Boolean(process.env.ANTHROPIC_API_KEY);

let client: Anthropic | undefined;
const getClient = () => (client ??= new Anthropic());

const SYSTEM = `You translate catalog text for Aziz Furniture (عزيز فيرنيتشر), an Egyptian furniture showroom, from Arabic (often Egyptian dialect) into natural English for the store's English website.

- Names are short labels: translate to the term an English-speaking furniture shopper would use, in Title Case (e.g. "انتريهات" → "Living Rooms", "غرف نوم أطفال" → "Kids' Bedrooms", "نيش" → "Display Cabinet").
- Keep Egyptian place names in English spelling (e.g. "أسوان" → "Aswan", "مصر الجديدة" → "Heliopolis").
- Descriptions: fluent, concise marketing English with the same meaning; no additions, no emojis.
- Never translate or alter numbers, measurements or product codes.
- If a field is empty, return an empty string for it.`;

/**
 * Translates each field's Arabic text to English. Keys are returned unchanged.
 * Throws on API errors; callers decide how to surface them.
 */
export async function translateToEnglish<K extends string>(fields: Record<K, string>): Promise<Record<K, string>> {
  const keys = Object.keys(fields) as K[];
  const schema = z.object(Object.fromEntries(keys.map((k) => [k, z.string()])) as Record<K, z.ZodString>);

  const response = await getClient().beta.messages.parse({
    model: "claude-opus-5-5",
    max_tokens: 4000,
    // Short, well-specified task: low effort keeps it fast and cheap.
    output_config: { effort: "low", format: betaZodOutputFormat(schema) },
    // If the model declines for policy reasons, retry server-side on the recommended fallback.
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    system: SYSTEM,
    messages: [
      {
        role: "user",
        content: `Translate each value to English. Return JSON with the same keys.\n\n${JSON.stringify(fields, null, 2)}`,
      },
    ],
  });

  if (response.stop_reason === "refusal" || !response.parsed_output) {
    throw new Error(`Translation unavailable (stop_reason: ${response.stop_reason})`);
  }
  return response.parsed_output as Record<K, string>;
}
