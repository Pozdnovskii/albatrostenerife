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
    searchWeight,
  }: {
    required?: "all" | "default" | false;
    type?: string;
    group?: string;
    rows?: number;
    /** Studio search boost applied to the default-locale sub-field only. */
    searchWeight?: number;
  } = {}
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
        // Boost only the default-locale sub-field in Studio search — editors
        // search by EN content; other-language translations stay at default
        // weight so they're still findable but don't dominate ranking.
        options:
          searchWeight && lang === DEFAULT_LOCALE
            ? { search: { weight: searchWeight } }
            : undefined,
        validation:
          required === "all" || (required === "default" && lang === DEFAULT_LOCALE)
            ? (r) => r.required()
            : undefined,
      })
    ),
  });
}
