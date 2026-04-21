import { defineField, defineType } from "sanity";
import { translatedField, DEFAULT_LOCALE } from "../lib/constants";

export const propertyType = defineType({
  name: "propertyType",
  title: "Property Type",
  type: "document",
  fields: [
    translatedField("name", "Name"),
    defineField({
      name: "key",
      title: "Key",
      type: "slug",
      description: "Internal identifier, e.g. apartment, villa, studio",
      options: { source: `name.${DEFAULT_LOCALE}` },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "order",
      title: "Sort order",
      type: "number",
      validation: (r) => r.required().min(0),
    }),
  ],
  orderings: [
    { title: "Sort order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] },
  ],
  preview: {
    select: { title: `name.${DEFAULT_LOCALE}`, order: "order" },
    prepare: ({ title, order }) => ({
      title: `${order ?? "–"}. ${title ?? "Untitled"}`,
    }),
  },
});
