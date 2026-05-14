import { defineType } from "sanity";
import { EnvelopeIcon } from "@sanity/icons";
import { translatedField } from "../lib/constants";

export const contactTexts = defineType({
  name: "contactTexts",
  title: "Contact Page",
  type: "document",
  icon: EnvelopeIcon,
  __experimental_omnisearch_visibility: false,
  fields: [
    translatedField("title",    "Title"),
    translatedField("subtitle", "Subtitle", { type: "text", rows: 3 }),
  ],
  preview: {
    prepare: () => ({ title: "Contact Page" }),
  },
});
