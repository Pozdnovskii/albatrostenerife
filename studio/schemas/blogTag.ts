import { defineField, defineType } from "sanity";
import { translatedField, LANGUAGES, LANGUAGE_TITLES, DEFAULT_LOCALE } from "../lib/constants";
import type { Locale } from "@i18n/config";

export const blogTag = defineType({
  name: "blogTag",
  title: "Blog Tag",
  type: "document",

  fields: [
    translatedField("name", "Name"),

    defineField({
      name: "slug",
      title: "Slugs",
      type: "object",
      fields: LANGUAGES.map((lang) =>
        defineField({
          name: lang,
          title: LANGUAGE_TITLES[lang as Locale],
          type: "slug",
          options: { source: `name.${lang}` },
          validation: lang === DEFAULT_LOCALE ? (r) => r.required() : undefined,
        }),
      ),
    }),
  ],

  orderings: [
    {
      title: "Name",
      name: "nameAsc",
      by: [{ field: `name.${DEFAULT_LOCALE}`, direction: "asc" }],
    },
  ],

  preview: {
    select: { title: `name.${DEFAULT_LOCALE}` },
    prepare: ({ title }) => ({ title: title ?? "Untitled" }),
  },
});
