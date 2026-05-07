import type { Locale } from "./config";
import { footer } from "./ui/footer";
import { form } from "./ui/form";
import { services } from "./ui/services";

type AllKeys =
  | keyof (typeof footer)["en"]
  | keyof (typeof form)["en"]
  | keyof (typeof services)["en"];

const ui = Object.fromEntries(
  (["en", "cs", "pl", "hu", "it", "es"] as Locale[]).map((lang) => [
    lang,
    { ...footer[lang], ...form[lang], ...services[lang] },
  ])
) as Record<Locale, Record<AllKeys, string>>;

export function t(lang: Locale, key: AllKeys): string {
  return ui[lang][key] ?? ui["en"][key];
}
