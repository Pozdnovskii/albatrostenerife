import { defineType } from "sanity";
import { translatedField } from "../lib/constants";

export const notFoundTexts = defineType({
  name: "notFoundTexts",
  title: "404 Not Found",
  type: "document",
  fields: [
    translatedField("title",    "Title"),
    translatedField("subtitle", "Subtitle"),
    translatedField("back",     "Back Button"),
  ],
  preview: {
    prepare: () => ({ title: "404 Not Found" }),
  },
});
