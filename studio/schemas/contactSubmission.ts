import { defineField, defineType } from "sanity";

export const contactSubmission = defineType({
  name: "contactSubmission",
  title: "Contact Submission",
  type: "document",

  fields: [
    defineField({ name: "firstName",   title: "Name",         type: "string" }),
    defineField({ name: "aptNo",       title: "Apt. No.",     type: "string" }),
    defineField({ name: "email",       title: "Email",        type: "string" }),
    defineField({ name: "phone",       title: "Phone",        type: "string" }),
    defineField({ name: "message",     title: "Message",      type: "text" }),
    defineField({ name: "lang",        title: "Language",     type: "string" }),
    defineField({ name: "source",      title: "Source page",  type: "string" }),
    defineField({ name: "submittedAt", title: "Submitted at", type: "datetime" }),
  ],

  preview: {
    select: {
      email: "email",
      date: "submittedAt",
    },
    prepare: ({ email, date }) => ({
      title: email,
      subtitle: date ? new Date(date).toLocaleString("en-GB") : undefined,
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
