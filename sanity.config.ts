import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import type { StructureBuilder } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { RocketIcon } from "@sanity/icons";
import { DeployTool } from "@studio/plugins/DeployTool";

import { propertyStatus } from "@studio/schemas/propertyStatus";
import { propertyType } from "@studio/schemas/propertyType";
import { propertyLabel } from "@studio/schemas/propertyLabel";
import { feature } from "@studio/schemas/feature";
import { review } from "@studio/schemas/review";
import { property } from "@studio/schemas/property";
import { seoSettings } from "@studio/schemas/seoSettings";
import { navigation } from "@studio/schemas/navigation";
import { contactInfo } from "@studio/schemas/contactInfo";
import { service } from "@studio/schemas/service";
import { activity } from "@studio/schemas/activity";
import { legalPage } from "@studio/schemas/legalPage";
import { blogCategory } from "@studio/schemas/blogCategory";
import { blogTag } from "@studio/schemas/blogTag";
import { blogPost } from "@studio/schemas/blogPost";
import { blogCta } from "@studio/schemas/blogCta";

export default defineConfig({
  name: "albatros-realestate",
  title: "Albatros Tenerife",
  projectId: "nr9v3mei",
  dataset: "production",
  basePath: "/studio",

  plugins: [
    structureTool({
      structure: (S: StructureBuilder) =>
        S.list()
          .title("Content")
          .items([
            S.listItem()
              .title("Properties")
              .child(
                S.list()
                  .title("Properties")
                  .items([
                    S.documentTypeListItem("property").title("Properties"),
                    S.divider(),
                    S.documentTypeListItem("propertyStatus").title("Statuses"),
                    S.documentTypeListItem("propertyLabel").title("Labels"),
                    S.documentTypeListItem("propertyType").title("Types"),
                    S.documentTypeListItem("feature").title("Features"),
                  ]),
              ),
            S.divider(),
            S.listItem()
              .title("Blog")
              .child(
                S.list()
                  .title("Blog")
                  .items([
                    S.documentTypeListItem("blogPost").title("Posts"),
                    S.divider(),
                    S.documentTypeListItem("blogCategory").title("Categories"),
                    S.documentTypeListItem("blogTag").title("Tags"),
                    S.documentTypeListItem("blogCta").title("CTA Buttons"),
                  ]),
              ),
            S.divider(),
            S.documentTypeListItem("service").title("Services"),
            S.documentTypeListItem("review").title("Reviews"),
            S.documentTypeListItem("activity").title("Activities"),
            S.documentTypeListItem("legalPage").title("Legal Pages"),
            S.divider(),
            S.documentTypeListItem("seoSettings").title("SEO Settings"),
            S.documentTypeListItem("navigation").title("Navigation"),
            S.documentTypeListItem("contactInfo").title("Contact Info"),
          ]),
    }),
    visionTool(),
  ],

  tools: [
    {
      name: "deploy",
      title: "Deploy",
      icon: RocketIcon,
      component: DeployTool,
    },
  ],

  schema: {
    types: [
      propertyStatus,
      propertyType,
      propertyLabel,
      feature,
      review,
      property,
      seoSettings,
      navigation,
      contactInfo,
      service,
      activity,
      legalPage,
      blogCategory,
      blogTag,
      blogPost,
      blogCta,
    ],
  },
});
