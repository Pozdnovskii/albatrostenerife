import { defineArrayMember, defineField, defineType } from "sanity";
import {
  translatedField,
  LANGUAGES,
  LANGUAGE_TITLES,
  DEFAULT_LOCALE,
} from "../lib/constants";
import type { Locale } from "@i18n/config";

export const blogPost = defineType({
  name: "blogPost",
  title: "Blog Post",
  type: "document",

  groups: [
    { name: "preview", title: "Preview" },
    { name: "seo", title: "SEO" },
    { name: "meta", title: "Meta" },
    { name: "content", title: "Content" },
  ],

  fields: [
    // ── Preview ───────────────────────────────────────────────────────────────
    translatedField("title", "Title", { group: "preview" }),

    translatedField("description", "Description", {
      required: false,
      type: "text",
      rows: 3,
      group: "preview",
    }),

    defineField({
      name: "mainImage",
      title: "Main Image",
      type: "image",
      group: "preview",
      options: { hotspot: true },
      fields: [translatedField("alt", "Alt text", { required: false })],
      validation: (r) => r.required(),
    }),

    // ── SEO ──────────────────────────────────────────────────────────────────
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
          options: { source: `title.${lang}` },
          validation: lang === DEFAULT_LOCALE ? (r) => r.required() : undefined,
        }),
      ),
    }),
    translatedField("metaTitle", "Meta Title", {
      required: false,
      group: "seo",
    }),
    translatedField("metaDescription", "Meta Description", {
      required: false,
      type: "text",
      rows: 3,
      group: "seo",
    }),

    // ── Meta ──────────────────────────────────────────────────────────────────
    defineField({
      name: "publishedAt",
      title: "Published at",
      type: "datetime",
      group: "meta",
      initialValue: () => new Date().toISOString(),
      validation: (r) => r.required(),
    }),
    defineField({
      name: "categories",
      title: "Categories",
      type: "array",
      group: "meta",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "blogCategory" }],
        }),
      ],
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      group: "meta",
      of: [defineArrayMember({ type: "reference", to: [{ type: "blogTag" }] })],
    }),

    // ── Content ───────────────────────────────────────────────────────────────
    defineField({
      name: "body",
      title: "Body",
      type: "object",
      group: "content",
      fields: LANGUAGES.map((lang) =>
        defineField({
          name: lang,
          title: LANGUAGE_TITLES[lang as Locale],
          type: "array",
          of: [
            defineArrayMember({
              type: "block",
              styles: [
                { title: "Normal", value: "normal" },
                { title: "H2", value: "h2" },
                { title: "H3", value: "h3" },
                { title: "H4", value: "h4" },
                { title: "Quote", value: "blockquote" },
              ],
              lists: [
                { title: "Bullet", value: "bullet" },
                { title: "Numbered", value: "number" },
              ],
              marks: {
                decorators: [
                  { title: "Bold", value: "strong" },
                  { title: "Italic", value: "em" },
                  { title: "Underline", value: "underline" },
                  { title: "Strike", value: "strike-through" },
                ],
                annotations: [
                  defineField({
                    name: "link",
                    type: "object",
                    title: "Link",
                    fields: [
                      defineField({
                        name: "internalLink",
                        type: "reference",
                        title: "Internal page",
                        to: [
                          { type: "blogPost" },
                          { type: "service" },
                          { type: "seoSettings" },
                        ],
                        options: { disableNew: true },
                      }),
                      defineField({
                        name: "href",
                        type: "url",
                        title: "External URL",
                        description: "Use only if linking outside the site",
                        validation: (r) =>
                          r.uri({ scheme: ["http", "https", "mailto", "tel"] }),
                      }),
                      defineField({
                        name: "blank",
                        type: "boolean",
                        title: "Open in new tab",
                        initialValue: false,
                      }),
                    ],
                  }),
                ],
              },
            }),
            defineArrayMember({
              type: "image",
              options: { hotspot: true },
              fields: [
                defineField({
                  name: "alt",
                  title: "Alt text",
                  type: "string",
                }),
                defineField({
                  name: "caption",
                  title: "Caption",
                  type: "string",
                }),
              ],
            }),
          ],
        }),
      ),
    }),

    // ── FAQ ───────────────────────────────────────────────────────────────────
    defineField({
      name: "faq",
      title: "FAQ",
      type: "array",
      group: "content",
      of: [
        defineArrayMember({
          type: "object",
          name: "faqItem",
          title: "FAQ Item",
          fields: [
            translatedField("question", "Question"),
            translatedField("answer", "Answer", { type: "text", rows: 3 }),
          ],
          preview: {
            select: { title: `question.${DEFAULT_LOCALE}` },
            prepare: ({ title }) => ({ title: title ?? "Question" }),
          },
        }),
      ],
    }),
  ],

  orderings: [
    {
      title: "Newest first",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
    {
      title: "Oldest first",
      name: "publishedAtAsc",
      by: [{ field: "publishedAt", direction: "asc" }],
    },
  ],

  preview: {
    select: {
      title: `title.${DEFAULT_LOCALE}`,
      media: "mainImage",
      date: "publishedAt",
    },
    prepare: ({ title, media, date }) => ({
      title: title ?? "Untitled",
      subtitle: date ? new Date(date).toLocaleDateString("en-GB") : undefined,
      media,
    }),
  },
});
