import { defineArrayMember, defineField, defineType } from "sanity";
import { translatedField, LANGUAGES, LANGUAGE_TITLES } from "../lib/constants";
import type { Locale } from "@i18n/config";

export const legalPage = defineType({
  name: "legalPage",
  title: "Legal Page",
  type: "document",
  fields: [
    translatedField("heading", "Heading (H1)", { required: "default" }),

    defineField({
      name: "body",
      title: "Body",
      type: "object",
      fields: LANGUAGES.map((lang) =>
        defineField({
          name: lang,
          title: LANGUAGE_TITLES[lang as Locale],
          type: "array",
          of: [
            defineArrayMember({
              type: "block",
              styles: [
                { title: "Normal", value: "normal" },
                { title: "H2", value: "h2" },
                { title: "H3", value: "h3" },
              ],
              marks: {
                decorators: [
                  { title: "Strong", value: "strong" },
                  { title: "Emphasis", value: "em" },
                ],
                annotations: [
                  defineField({
                    name: "link",
                    type: "object",
                    title: "Link",
                    fields: [
                      defineField({
                        name: "href",
                        type: "url",
                        title: "URL",
                        validation: (r) =>
                          r.uri({ scheme: ["http", "https", "mailto", "tel"] }),
                      }),
                      defineField({
                        name: "blank",
                        type: "boolean",
                        title: "Open in new tab",
                        initialValue: false,
                      }),
                    ],
                  }),
                ],
              },
            }),
          ],
        }),
      ),
    }),

    defineField({
      name: "key",
      title: "Key",
      type: "string",
      description:
        "Unique identifier used in the frontend, e.g. 'privacy-policy'",
      validation: (r) => r.required(),
    }),
  ],
});
