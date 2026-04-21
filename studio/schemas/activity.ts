import { defineField, defineType } from "sanity";
import { translatedField, DEFAULT_LOCALE } from "../lib/constants";

export const activity = defineType({
  name: "activity",
  title: "Activity",
  type: "document",
  fields: [
    translatedField("name", "Name"),
    defineField({
      name: "order",
      title: "Order",
      type: "number",
      validation: (r) => r.required(),
    }),
    translatedField("buttonText", "Button Text"),
    defineField({
      name: "url",
      title: "URL",
      type: "url",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      fields: [translatedField("alt", "Alt text", { required: false })],
      validation: (r) => r.required(),
    }),
  ],
  orderings: [
    {
      title: "Order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      title: `name.${DEFAULT_LOCALE}`,
      order: "order",
    },
    prepare: ({ title, order }) => ({
      title: `${order ?? "–"}. ${title ?? "Untitled"}`,
    }),
  },
});
