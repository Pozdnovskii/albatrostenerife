import type { Locale } from "../config";

export const services = {
  en: {
    "service.heroSubtitle": "Park Albatros Real Estate",
    "service.otherServices": "Other Services",
  },
  cs: {
    "service.heroSubtitle": "Park Albatros nemovitosti",
    "service.otherServices": "Další služby",
  },
  pl: {
    "service.heroSubtitle": "Park Albatros nieruchomości",
    "service.otherServices": "Inne usługi",
  },
  hu: {
    "service.heroSubtitle": "Park Albatros ingatlanok",
    "service.otherServices": "További szolgáltatások",
  },
  it: {
    "service.heroSubtitle": "Parco Albatros immobiliare",
    "service.otherServices": "Altri servizi",
  },
  es: {
    "service.heroSubtitle": "Parque Albatros inmobiliario",
    "service.otherServices": "Otros servicios",
  },
} satisfies Record<Locale, Record<string, string>>;
