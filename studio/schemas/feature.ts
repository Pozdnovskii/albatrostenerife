import { defineType } from "sanity";
import { translatedField, DEFAULT_LOCALE } from "../lib/constants";

export const feature = defineType({
  name: "feature",
  title: "Feature",
  type: "document",
  fields: [
    translatedField("name", "Name"),
  ],
  orderings: [
    { title: "Name A–Z", name: "nameAsc", by: [{ field: `name.${DEFAULT_LOCALE}`, direction: "asc" }] },
  ],
  preview: {
    select: { title: `name.${DEFAULT_LOCALE}` },
  },
});
