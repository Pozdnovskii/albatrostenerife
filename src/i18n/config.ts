export const LOCALES = ["en", "cs", "pl", "hu", "it", "es"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";

export const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  cs: "Čeština",
  pl: "Polski",
  hu: "Magyar",
  it: "Italiano",
  es: "Español",
};


export const HREFLANG: Record<Locale, string> = {
  en: "en-US",
  cs: "cs-CZ",
  pl: "pl-PL",
  hu: "hu-HU",
  it: "it-IT",
  es: "es-ES",
};
