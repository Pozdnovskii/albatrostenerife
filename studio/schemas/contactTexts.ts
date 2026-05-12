import { defineType } from "sanity";
import { translatedField } from "../lib/constants";

export const contactTexts = defineType({
  name: "contactTexts",
  title: "Contact Page",
  type: "document",
  fields: [
    translatedField("title",    "Title"),
    translatedField("subtitle", "Subtitle", { type: "text", rows: 3 }),
  ],
  preview: {
    prepare: () => ({ title: "Contact Page" }),
  },
});
