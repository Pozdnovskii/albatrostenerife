import { defineArrayMember, defineField, defineType } from "sanity";
import {
  translatedField,
  LANGUAGES,
  LANGUAGE_TITLES,
  DEFAULT_LOCALE,
} from "../lib/constants";
import type { Locale } from "@i18n/config";

export const service = defineType({
  name: "service",
  title: "Service",
  type: "document",

  groups: [
    { name: "card", title: "Card", default: true },
    { name: "seo", title: "SEO" },
    { name: "page", title: "Page" },
    { name: "form", title: "Form" },
  ],

  fields: [
    // ── Order ────────────────────────────────────────────────────────────────
    defineField({
      name: "order",
      title: "Order",
      type: "number",
      group: "card",
      validation: (r) => r.required(),
    }),

    // ── Card ─────────────────────────────────────────────────────────────────
    translatedField("name", "Name", { group: "card" }),
    translatedField("cardDescription", "Card Description", { group: "card" }),
    translatedField("cardButtonText", "Card Button Text", { group: "card" }),
    defineField({
      name: "cardIcon",
      title: "Card Icon",
      type: "image",
      group: "card",
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
          options: { source: `name.${lang}` },
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

    // ── Page ─────────────────────────────────────────────────────────────────
    translatedField("pageTitle", "Page Title", {
      required: false,
      group: "page",
    }),
    translatedField("pageHeading", "Page Heading", { group: "page" }),
    translatedField("pageSubtitle", "Page Subtitle", { group: "page" }),
    defineField({
      name: "imageDesktop",
      title: "Hero Image — Desktop",
      type: "image",
      options: { hotspot: true },
      group: "page",
    }),
    defineField({
      name: "imageMobile",
      title: "Hero Image — Mobile",
      type: "image",
      options: { hotspot: true },
      group: "page",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "object",
      group: "page",
      fields: LANGUAGES.map((lang) =>
        defineField({
          name: lang,
          title: LANGUAGE_TITLES[lang as Locale],
          type: "array",
          of: [
            defineArrayMember({
              type: "block",
              styles: [{ title: "Normal", value: "normal" }],
              lists: [],
              marks: {
                decorators: [{ title: "Bold", value: "strong" }],
                annotations: [],
              },
            }),
          ],
        }),
      ),
    }),

    // ── Feature Lists ─────────────────────────────────────────────────────────
    defineField({
      name: "featureLists",
      title: "Feature Lists",
      type: "array",
      group: "page",
      of: [
        defineArrayMember({
          type: "object",
          preview: {
            select: { title: `title.${DEFAULT_LOCALE}` },
          },
          fields: [
            translatedField("title", "List Title"),
            defineField({
              name: "items",
              title: "Items",
              type: "array",
              of: [
                defineArrayMember({
                  type: "object",
                  preview: {
                    select: {
                      emoji: "emoji",
                      title: `title.${DEFAULT_LOCALE}`,
                    },
                    prepare: ({ emoji, title }) => ({
                      title: `${emoji ?? "—"} ${title ?? ""}`,
                    }),
                  },
                  fields: [
                    defineField({
                      name: "emoji",
                      title: "Emoji",
                      type: "string",
                    }),
                    translatedField("title", "Title"),
                    translatedField("description", "Description"),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    }),

    translatedField("agentQuote", "Agent Quote", {
      type: "text",
      rows: 5,
      group: "page",
    }),

    // ── Form ──────────────────────────────────────────────────────────────────
    translatedField("ctaText", "CTA Text", { group: "form" }),
    translatedField("formMessagePlaceholder", "Message Placeholder", {
      required: false,
      group: "form",
    }),
    translatedField("formSubmitText", "Submit Button Text", {
      required: false,
      group: "form",
    }),
  ],

  orderings: [
    {
      title: "Order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],

  preview: {
    select: {
      title: `name.${DEFAULT_LOCALE}`,
      order: "order",
    },
    prepare: ({ title, order }) => ({
      title: `${order ?? "–"}. ${title ?? "Untitled"}`,
    }),
  },
});
