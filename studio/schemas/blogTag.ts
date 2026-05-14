import { defineField, defineType } from "sanity";
import { TagIcon } from "@sanity/icons";
import { translatedField, DEFAULT_LOCALE, LANGUAGES, LANGUAGE_TITLES } from "../lib/constants";
import type { Locale } from "@i18n/config";
import { ConnectedPostsInput } from "../components/ConnectedPostsInput";

export const blogTag = defineType({
  name: "blogTag",
  title: "Blog Tag",
  type: "document",
  icon: TagIcon,
  __experimental_omnisearch_visibility: false,

  groups: [
    { name: "seo", title: "SEO" },
  ],

  fields: [
    defineField({
      name: "connectedPosts",
      title: "Connected Posts",
      type: "string",
      readOnly: true,
      components: { input: ConnectedPostsInput },
    }),
    translatedField("name", "Name"),
    defineField({
      name: "slug",
      title: "Slugs",
      type: "object",
      group: "seo",
      fields: LANGUAGES.map((lang) =>
        defineField({
          name: lang,
          title: LANGUAGE_TITLES[lang as Locale],
          type: "slug",
          options: { source: `name.${lang}` },
          validation: lang === DEFAULT_LOCALE ? (r) => r.required() : undefined,
        }),
      ),
    }),
    translatedField("metaTitle", "Meta Title", { required: false, group: "seo" }),
    translatedField("metaDescription", "Meta Description", { required: false, type: "text", rows: 2, group: "seo" }),
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
