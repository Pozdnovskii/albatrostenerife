import { defineField, defineType } from "sanity";
import { InfoOutlineIcon } from "@sanity/icons";
import { translatedField, DEFAULT_LOCALE } from "../lib/constants";

export const contactInfo = defineType({
  name: "contactInfo",
  title: "Contact Info",
  type: "document",
  icon: InfoOutlineIcon,
  __experimental_omnisearch_visibility: false,
  fields: [
    translatedField("locationName", "Location Name"),
    defineField({
      name: "address",
      title: "Address",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "phone",
      title: "Phone",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "advisorName",
      title: "Advisor Name",
      type: "string",
      description: "Does not change across languages (e.g. Ivan Uher)",
      validation: (r) => r.required(),
    }),
    translatedField("advisorTitle", "Advisor Title", { required: false }),
  ],
  preview: {
    select: { title: `locationName.${DEFAULT_LOCALE}`, subtitle: "address" },
  },
});
