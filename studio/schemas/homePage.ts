import { defineField, defineType } from "sanity";
import { translatedField } from "../lib/constants";

export const homePage = defineType({
  name: "homePage",
  title: "Home Page",
  type: "document",
  groups: [
    { name: "hero",       title: "Hero" },
    { name: "resort",     title: "Resort" },
    { name: "listings",   title: "Listings" },
    { name: "services",   title: "Services" },
    { name: "activities", title: "Activities" },
    { name: "reviews",    title: "Reviews" },
    { name: "contact",    title: "Contact" },
    { name: "blog",       title: "Blog" },
  ],
  fields: [
    translatedField("heroTitle",      "Hero Title",       { group: "hero" }),
    translatedField("heroSubtitle",   "Hero Subtitle",    { group: "hero" }),
    translatedField("heroBtn1",       "Button 1 Label",  { group: "hero", required: false }),
    defineField({
      name: "heroBtn1Page",
      title: "Button 1 Page",
      type: "reference",
      to: [{ type: "seoSettings" }],
      group: "hero",
    }),
    translatedField("heroBtn2",       "Button 2 Label", { group: "hero", required: false }),
    defineField({
      name: "heroBtn2Page",
      title: "Button 2 Page",
      type: "reference",
      to: [{ type: "seoSettings" }],
      group: "hero",
    }),

    translatedField("resortTitle",       "Title",       { group: "resort" }),
    translatedField("resortSubtitle",    "Subtitle",    { group: "resort" }),
    translatedField("resortDescription", "Description", { group: "resort", type: "text", rows: 6 }),
    translatedField("resortImageAlt",    "Image Alt",   { group: "resort", required: false }),

    translatedField("listingsTitle",    "Title",    { group: "listings" }),
    translatedField("listingsSubtitle", "Subtitle", { group: "listings" }),
    translatedField("listingsViewAll",  "View All Button", { group: "listings" }),

    translatedField("servicesTitle",    "Title",    { group: "services" }),
    translatedField("servicesSubtitle", "Subtitle", { group: "services" }),

    translatedField("activitiesTitle",    "Title",    { group: "activities" }),
    translatedField("activitiesSubtitle", "Subtitle", { group: "activities" }),

    translatedField("reviewsTitle",    "Title",    { group: "reviews" }),
    translatedField("reviewsSubtitle", "Subtitle", { group: "reviews" }),

    translatedField("contactTitle",    "Title",    { group: "contact" }),
    translatedField("contactSubtitle", "Subtitle", { group: "contact" }),

    translatedField("blogTitle",    "Title",    { group: "blog" }),
    translatedField("blogSubtitle", "Subtitle", { group: "blog" }),
    translatedField("blogViewAll",  "View All Button", { group: "blog" }),
  ],
  preview: {
    prepare: () => ({ title: "Home Page" }),
  },
});
