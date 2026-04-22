import { defineType, defineField } from "sanity";
import { translatedField } from "../lib/constants";
import { DEFAULT_LOCALE } from "../lib/constants";

export const blogCta = defineType({
  name: "blogCta",
  title: "CTA Button",
  type: "document",

  fields: [
    translatedField("label", "Button Label"),
    defineField({
      name: "page",
      title: "Target Page",
      description: "The page this button links to (URL resolves automatically per language)",
      type: "reference",
      to: [
        { type: "seoSettings" },
        { type: "service" },
      ],
      options: { disableNew: true },
    }),
  ],

  preview: {
    select: {
      title: `label.${DEFAULT_LOCALE}`,
      subtitle: "page._type",
    },
    prepare: ({ title, subtitle }) => ({
      title: title ?? "CTA Button",
      subtitle: subtitle ?? "No page selected",
    }),
  },
});
