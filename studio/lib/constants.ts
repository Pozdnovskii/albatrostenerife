import { defineField } from "sanity";
import { LOCALES, LOCALE_LABELS, DEFAULT_LOCALE } from "@i18n/config";

export { LOCALES as LANGUAGES, LOCALE_LABELS as LANGUAGE_TITLES, DEFAULT_LOCALE };

/**
 * Translated field object: one field per language.
 * required:
 *   "default" (default) — only the default locale is required
 *   "all"               — all languages required
 *   false               — none required
 * type: "string" (default) or "text" (textarea)
 */
export function translatedField(
  name: string,
  title: string,
  {
    required = "default" as "all" | "default" | false,
    type = "string",
    group,
    rows,
  }: { required?: "all" | "default" | false; type?: string; group?: string; rows?: number } = {}
) {
  return defineField({
    name,
    title,
    type: "object",
    group,
    fields: LOCALES.map((lang) =>
      defineField({
        name: lang,
        title: LOCALE_LABELS[lang],
        type,
        rows,
        validation:
          required === "all" || (required === "default" && lang === DEFAULT_LOCALE)
            ? (r) => r.required()
            : undefined,
      })
    ),
  });
}
