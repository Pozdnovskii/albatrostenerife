import { defineType } from "sanity";
import { translatedField } from "../lib/constants";

export const blogTexts = defineType({
  name: "blogTexts",
  title: "Blog",
  type: "document",
  fields: [
    translatedField("pageTitle",    "Page Title"),
    translatedField("pageSubtitle", "Page Subtitle"),
    translatedField("relatedPosts", "Related Posts Label"),
    translatedField("ctaReplyNote", "CTA Reply Note"),
  ],
  preview: {
    prepare: () => ({ title: "Blog" }),
  },
});
