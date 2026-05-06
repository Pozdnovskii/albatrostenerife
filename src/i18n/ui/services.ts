import type { Locale } from "../config";

export const services = {
  en: {
    "service.heroSubtitle": "Park Albatros Real Estate",
    "service.otherServices": "Our Other Services",
  },
  cs: {
    "service.heroSubtitle": "Park Albatros nemovitosti",
    "service.otherServices": "Naše další služby",
  },
  pl: {
    "service.heroSubtitle": "Park Albatros nieruchomości",
    "service.otherServices": "Nasze inne usługi",
  },
  hu: {
    "service.heroSubtitle": "Park Albatros ingatlanok",
    "service.otherServices": "Egyéb szolgáltatásaink",
  },
  it: {
    "service.heroSubtitle": "Parco Albatros immobiliare",
    "service.otherServices": "I nostri altri servizi",
  },
  es: {
    "service.heroSubtitle": "Parque Albatros inmobiliario",
    "service.otherServices": "Nuestros otros servicios",
  },
} satisfies Record<Locale, Record<string, string>>;
