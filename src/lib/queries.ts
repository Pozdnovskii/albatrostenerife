import { sanityClient } from "sanity:client";
import type { Locale } from "@i18n/config";
import { LOCALES } from "@i18n/config";
import type {
  Activity,
  ContactInfo,
  LegalPageData,
  PageContent,
  Post,
  Property,
  Review,
  ServiceCard,
  ServicePageData,
  UnifiedPath,
} from "./types";

// ── GROQ helpers ──────────────────────────────────────────────────────────────

/** Builds a GROQ inline object with one key per locale pointing to a slug field.
 *  Used by service, post, property — all document types that use translatedField.
 *  seoSettings has a different structure (translations.{lang}.slug.current)
 *  and is handled inline in getAllPaths(). */
export function slugsProjection(field = "slug") {
  return LOCALES.map((l) => `"${l}": ${field}.${l}.current`).join(", ");
}

/** Converts a Sanity asset URL to an og:image URL (1200×630, jpg). */
export function sanityOgImage(
  url: string | null | undefined,
): string | undefined {
  if (!url) return undefined;
  return `${url}?w=1200&h=630&fit=crop&fm=jpg&q=85`;
}

// ── Routing ───────────────────────────────────────────────────────────────────

/** Returns every routable document across all types, normalised to UnifiedPath.
 *  Add new types here as the project grows — page files filter by `type`. */
export async function getAllPaths(): Promise<UnifiedPath[]> {
  const result = await sanityClient.fetch<{
    pages: { enSlug: string | null; slugs: Partial<Record<Locale, string>> }[];
    services: {
      enSlug: string | null;
      slugs: Partial<Record<Locale, string>>;
    }[];
    properties: {
      enSlug: string | null;
      slugs: Partial<Record<Locale, string>>;
    }[];
    posts: { enSlug: string | null; slugs: Partial<Record<Locale, string>> }[];
  }>(`{
    "pages": *[_type == "seoSettings" && isHomepage != true]{
      "enSlug": translations.en.slug.current,
      "slugs": { ${LOCALES.map((l) => `"${l}": translations.${l}.slug.current`).join(", ")} }
    },
    "services": *[_type == "service" && defined(slug.en.current)]{
      "enSlug": slug.en.current,
      "slugs": { ${slugsProjection()} }
    },
    "properties": *[_type == "property" && defined(slug.en.current)]{
      "enSlug": slug.en.current,
      "slugs": { ${slugsProjection()} }
    },
    "posts": *[_type == "blogPost" && defined(slug.en.current)]{
      "enSlug": slug.en.current,
      "slugs": { ${slugsProjection()} }
    }
  }`);

  return [
    ...result.pages
      .filter((p) => !!p.enSlug)
      .map((p) => ({
        type: "page" as const,
        enSlug: p.enSlug!,
        slugs: p.slugs,
      })),
    ...result.services
      .filter((s) => !!s.enSlug)
      .map((s) => ({
        type: "service" as const,
        enSlug: s.enSlug!,
        slugs: s.slugs,
      })),
    ...result.properties
      .filter((p) => !!p.enSlug)
      .map((p) => ({
        type: "property" as const,
        enSlug: p.enSlug!,
        slugs: p.slugs,
      })),
    ...result.posts
      .filter((p) => !!p.enSlug)
      .map((p) => ({
        type: "post" as const,
        enSlug: p.enSlug!,
        slugs: p.slugs,
      })),
  ];
}

// ── Page content ──────────────────────────────────────────────────────────────

/** Homepage SEO — identified by isHomepage flag, not a slug. */
export async function getHomepageSeo(
  lang: Locale,
): Promise<PageContent | null> {
  return sanityClient.fetch(
    `*[_type == "seoSettings" && isHomepage == true][0]{
      title,
      "metaTitle":       translations[$lang].metaTitle,
      "metaDescription": translations[$lang].metaDescription,
      "ogImageUrl":      ogImage.asset->url
    }`,
    { lang },
  );
}

