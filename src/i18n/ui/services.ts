import type { Locale } from "../config";

export const services = {
  en: {
    "service.heroSubtitle": "Park Albatros Real Estate",
  },
  cs: {
    "service.heroSubtitle": "Park Albatros nemovitosti",
  },
  pl: {
    "service.heroSubtitle": "Park Albatros nieruchomości",
  },
  hu: {
    "service.heroSubtitle": "Park Albatros ingatlanok",
  },
  it: {
    "service.heroSubtitle": "Parco Albatros immobiliare",
  },
  es: {
    "service.heroSubtitle": "Parque Albatros inmobiliario",
  },
} satisfies Record<Locale, Record<string, string>>;
