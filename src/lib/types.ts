import type { Locale } from "@i18n/config";

// ── Routing ───────────────────────────────────────────────────────────────────

/** Returned by getAllPaths() — one entry per routable document.
 *  Used by getStaticPaths() in [slug].astro and [lang]/[slug].astro. */
export type UnifiedPath = {
  type: "page" | "service" | "property" | "post";
  enSlug: string;
  slugs: Partial<Record<Locale, string>>;
};

// ── Page content ──────────────────────────────────────────────────────────────

/** seoSettings page — SEO fields only, no visual content yet. */
export type PageContent = {
  title: string;
  metaTitle: string | null;
  metaDescription: string | null;
  ogImageUrl: string | null;
};

// Minimal portable text types — description only uses normal + bold
export type PTSpan = { _key: string; _type: "span"; text: string; marks: string[] };
export type PTBlock = { _key: string; _type: "block"; style: string; children: PTSpan[] };

export type LegalPageData = {
  heading: string | null;
  body: PTBlock[] | null;
};

export type ServicePageData = {
  title: string;        // pageTitle — hero h1
  pageHeading: string;  // pageHeading — section heading below hero
  pageSubtitle: string | null;
  description: PTBlock[] | null;
  featureLists: {
    title: string;
    items: { emoji: string | null; title: string; description: string }[];
  }[];
  ctaText: string | null;        // quote above the button
  cardButtonText: string | null; // button label
  agentQuote: string | null;     // agent quote — used in section below CTA
  ctaHref: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  slugs: Partial<Record<Locale, string>>;
  imageDesktop: { url: string; width: number; height: number } | null;
  imageMobile: { url: string; width: number; height: number } | null;
};

// ── Components ────────────────────────────────────────────────────────────────

export type NavItem = {
  label: string;
  page: { isHomepage: boolean; slug: string | null };
};

export type ContactInfo = {
  locationName: string | null;
  address: string;
  phone: string;
  email: string;
  advisorName: string;
  advisorTitle: string | null;
};

export type Review = {
  name: string;
  location: string;
  text: string;
  photoUrl: string | null;
};

export type Activity = {
  name: string;
  buttonText: string;
  url: string;
  imageUrl: string | null;
  alt: string | null;
};

export type Property = {
  // — shared by card and detail —
  title: string;
  slug: string;
  price: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  area: number | null;
  featured: boolean;
  status: { name: string; key: string } | null;
  labels: { name: string; key: string }[];
  propertyType: { name: string } | null;
  images: string[];
  // — detail-only (absent on card queries) —
  description?: PTBlock[] | null;
  year?: number | null;
  features?: { name: string }[] | null;
  updatedAt?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  videoUrl?: string | null;
  virtualTourUrl?: string | null;
};


export type Post = {
  // — shared by card and detail —
  title: string;
  slug: string;
  description: string | null;
  mainImage: string | null;
  mainImageAlt: string | null;
  publishedAt: string;
  tags: { name: string }[];
  // — detail-only (absent on card queries) —
  body?: unknown[] | null;
  faq?: { question: string; answer: string }[] | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
};

export type ServiceCard = {
  name: string;
  cardDescription: string;
  cardButtonText: string;
  cardIconUrl: string | null;
  slug: string;
};