export async function getPageContent(
  lang: Locale,
  enSlug: string,
): Promise<PageContent | null> {
  return sanityClient.fetch(
    `*[_type == "seoSettings" && translations.en.slug.current == $enSlug][0]{
      title,
      "metaTitle":       translations[$lang].metaTitle,
      "metaDescription": translations[$lang].metaDescription,
      "ogImageUrl":      ogImage.asset->url
    }`,
    { lang, enSlug },
  );
}

export async function getServicePageData(
  lang: Locale,
  enSlug: string,
): Promise<ServicePageData | null> {
  return sanityClient.fetch(
    `*[_type == "service" && slug.en.current == $enSlug][0]{
      "title":           coalesce(pageTitle[$lang], pageTitle.en),
      "pageHeading":     coalesce(pageHeading[$lang], pageHeading.en),
      "pageSubtitle":    coalesce(pageSubtitle[$lang], pageSubtitle.en),
      "description":     coalesce(description[$lang], description.en),
      "featureLists":    featureLists[]{
        "title": coalesce(title[$lang], title.en),
        "items": items[]{
          emoji,
          "title":       coalesce(title[$lang], title.en),
          "description": coalesce(description[$lang], description.en)
        }
      },
      "ctaText":         coalesce(ctaText[$lang], ctaText.en),
      "cardButtonText":  coalesce(cardButtonText[$lang], cardButtonText.en),
      "agentQuote":      coalesce(agentQuote[$lang], agentQuote.en),
      "ctaHref": *[_type == "seoSettings" && translations.en.slug.current == "inquiry-form"][0]{
        "slug": coalesce(translations[$lang].slug.current, translations.en.slug.current)
      }.slug,
      "metaTitle":       coalesce(metaTitle[$lang], metaTitle.en),
      "metaDescription": coalesce(metaDescription[$lang], metaDescription.en),
      "slugs":           { ${slugsProjection()} },
      "imageDesktop":    imageDesktop.asset->{ "url": url, "width": metadata.dimensions.width, "height": metadata.dimensions.height },
      "imageMobile":     imageMobile.asset->{ "url": url, "width": metadata.dimensions.width, "height": metadata.dimensions.height }
    }`,
    { lang, enSlug },
  );
}

// ── Home sections ─────────────────────────────────────────────────────────────

/** Resolves the lang-specific slug for the "contact" seoSettings page. */
export async function getContactPageSlug(lang: Locale): Promise<string | null> {
  return sanityClient.fetch(
    `*[_type == "seoSettings" && translations.en.slug.current == "contact"][0]{
      "slug": coalesce(translations[$lang].slug.current, translations.en.slug.current)
    }.slug`,
    { lang },
  );
}

export async function getContactInfo(lang: Locale) {
  return sanityClient.fetch<ContactInfo | null>(
    `*[_type == "contactInfo"][0]{
      "locationName": coalesce(locationName[$lang], locationName.en),
      address, phone, email, advisorName,
      "advisorTitle": coalesce(advisorTitle[$lang], advisorTitle.en)
    }`,
    { lang },
  );
}

export async function getReviewCount(): Promise<number> {
  return sanityClient.fetch(`count(*[_type == "review"])`);
}

export async function getReviews(lang: Locale): Promise<Review[]> {
  return sanityClient.fetch(
    `*[_type == "review"] | order(order asc) {
      "name":     coalesce(name[$lang], name.en),
      "location": coalesce(location[$lang], location.en),
      "text":     coalesce(text[$lang], text.en),
      "photoUrl": photo.asset->url
    }`,
    { lang },
  );
}

export async function getActivities(lang: Locale): Promise<Activity[]> {
  return sanityClient.fetch(
    `*[_type == "activity"] | order(order asc) {
      "name":       coalesce(name[$lang], name.en),
      "buttonText": coalesce(buttonText[$lang], buttonText.en),
      url,
      "imageUrl":   image.asset->url,
      "alt":        coalesce(image.alt[$lang], image.alt.en)
    }`,
    { lang },
  );
}

export async function getLegalPageData(
  lang: Locale,
  key: string,
): Promise<LegalPageData | null> {
  return sanityClient.fetch(
    `*[_type == "legalPage" && key == $key][0]{
      "heading": coalesce(heading[$lang], heading.en),
      "body":    coalesce(body[$lang], body.en)
    }`,
    { lang, key },
  );
}

