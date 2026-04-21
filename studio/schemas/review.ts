import { defineField, defineType } from "sanity";
import { translatedField, DEFAULT_LOCALE } from "../lib/constants";

export const review = defineType({
  name: "review",
  title: "Review",
  type: "document",
  fields: [
    translatedField("name", "Name"),
    defineField({
      name: "order",
      title: "Order",
      type: "number",
      description: "Position in carousel",
      validation: (r) => r.required().min(0),
    }),
    defineField({
      name: "photo",
      title: "Photo",
      type: "image",
      options: { hotspot: true },
      validation: (r) => r.required(),
    }),
    translatedField("location", "Location"),
    translatedField("text", "Review text", { type: "text" }),
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
      location: `location.${DEFAULT_LOCALE}`,
      order: "order",
    },
    prepare({ title, location, order }) {
      return {
        title: `${order ?? "–"}. ${title ?? "Untitled"}`,
        subtitle: location,
      };
    },
  },
});
