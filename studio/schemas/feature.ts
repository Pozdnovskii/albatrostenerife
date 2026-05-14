import { defineType } from "sanity";
import { StarIcon } from "@sanity/icons";
import { translatedField, DEFAULT_LOCALE } from "../lib/constants";

export const feature = defineType({
  name: "feature",
  title: "Feature",
  type: "document",
  icon: StarIcon,
  __experimental_omnisearch_visibility: false,
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
