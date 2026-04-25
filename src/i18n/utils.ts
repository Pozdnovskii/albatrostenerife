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
 * Locales without a slug fall back to the EN slug, or to the locale homepage if no EN slug.
 */
export function buildAlternateUrls(
  origin: string,
  slugs: Partial<Record<Locale, string>> = {}
): Record<Locale, string> {
  const defaultSlug = slugs[DEFAULT_LOCALE];
  return Object.fromEntries(
    LOCALES.map((l) => {
      const slug = slugs[l] ?? defaultSlug;
      const home = l === DEFAULT_LOCALE ? `${origin}/` : `${origin}${localePrefix(l)}`;
      return [l, slug ? `${origin}${localePrefix(l)}/${slug}` : home];
    })
  ) as Record<Locale, string>;
}

/**
 * Builds alternateUrls for nested routes like /blog/post-slug/ or /listings/property-slug/.
 * indexSlugs: per-locale slug for the index page (e.g. "blog", "clanek").
 * itemSlugs: per-locale slug for the item (e.g. the post or property slug).
 */
export function buildNestedAlternateUrls(
  origin: string,
  indexSlugs: Partial<Record<Locale, string>>,
  itemSlugs: Partial<Record<Locale, string>>
): Record<Locale, string> {
  const defaultIndex = indexSlugs[DEFAULT_LOCALE];
  const defaultItem = itemSlugs[DEFAULT_LOCALE];
  return Object.fromEntries(
    LOCALES.map((l) => {
      const indexSlug = indexSlugs[l] ?? defaultIndex;
      const itemSlug = itemSlugs[l] ?? defaultItem;
      return [l, `${origin}${localePrefix(l)}/${indexSlug}/${itemSlug}`];
    })
  ) as Record<Locale, string>;
}
