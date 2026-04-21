import type { Locale } from "../config";

export const footer = {
  en: { "footer.rights": "All Rights Reserved" },
  cs: { "footer.rights": "Všechna práva vyhrazena" },
  pl: { "footer.rights": "Wszelkie prawa zastrzeżone" },
  hu: { "footer.rights": "Minden jog fenntartva" },
  it: { "footer.rights": "Tutti i diritti riservati" },
  es: { "footer.rights": "Todos los derechos reservados" },
} satisfies Record<Locale, Record<string, string>>;