/** Per-language slugs for the listings index page (from seoSettings). */
export async function getListingsSlugs(): Promise<
  Partial<Record<Locale, string>>
> {
  return sanityClient.fetch(
    `*[_type == "seoSettings" && translations.en.slug.current == "listings"][0]{
      ${LOCALES.map((l) => `"${l}": translations.${l}.slug.current`).join(", ")}
    }`,
  );
}

export async function getPropertyDetail(
  lang: Locale,
  enSlug: string,
): Promise<Property | null> {
  return sanityClient.fetch(
    `*[_type == "property" && slug.en.current == $enSlug][0]{
      "title":           coalesce(title[$lang], title.en),
      price,
      bedrooms,
      bathrooms,
      area,
      "slug":            coalesce(slug[$lang].current, slug.en.current),
      featured,
      "status":          status->{ "name": coalesce(name[$lang], name.en), "key": key },
      "labels":          labels[]->{ "name": coalesce(name[$lang], name.en), "key": key },
      "propertyType":    propertyType->{ "name": coalesce(name[$lang], name.en) },
      "images":          gallery[].asset->url,
      "description":     coalesce(description[$lang], description.en),
      year,
      "features":        features[]->{ "name": coalesce(name[$lang], name.en) },
      "metaTitle":       coalesce(metaTitle[$lang], metaTitle.en),
      "metaDescription": coalesce(metaDescription[$lang], metaDescription.en),
      videoUrl,
      virtualTourUrl
    }`,
    { lang, enSlug },
  );
}

export async function getProperties(
  lang: Locale,
  limit?: number,
  excludeEnSlug?: string,
): Promise<Property[]> {
  const filter = excludeEnSlug
    ? `*[_type == "property" && hidden != true && slug.en.current != $excludeEnSlug]`
    : `*[_type == "property" && hidden != true]`;
  const slice = limit != null ? `[0...$limit]` : ``;
  return sanityClient.fetch(
    `${filter} | order(
      select(
        "off-market" in coalesce(labels[]->key.current, [])                                                                                              => 9,
        status->key.current == "sale" && !("sold" in coalesce(labels[]->key.current, [])) && !("reserved" in coalesce(labels[]->key.current, []))        => 1,
        status->key.current == "sale" && "reserved" in coalesce(labels[]->key.current, [])                                                              => 2,
        status->key.current == "rent" && !("rented" in coalesce(labels[]->key.current, [])) && !("reserved" in coalesce(labels[]->key.current, []))      => 3,
        status->key.current == "rent" && "reserved" in coalesce(labels[]->key.current, [])                                                              => 4,
        status->key.current == "sale" && "sold"     in coalesce(labels[]->key.current, [])                                                              => 5,
        status->key.current == "rent" && "rented"   in coalesce(labels[]->key.current, [])                                                              => 6,
        9
      ) asc,
      coalesce(pinnedToTop, false) desc,
      coalesce(pinOrder, 9999) asc,
      _createdAt desc
    )${slice} {
      "title":        coalesce(title[$lang], title.en),
      price,
      bedrooms,
      bathrooms,
      area,
      "slug":         coalesce(slug[$lang].current, slug.en.current),
      featured,
      "status":       status->{ "name": coalesce(name[$lang], name.en), "key": key },
      "labels":       labels[]->{ "name": coalesce(name[$lang], name.en), "key": key },
      "propertyType": propertyType->{ "name": coalesce(name[$lang], name.en) },
      "images":       gallery[0..2][].asset->url
    }`,
    { lang, limit, excludeEnSlug },
  );
}

/** Per-language slugs for the blog index page (from seoSettings). */
export async function getBlogSlugs(): Promise<Partial<Record<Locale, string>>> {
  return sanityClient.fetch(
    `*[_type == "seoSettings" && translations.en.slug.current == "blog"][0]{
      ${LOCALES.map((l) => `"${l}": translations.${l}.slug.current`).join(", ")}
    }`,
  );
}

