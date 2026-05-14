import { defineField, defineType } from "sanity";
import { BookmarkIcon } from "@sanity/icons";
import { translatedField, DEFAULT_LOCALE } from "../lib/constants";

export const propertyLabel = defineType({
  name: "propertyLabel",
  title: "Property Label",
  type: "document",
  icon: BookmarkIcon,
  __experimental_omnisearch_visibility: false,
  fields: [
    translatedField("name", "Name"),
    defineField({
      name: "key",
      title: "Key",
      type: "slug",
      description: "Internal identifier, e.g. sold, reserved, rented",
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
