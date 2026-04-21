import type { Locale } from "./config";
import { footer } from "./ui/footer";
import { home } from "./ui/home";
import { form } from "./ui/form";
import { services } from "./ui/services";
import { listings } from "./ui/listings";
import { blog } from "./ui/blog";

type AllKeys =
  | keyof (typeof footer)["en"]
  | keyof (typeof home)["en"]
  | keyof (typeof form)["en"]
  | keyof (typeof services)["en"]
  | keyof (typeof listings)["en"]
  | keyof (typeof blog)["en"];

const ui = Object.fromEntries(
  (["en", "cs", "pl", "hu", "it", "es"] as Locale[]).map((lang) => [
    lang,
    { ...footer[lang], ...home[lang], ...form[lang], ...services[lang], ...listings[lang], ...blog[lang] },
  ])
) as Record<Locale, Record<AllKeys, string>>;

export function t(lang: Locale, key: AllKeys): string {
  return ui[lang][key] ?? ui["en"][key];
}
