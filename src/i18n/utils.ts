import { LOCALES, DEFAULT_LOCALE } from "./config";
import type { Locale } from "./config";

/** Returns the URL prefix for a locale. EN has no prefix. */
export function localePrefix(lang: Locale): string {
  return lang === DEFAULT_LOCALE ? "" : `/${lang}`;
}

/** Detects locale from a URL pathname. Falls back to DEFAULT_LOCALE. */
export function getLangFromUrl(url: URL): Locale {
  const segment = url.pathname.split("/")[1] as Locale;
  return LOCALES.includes(segment) ? segment : DEFAULT_LOCALE;
}

/**
 * Builds alternateUrls for hreflang + language switcher.
 * slugs: per-locale path segment from Sanity (e.g. "buyers", "kupujici").
 * Locales without a slug fall back to the locale homepage (${prefix}/).
 */
export function buildAlternateUrls(
  origin: string,
  slugs: Partial<Record<Locale, string>> = {}
): Record<Locale, string> {
  return Object.fromEntries(
    LOCALES.map((l) => {
      const slug = slugs[l];
      return [l, slug ? `${origin}${localePrefix(l)}/${slug}` : `${origin}${localePrefix(l)}/`];
    })
  ) as Record<Locale, string>;
}