export async function getPosts(
  lang: Locale,
  limit?: number,
  excludeEnSlug?: string,
): Promise<Post[]> {
  const filter = excludeEnSlug
    ? `*[_type == "blogPost" && slug.en.current != $excludeEnSlug]`
    : `*[_type == "blogPost"]`;
  const slice = limit != null ? `[0...$limit]` : ``;
  return sanityClient.fetch(
    `${filter} | order(publishedAt desc)${slice} {
      "title":        coalesce(title[$lang], title.en),
      "description":  coalesce(description[$lang], description.en),
      "mainImage":    mainImage.asset->url,
      "mainImageAlt": coalesce(mainImage.alt[$lang], mainImage.alt.en),
      publishedAt,
      "tags":         coalesce(tags[]->{  "name": coalesce(name[$lang], name.en) }, []),
      "slug":         coalesce(slug[$lang].current, slug.en.current)
    }`,
    { lang, limit, excludeEnSlug },
  );
}

export async function getPostDetail(
  lang: Locale,
  enSlug: string,
): Promise<Post | null> {
  return sanityClient.fetch(
    `*[_type == "blogPost" && slug.en.current == $enSlug][0]{
      "title":           coalesce(title[$lang], title.en),
      "description":     coalesce(description[$lang], description.en),
      "mainImage":       mainImage.asset->url,
      "mainImageAlt":    coalesce(mainImage.alt[$lang], mainImage.alt.en),
      publishedAt,
      "tags":            tags[]->{  "name": coalesce(name[$lang], name.en) },
      "slug":            coalesce(slug[$lang].current, slug.en.current),
      "body":            coalesce(body[$lang], body.en)[]{
        ...,
        _type == "image"    => { ..., "asset": asset->{ url } },
        _type == "photoRow" => { "left": left{ "asset": asset->{ url }, alt }, "right": right{ "asset": asset->{ url }, alt } },
        markDefs[]{
          ...,
          "internalRef": internalLink->{
            _type,
            "isHomepage": select(_type == "seoSettings" => isHomepage, false),
            "slug": select(
              _type == "seoSettings" => select(
                isHomepage == true => null,
                coalesce(translations[$lang].slug.current, translations.en.slug.current)
              ),
              coalesce(slug[$lang].current, slug.en.current)
            )
          }
        }
      },
      "faq":             faq[]{
        "question": coalesce(question[$lang], question.en),
        "answer":   coalesce(answer[$lang], answer.en)
      },
      "ctaTitle":        coalesce(ctaTitle[$lang], ctaTitle.en),
      "ctaText":         coalesce(ctaText[$lang], ctaText.en)[]{
        _key, _type, style,
        children[]{ _key, _type, text, marks },
        markDefs[]{
          _key, _type, href, blank,
          "internalRef": internalLink->{
            _type,
            "isHomepage": select(_type == "seoSettings" => isHomepage, false),
            "slug": select(
              _type == "seoSettings" => select(
                isHomepage == true => null,
                coalesce(translations[$lang].slug.current, translations.en.slug.current)
              ),
              coalesce(slug[$lang].current, slug.en.current)
            )
          }
        }
      },
      "ctaButton":       ctaButton->{
        "label": coalesce(label[$lang], label.en),
        "page":  page->{
          _type,
          "isHomepage": select(_type == "seoSettings" => isHomepage, false),
          "slug": select(
            _type == "seoSettings" => select(
              isHomepage == true => null,
              coalesce(translations[$lang].slug.current, translations.en.slug.current)
            ),
            coalesce(slug[$lang].current, slug.en.current)
          )
        }
      },
      "metaTitle":       coalesce(metaTitle[$lang], metaTitle.en),
      "metaDescription": coalesce(metaDescription[$lang], metaDescription.en)
    }`,
    { lang, enSlug },
  );
}

export async function getServices(lang: Locale): Promise<ServiceCard[]> {
  return sanityClient.fetch(
    `*[_type == "service"] | order(order asc) {
      "name":            coalesce(name[$lang], name.en),
      "cardDescription": coalesce(cardDescription[$lang], cardDescription.en),
      "cardButtonText":  coalesce(cardButtonText[$lang], cardButtonText.en),
      "cardIconUrl":     cardIcon.asset->url,
      "slug":            coalesce(slug[$lang].current, slug.en.current)
    }`,
    { lang },
  );
}
