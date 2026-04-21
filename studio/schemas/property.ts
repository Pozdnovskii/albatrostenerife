import { defineArrayMember, defineField, defineType } from "sanity";
import {
  translatedField,
  LANGUAGES,
  LANGUAGE_TITLES,
  DEFAULT_LOCALE,
} from "../lib/constants";
import type { Locale } from "@i18n/config";

export const property = defineType({
  name: "property",
  title: "Property",
  type: "document",

  groups: [
    { name: "seo", title: "SEO" },
    { name: "details", title: "Details" },
    { name: "media", title: "Media" },
    { name: "display", title: "Display" },
  ],

  fields: [
    translatedField("title", "Title"),

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

    // ── Details ─────────────────────────────────────────────────────────────────
    defineField({
      name: "status",
      title: "Status",
      type: "reference",
      to: [{ type: "propertyStatus" }],
      group: "details",
      // validation: (r) => r.required(),
    }),

    defineField({
      name: "propertyType",
      title: "Property Type",
      type: "reference",
      to: [{ type: "propertyType" }],
      group: "details",
    }),

    defineField({
      name: "price",
      title: "Price (€)",
      type: "number",
      group: "details",
      // validation: (r) => r.required().min(0),
    }),
    defineField({
      name: "bedrooms",
      title: "Bedrooms",
      type: "number",
      group: "details",
      validation: (r) => r.required().min(0),
    }),
    defineField({
      name: "bathrooms",
      title: "Bathrooms",
      type: "number",
      group: "details",
      validation: (r) => r.required().min(0),
    }),
    defineField({
      name: "area",
      title: "Area (m²)",
      type: "number",
      group: "details",
      // validation: (r) => r.required().min(0),
    }),
    defineField({
      name: "year",
      title: "Year built",
      type: "number",
      group: "details",
      validation: (r) => r.min(1900).max(new Date().getFullYear()),
    }),

    defineField({
      name: "features",
      title: "Features",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "feature" }] })],
      group: "details",
    }),

    defineField({
      name: "description",
      title: "Description",
      type: "object",
      group: "details",
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
                decorators: [
                  { title: "Bold", value: "strong" },
                  { title: "Italic", value: "em" },
                ],
                annotations: [],
              },
            }),
          ],
        }),
      ),
    }),

    defineField({
      name: "labels",
      title: "Labels",
      description: "Max 2 labels shown on the property card",
      type: "array",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "propertyLabel" }],
        }),
      ],
      group: "display",
      validation: (r) => r.max(2),
    }),

    defineField({
      name: "featured",
      title: "Featured",
      description: "Show green FEATURED badge on property card",
      type: "boolean",
      initialValue: false,
      group: "display",
    }),
    defineField({
      name: "pinnedToTop",
      title: "Pin to top",
      type: "boolean",
      initialValue: false,
      group: "display",
    }),
    defineField({
      name: "pinOrder",
      title: "Pin order",
      type: "number",
      description: "Lower number = shown first among pinned properties",
      hidden: ({ document }) => !document?.pinnedToTop,
      group: "display",
    }),

    // ── Media ────────────────────────────────────────────────────────────────
    defineField({
      name: "gallery",
      title: "Gallery",
      type: "array",
      group: "media",
      of: [
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [translatedField("alt", "Alt text", { required: false })],
        }),
      ],
      validation: (r) => r.min(1),
    }),
    defineField({
      name: "videoUrl",
      title: "Video URL",
      type: "url",
      group: "media",
    }),
    defineField({
      name: "virtualTourEmbed",
      title: "Virtual Tour Embed Code",
      type: "text",
      rows: 3,
      description:
        "Paste the full <iframe> embed code from your virtual tour provider",
      group: "media",
    }),
  ],

  orderings: [
    {
      title: "Price: Low → High",
      name: "priceAsc",
      by: [{ field: "price", direction: "asc" }],
    },
    {
      title: "Price: High → Low",
      name: "priceDesc",
      by: [{ field: "price", direction: "desc" }],
    },
  ],

  preview: {
    select: { title: `title.${DEFAULT_LOCALE}` },
    prepare: ({ title }) => ({ title: title ?? "Untitled" }),
  },
});
