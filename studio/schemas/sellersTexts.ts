import { defineType } from "sanity";
import { translatedField } from "../lib/constants";

export const sellersTexts = defineType({
  name: "sellersTexts",
  title: "Sellers Page",
  type: "document",
  fields: [
    translatedField("title",    "Title"),
    translatedField("subtitle", "Subtitle", { type: "text", rows: 4 }),
  ],
  preview: {
    prepare: () => ({ title: "Sellers Page" }),
  },
});
