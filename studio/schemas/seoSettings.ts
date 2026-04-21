import { defineField, defineType } from "sanity";
import { LANGUAGES, LANGUAGE_TITLES, DEFAULT_LOCALE } from "../lib/constants";

export const seoSettings = defineType({
  name: "seoSettings",
  title: "SEO Settings",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Page Name",
      type: "string",
      description: "Internal label, e.g. 'Home', 'Contact'. Not shown on the website.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "isHomepage",
      title: "This is the homepage",
      type: "boolean",
      description: "Hides the slug fields — the homepage URL is always /.",
      initialValue: false,
    }),
    defineField({
      name: "translations",
      title: "Translations",
      type: "object",
      fields: LANGUAGES.map((lang) => {
        const isDefault = lang === DEFAULT_LOCALE;
        return defineField({
          name: lang,
          title: LANGUAGE_TITLES[lang],
          type: "object",
          fields: [
            defineField({
              name: "metaTitle",
              title: "Meta Title",
              type: "string",
              description: "Recommended: up to 60 characters.",
              validation: isDefault ? (r) => r.required() : undefined,
            }),
            defineField({
              name: "metaDescription",
              title: "Meta Description",
              type: "text",
              rows: 3,
              description: "Recommended: up to 160 characters.",
              validation: isDefault ? (r) => r.required() : undefined,
            }),
            defineField({
              name: "slug",
              title: "Slug",
              type: "slug",
              options: { source: `translations.${lang}.metaTitle` },
              hidden: ({ document }) => !!(document as any)?.isHomepage,
              validation: isDefault
                ? (r) =>
                    r.custom((val, ctx) => {
                      if ((ctx.document as any)?.isHomepage) return true;
                      return val?.current ? true : "Required";
                    })
                : undefined,
            }),
          ],
        });
      }),
    }),
    defineField({
      name: "ogImage",
      title: "OG Image",
      type: "image",
      description: "Shared across all languages. Recommended: 1200×630px.",
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: `translations.${DEFAULT_LOCALE}.metaTitle`,
      media: "ogImage",
    },
  },
});
