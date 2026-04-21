import { defineArrayMember, defineField, defineType } from "sanity";
import { translatedField, DEFAULT_LOCALE } from "../lib/constants";

export const navigation = defineType({
  name: "navigation",
  title: "Navigation",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "List Name",
      type: "string",
      description: "Internal label, e.g. 'Header Nav', 'Footer Links'.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "items",
      title: "Nav Items",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "page",
              title: "Page",
              type: "reference",
              to: [{ type: "seoSettings" }],
              validation: (r) => r.required(),
            }),
            translatedField("labels", "Labels"),
          ],
          preview: {
            select: { title: `labels.${DEFAULT_LOCALE}` },
          },
        }),
      ],
    }),
    defineField({
      name: "navId",
      title: "ID",
      type: "slug",
      description:
        "Stable identifier used by the frontend. Set once and never change. E.g. 'header', 'footer'.",
      validation: (r) => r.required(),
    }),
  ],
  preview: {
    select: { title: "title" },
  },
});
