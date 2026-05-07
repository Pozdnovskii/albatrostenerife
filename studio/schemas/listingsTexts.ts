import { defineType } from "sanity";
import { translatedField } from "../lib/constants";

export const listingsTexts = defineType({
  name: "listingsTexts",
  title: "Listings",
  type: "document",
  groups: [
    { name: "page",     title: "Page" },
    { name: "card",     title: "Cards" },
    { name: "property", title: "Property Detail" },
  ],
  fields: [
    translatedField("pageTitle",       "Page Title",         { group: "page" }),
    translatedField("pageSubtitle",    "Page Subtitle",      { group: "page" }),
    translatedField("priceOnRequest",  "Price on Request",   { group: "card" }),
    translatedField("photos",          "Photos (aria)",      { group: "card" }),
    translatedField("bedroom",         "Bedroom Label",      { group: "card" }),
    translatedField("bath",            "Bath Label",         { group: "card" }),
    translatedField("areaSize",        "Area Label",         { group: "card" }),
    translatedField("propertyType",    "Property Type Label",{ group: "card" }),
    translatedField("price",           "Price Label",        { group: "property" }),
    translatedField("propertyStatus",  "Status Label",       { group: "property" }),
    translatedField("yearBuilt",       "Year Built Label",   { group: "property" }),
    translatedField("features",        "Features Label",     { group: "property" }),
    translatedField("description",     "Description Label",  { group: "property" }),
    translatedField("details",         "Details Label",      { group: "property" }),
    translatedField("video",           "Video Label",        { group: "property" }),
    translatedField("virtualTour",     "Virtual Tour Label", { group: "property" }),
    translatedField("readMore",        "Read More Button",   { group: "property" }),
    translatedField("readLess",        "Read Less Button",   { group: "property" }),
    translatedField("allPhotos",       "All Photos Button",  { group: "property" }),
    translatedField("otherProperties", "Other Properties",   { group: "property" }),
  ],
  preview: {
    prepare: () => ({ title: "Listings" }),
  },
});
