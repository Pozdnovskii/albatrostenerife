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
import { blogTag } from "@studio/schemas/blogTag";
import { blogPost } from "@studio/schemas/blogPost";
import { blogCta } from "@studio/schemas/blogCta";
import { homePage } from "@studio/schemas/homePage";
import { blogTexts } from "@studio/schemas/blogTexts";
import { notFoundTexts } from "@studio/schemas/notFoundTexts";
import { sellersTexts } from "@studio/schemas/sellersTexts";
import { listingsTexts } from "@studio/schemas/listingsTexts";

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
                    S.documentTypeListItem("blogTag").title("Tags"),
                    S.documentTypeListItem("blogCta").title("CTA Buttons"),
                  ]),
              ),
            S.divider(),
            S.documentTypeListItem("review").title("Reviews"),
            S.documentTypeListItem("activity").title("Activities"),
            S.divider(),
            S.listItem()
              .title("Texts")
              .child(
                S.list()
                  .title("Texts")
                  .items([
                    S.documentTypeListItem("homePage").title("Home Page"),
                    S.documentTypeListItem("blogTexts").title("Blog"),
                    S.documentTypeListItem("listingsTexts").title("Listings"),
                    S.documentTypeListItem("sellersTexts").title("Sellers Page"),
                    S.documentTypeListItem("notFoundTexts").title("404 Not Found"),
                    S.documentTypeListItem("legalPage").title("Legal Pages"),
                    S.documentTypeListItem("service").title("Services"),
                  ]),
              ),
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
      blogTag,
      blogPost,
      blogCta,
      homePage,
      blogTexts,
      notFoundTexts,
      sellersTexts,
      listingsTexts,
    ],
  },
});
