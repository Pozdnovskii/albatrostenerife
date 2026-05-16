import type { Locale } from "./config";
import { footer } from "./ui/footer";
import { form } from "./ui/form";
import { services } from "./ui/services";
import { share } from "./ui/share";

type AllKeys =
  | keyof (typeof footer)["en"]
  | keyof (typeof form)["en"]
  | keyof (typeof services)["en"]
  | keyof (typeof share)["en"];

const ui = Object.fromEntries(
  (["en", "cs", "pl", "hu", "it", "es"] as Locale[]).map((lang) => [
    lang,
    { ...footer[lang], ...form[lang], ...services[lang], ...share[lang] },
  ])
) as Record<Locale, Record<AllKeys, string>>;

export function t(lang: Locale, key: AllKeys): string {
  return ui[lang][key] ?? ui["en"][key];
}
