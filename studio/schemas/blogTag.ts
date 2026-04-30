import { defineType } from "sanity";
import { translatedField, DEFAULT_LOCALE } from "../lib/constants";

export const blogTag = defineType({
  name: "blogTag",
  title: "Blog Tag",
  type: "document",

  fields: [
    translatedField("name", "Name"),
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
