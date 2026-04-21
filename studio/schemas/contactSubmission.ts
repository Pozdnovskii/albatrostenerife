import { defineField, defineType } from "sanity";

export const contactSubmission = defineType({
  name: "contactSubmission",
  title: "Contact Submission",
  type: "document",

  // Disable creation and editing from Studio — submissions come only via API
  __experimental_actions: ["read", "delete"],

  fields: [
    defineField({ name: "firstName",   title: "First Name",   type: "string" }),
    defineField({ name: "lastName",    title: "Last Name",    type: "string" }),
    defineField({ name: "email",       title: "Email",        type: "string" }),
    defineField({ name: "phone",       title: "Phone",        type: "string" }),
    defineField({ name: "message",     title: "Message",      type: "text" }),
    defineField({ name: "lang",        title: "Language",     type: "string" }),
    defineField({ name: "source",      title: "Source page",  type: "string" }),
    defineField({ name: "submittedAt", title: "Submitted at", type: "datetime" }),
  ],

  preview: {
    select: {
      first: "firstName",
      last: "lastName",
      email: "email",
      date: "submittedAt",
    },
    prepare: ({ first, last, email, date }) => ({
      title: `${first ?? ""} ${last ?? ""}`.trim() || email,
      subtitle: date ? new Date(date).toLocaleString("en-GB") : email,
    }),
  },

  orderings: [
    {
      title: "Newest first",
      name: "submittedAtDesc",
      by: [{ field: "submittedAt", direction: "desc" }],
    },
  ],
});
