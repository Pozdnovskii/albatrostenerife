import type { Property, Post } from "./types";
import type { Locale } from "@i18n/config";

const SITE = "https://albatrostenerife.com";
const ORG_ID = `${SITE}/#organization`;
const SITE_ID = `${SITE}/#website`;

// ── Static nodes ──────────────────────────────────────────────────────────────

const ORG = {
  "@type": ["RealEstateAgent", "LocalBusiness"],
  "@id": ORG_ID,
  name: "Albatros Tenerife Real estate agent",
  url: SITE,
  address: {
    "@type": "PostalAddress",
    streetAddress: "Golf del Sur, Parque Albatros",
    addressLocality: "San Miguel de Abona",
    addressRegion: "Tenerife, Canary Islands",
    postalCode: "38639",
    addressCountry: "ES",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 28.0227,
    longitude: -16.6156,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "18:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Saturday"],
      opens: "09:00",
      closes: "14:00",
    },
  ],
  areaServed: [
    { "@type": "Place", name: "Tenerife, Canary Islands, Spain" },
    { "@type": "Place", name: "Golf del Sur" },
    { "@type": "Place", name: "San Miguel de Abona" },
  ],
  sameAs: ["https://www.linkedin.com/in/ivan-uher"],
};

const WEBSITE = {
  "@type": "WebSite",
  "@id": SITE_ID,
  url: SITE,
  publisher: { "@id": ORG_ID },
};

// ── Builder helpers ───────────────────────────────────────────────────────────

export type BreadcrumbItem = { name: string; url: string };

export function buildBreadcrumb(items: BreadcrumbItem[], id: string) {
  return {
    "@type": "BreadcrumbList",
    "@id": id,
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function buildRealEstateListing(property: Property, url: string) {
  return {
    "@type": ["RealEstateListing", "Apartment"],
    "@id": `${url}#listing`,
    name: property.title,
    url,
    ...(property.metaDescription ? { description: property.metaDescription } : {}),
    ...(property.bedrooms != null ? { numberOfBedrooms: property.bedrooms } : {}),
    ...(property.bathrooms != null ? { numberOfBathroomsTotal: property.bathrooms } : {}),
    ...(property.area != null
      ? { floorSize: { "@type": "QuantitativeValue", value: property.area, unitCode: "MTK" } }
      : {}),
    ...(property.price != null
      ? {
          offers: {
            "@type": "Offer",
            price: property.price,
            priceCurrency: "EUR",
            availability: "https://schema.org/InStock",
            seller: { "@id": ORG_ID },
          },
        }
      : {}),
    ...(property.images?.[0] ? { image: property.images[0] } : {}),
  };
}

export function buildBlogPosting(post: Post, url: string, lang: Locale) {
  return {
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    headline: post.title,
    url,
    inLanguage: lang,
    ...(post.metaDescription ? { description: post.metaDescription } : {}),
    ...(post.mainImage ? { image: post.mainImage } : {}),
    datePublished: post.publishedAt,
    author: {
      "@type": "Person",
      name: "Ivan Uher",
      sameAs: "https://www.linkedin.com/in/ivan-uher",
    },
    publisher: { "@id": ORG_ID },
    isPartOf: { "@id": SITE_ID },
  };
}

export function buildCollectionPage(name: string, url: string, lang: Locale) {
  return {
    "@type": "CollectionPage",
    "@id": `${url}#webpage`,
    url,
    name,
    inLanguage: lang,
    isPartOf: { "@id": SITE_ID },
    publisher: { "@id": ORG_ID },
  };
}

// ── Graph assemblers ──────────────────────────────────────────────────────────

/** Home page: full org + website. Pass contact to include phone/email/reviews. */
export function homeSchema(contact?: {
  phone?: string | null;
  email?: string | null;
  reviewCount?: number;
}) {
  const org = {
    ...ORG,
    ...(contact?.phone ? { telephone: contact.phone } : {}),
    ...(contact?.email ? { email: contact.email } : {}),
    ...(contact?.reviewCount
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: 5,
            bestRating: 5,
            reviewCount: contact.reviewCount,
          },
        }
      : {}),
  };
  return { "@context": "https://schema.org", "@graph": [org, WEBSITE] };
}

/** Listings or blog index, optionally with ItemList of item URLs */
export function collectionSchema(name: string, url: string, lang: Locale, itemUrls?: string[]) {
  const page: Record<string, unknown> = {
    ...buildCollectionPage(name, url, lang),
    ...(itemUrls?.length
      ? {
          mainEntity: {
            "@type": "ItemList",
            itemListElement: itemUrls.map((itemUrl, i) => ({
              "@type": "ListItem",
              position: i + 1,
              url: itemUrl,
            })),
          },
        }
      : {}),
  };
  return {
    "@context": "https://schema.org",
    "@graph": [{ "@id": ORG_ID }, page],
  };
}

/** Property detail page */
export function propertySchema(
  property: Property,
  url: string,
  breadcrumbs: BreadcrumbItem[]
) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      { "@id": ORG_ID },
      buildRealEstateListing(property, url),
      buildBreadcrumb(breadcrumbs, `${url}#breadcrumb`),
    ],
  };
}

/** Contact page */
export function contactSchema(url: string, lang: Locale) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      { "@id": ORG_ID },
      {
        "@type": "ContactPage",
        "@id": `${url}#webpage`,
        url,
        inLanguage: lang,
        isPartOf: { "@id": SITE_ID },
        about: { "@id": ORG_ID },
      },
    ],
  };
}

/** Service detail page */
export function serviceSchema(
  name: string,
  description: string | null | undefined,
  url: string,
  lang: Locale,
  breadcrumbs: BreadcrumbItem[]
) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      { "@id": ORG_ID },
      {
        "@type": "Service",
        "@id": `${url}#service`,
        name,
        ...(description ? { description } : {}),
        url,
        inLanguage: lang,
        provider: { "@id": ORG_ID },
        areaServed: {
          "@type": "Place",
          name: "Tenerife, Canary Islands, Spain",
        },
        serviceType: "Real Estate",
      },
      buildBreadcrumb(breadcrumbs, `${url}#breadcrumb`),
    ],
  };
}

/** Blog post detail page */
export function blogPostSchema(
  post: Post,
  url: string,
  lang: Locale,
  breadcrumbs: BreadcrumbItem[]
) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      { "@id": ORG_ID },
      buildBlogPosting(post, url, lang),
      buildBreadcrumb(breadcrumbs, `${url}#breadcrumb`),
    ],
  };
}
