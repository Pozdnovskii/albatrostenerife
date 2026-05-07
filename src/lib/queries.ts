import { sanityClient } from "sanity:client";
import type { Locale } from "@i18n/config";
import { LOCALES } from "@i18n/config";
import type {
  Activity,
  BlogTextsData,
  ContactInfo,
  ListingsTextsData,
  NotFoundTextsData,
  SellersTextsData,
  HomePageData,
  LegalPageData,
  PageContent,
  Post,
  Property,
  Review,
  ServiceCard,
  ServicePageData,
  UnifiedPath,
} from "./types";

// ── Build-time promise cache ───────────────────────────────────────────────────
// Deduplicates identical Sanity fetches within a single build (e.g. getAllPaths
// called from multiple getStaticPaths, getContactInfo called from index + ResortSection).

const _cache = new Map<string, Promise<unknown>>();
function cached<T>(key: string, fn: () => Promise<T>): Promise<T> {
  if (!_cache.has(key)) _cache.set(key, fn());
  return _cache.get(key) as Promise<T>;
}

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
export function getAllPaths(): Promise<UnifiedPath[]> {
  return cached("getAllPaths", async () => {
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
  });
}

// ── Page content ──────────────────────────────────────────────────────────────

/** Homepage SEO — identified by isHomepage flag, not a slug. */
export function getHomepageSeo(lang: Locale): Promise<PageContent | null> {
  return cached(`getHomepageSeo:${lang}`, () =>
    sanityClient.fetch(
      `*[_type == "seoSettings" && isHomepage == true][0]{
      title,
      "metaTitle":       translations[$lang].metaTitle,
      "metaDescription": translations[$lang].metaDescription,
      "ogImageUrl":      ogImage.asset->url
    }`,
      { lang },
    ),
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
      "enTitle":         pageTitle.en,
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
      "ctaHref": *[_type == "seoSettings" && translations.en.slug.current == "sell-property"][0]{
        "slug": coalesce(translations[$lang].slug.current, translations.en.slug.current)
      }.slug,
      "metaTitle":       coalesce(metaTitle[$lang], metaTitle.en),
      "metaDescription": coalesce(metaDescription[$lang], metaDescription.en),
      "slugs":           { ${slugsProjection()} },
      "imageDesktop":    imageDesktop.asset->{ "url": url, "width": metadata.dimensions.width, "height": metadata.dimensions.height },
      "imageMobile":     imageMobile.asset->{ "url": url, "width": metadata.dimensions.width, "height": metadata.dimensions.height },
      "formMessagePlaceholder": formMessagePlaceholder[$lang],
      "formSubmitText":         formSubmitText[$lang]
    }`,
    { lang, enSlug },
  );
}

// ── Home sections ─────────────────────────────────────────────────────────────

/** Fetches all home page copy from the singleton homePage document. */
export function getHomePage(lang: Locale): Promise<HomePageData | null> {
  return cached(`getHomePage:${lang}`, () =>
    sanityClient.fetch<HomePageData | null>(
      `*[_type == "homePage"][0]{
        "heroTitle":          coalesce(heroTitle[$lang], heroTitle.en),
        "heroSubtitle":       coalesce(heroSubtitle[$lang], heroSubtitle.en),
        "heroBtn1":           coalesce(heroBtn1[$lang], heroBtn1.en),
        "heroBtn1Href":       heroBtn1Page->{
          "slug": coalesce(translations[$lang].slug.current, translations.en.slug.current)
        }.slug,
        "heroBtn2":           coalesce(heroBtn2[$lang], heroBtn2.en),
        "heroBtn2Href":       heroBtn2Page->{
          "slug": coalesce(translations[$lang].slug.current, translations.en.slug.current)
        }.slug,
        "resortTitle":        coalesce(resortTitle[$lang], resortTitle.en),
        "resortSubtitle":     coalesce(resortSubtitle[$lang], resortSubtitle.en),
        "resortDescription":  coalesce(resortDescription[$lang], resortDescription.en),
        "resortImageAlt":     coalesce(resortImageAlt[$lang], resortImageAlt.en),
        "listingsTitle":      coalesce(listingsTitle[$lang], listingsTitle.en),
        "listingsSubtitle":   coalesce(listingsSubtitle[$lang], listingsSubtitle.en),
        "listingsViewAll":    coalesce(listingsViewAll[$lang], listingsViewAll.en),
        "servicesTitle":      coalesce(servicesTitle[$lang], servicesTitle.en),
        "servicesSubtitle":   coalesce(servicesSubtitle[$lang], servicesSubtitle.en),
        "activitiesTitle":    coalesce(activitiesTitle[$lang], activitiesTitle.en),
        "activitiesSubtitle": coalesce(activitiesSubtitle[$lang], activitiesSubtitle.en),
        "reviewsTitle":       coalesce(reviewsTitle[$lang], reviewsTitle.en),
        "reviewsSubtitle":    coalesce(reviewsSubtitle[$lang], reviewsSubtitle.en),
        "contactTitle":       coalesce(contactTitle[$lang], contactTitle.en),
        "contactSubtitle":    coalesce(contactSubtitle[$lang], contactSubtitle.en),
        "blogTitle":          coalesce(blogTitle[$lang], blogTitle.en),
        "blogSubtitle":       coalesce(blogSubtitle[$lang], blogSubtitle.en),
        "blogViewAll":        coalesce(blogViewAll[$lang], blogViewAll.en),
      }`,
      { lang },
    ),
  );
}

/** Resolves the lang-specific slug for the "contact" seoSettings page. */
export function getContactPageSlug(lang: Locale): Promise<string | null> {
  return cached(`getContactPageSlug:${lang}`, () =>
    sanityClient.fetch(
      `*[_type == "seoSettings" && translations.en.slug.current == "contact"][0]{
      "slug": coalesce(translations[$lang].slug.current, translations.en.slug.current)
    }.slug`,
      { lang },
    ),
  );
}

export function getPrivacyPolicyPage(
  lang: Locale,
): Promise<{ slug: string | null; title: string | null } | null> {
  return cached(`getPrivacyPolicyPage:${lang}`, () =>
    sanityClient.fetch(
      `*[_type == "seoSettings" && translations.en.slug.current == "privacy-policy"][0]{
      "slug":  coalesce(translations[$lang].slug.current, translations.en.slug.current),
      "title": coalesce(translations[$lang].metaTitle, title)
    }`,
      { lang },
    ),
  );
}

export function getContactInfo(lang: Locale): Promise<ContactInfo | null> {
  return cached(`getContactInfo:${lang}`, () =>
    sanityClient.fetch<ContactInfo | null>(
      `*[_type == "contactInfo"][0]{
      "locationName": coalesce(locationName[$lang], locationName.en),
      address, phone, email, advisorName,
      "advisorTitle": coalesce(advisorTitle[$lang], advisorTitle.en)
    }`,
      { lang },
    ),
  );
}

export function getReviewCount(): Promise<number> {
  return cached("getReviewCount", () =>
    sanityClient.fetch(`count(*[_type == "review"])`),
  );
}

export function getReviews(lang: Locale): Promise<Review[]> {
  return cached(`getReviews:${lang}`, () => sanityClient.fetch(
    `*[_type == "review"] | order(order asc) {
      "name":     coalesce(name[$lang], name.en),
      "location": coalesce(location[$lang], location.en),
      "text":     coalesce(text[$lang], text.en),
      "photoUrl": photo.asset->url + "?w=192"
    }`,
    { lang },
  ));
}

export function getActivities(lang: Locale): Promise<Activity[]> {
  return cached(`getActivities:${lang}`, () => sanityClient.fetch(
    `*[_type == "activity"] | order(order asc) {
      "name":       coalesce(name[$lang], name.en),
      "buttonText": coalesce(buttonText[$lang], buttonText.en),
      url,
      "imageUrl":   image.asset->url,
      "alt":        coalesce(image.alt[$lang], image.alt.en)
    }`,
    { lang },
  ));
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
export function getListingsSlugs(): Promise<Partial<Record<Locale, string>>> {
  return cached("getListingsSlugs", () =>
    sanityClient.fetch(
      `*[_type == "seoSettings" && translations.en.slug.current == "listings"][0]{
      ${LOCALES.map((l) => `"${l}": translations.${l}.slug.current`).join(", ")}
    }`,
    ),
  );
}

export async function getPropertyDetail(
  lang: Locale,
  enSlug: string,
): Promise<Property | null> {
  return sanityClient.fetch(
    `*[_type == "property" && slug.en.current == $enSlug][0]{
      "title":           coalesce(title[$lang], title.en),
      "enTitle":         title.en,
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
      "galleryImages":   gallery[]{"url": asset->url, "alt": coalesce(alt[$lang], alt.en)},
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
      "images":       gallery[]{"url": asset->url + "?w=960"}.url
    }`,
    { lang, limit, excludeEnSlug },
  );
}

/** All blog tags with per-locale slugs + names/SEO — used by tag page getStaticPaths. */
export function getTagPaths(): Promise<{
  _id: string;
  slugs: Partial<Record<Locale, string>>;
  names: Partial<Record<Locale, string>>;
  metaTitles: Partial<Record<Locale, string>>;
  metaDescriptions: Partial<Record<Locale, string>>;
}[]> {
  return cached("getTagPaths", () =>
    sanityClient.fetch(
      `*[_type == "blogTag" && defined(slug.en.current)] | order(name.en asc) {
        _id,
        "slugs": { ${slugsProjection()} },
        "names": name,
        "metaTitles": metaTitle,
        "metaDescriptions": metaDescription
      }`,
    ),
  );
}

/** Per-language slugs for the blog index page (from seoSettings). */
export function getBlogSlugs(): Promise<Partial<Record<Locale, string>>> {
  return cached("getBlogSlugs", () =>
    sanityClient.fetch(
      `*[_type == "seoSettings" && translations.en.slug.current == "blog"][0]{
      ${LOCALES.map((l) => `"${l}": translations.${l}.slug.current`).join(", ")}
    }`,
    ),
  );
}

export async function getPosts(
  lang: Locale,
  limit?: number,
  excludeEnSlug?: string,
  tagRef?: string,
): Promise<Post[]> {
  const conditions = [
    `_type == "blogPost"`,
    excludeEnSlug ? `slug.en.current != $excludeEnSlug` : null,
  ].filter(Boolean).join(" && ");
  const slice = limit != null ? `[0...$limit]` : ``;
  const order = tagRef
    ? `order(select(tag._ref == $tagRef => 1, 0) desc, coalesce(featured, false) desc, publishedAt desc)`
    : `order(coalesce(featured, false) desc, publishedAt desc)`;
  return sanityClient.fetch(
    `*[${conditions}] | ${order}${slice} {
      "title":        coalesce(title[$lang], title.en),
      "description":  coalesce(description[$lang], description.en),
      "mainImage":    mainImage.asset->url + "?w=960",
      "mainImageAlt": coalesce(mainImage.alt[$lang], mainImage.alt.en),
      publishedAt,
      "tag":          tag->{ "name": coalesce(name[$lang], name.en) },
      featured,
      "slug":         coalesce(slug[$lang].current, slug.en.current)
    }`,
    { lang, limit, excludeEnSlug, tagRef },
  );
}

export async function getPostDetail(
  lang: Locale,
  enSlug: string,
): Promise<Post | null> {
  return sanityClient.fetch(
    `*[_type == "blogPost" && slug.en.current == $enSlug][0]{
      "title":           coalesce(title[$lang], title.en),
      "enTitle":         title.en,
      "description":     coalesce(description[$lang], description.en),
      "mainImage":       mainImage.asset->url + "?w=1880",
      "mainImageAlt":    coalesce(mainImage.alt[$lang], mainImage.alt.en),
      publishedAt,
      "tag":             tag->{ "name": coalesce(name[$lang], name.en) },
      "tagRef":          tag._ref,
      "tagSlug":         tag->slug[$lang].current,
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

export function getListingsTexts(lang: Locale): Promise<ListingsTextsData | null> {
  return cached(`getListingsTexts:${lang}`, () =>
    sanityClient.fetch<ListingsTextsData | null>(
      `*[_type == "listingsTexts"][0]{
        "pageTitle":       coalesce(pageTitle[$lang],       pageTitle.en),
        "pageSubtitle":    coalesce(pageSubtitle[$lang],    pageSubtitle.en),
        "priceOnRequest":  coalesce(priceOnRequest[$lang],  priceOnRequest.en),
        "photos":          coalesce(photos[$lang],          photos.en),
        "bedroom":         coalesce(bedroom[$lang],         bedroom.en),
        "bath":            coalesce(bath[$lang],            bath.en),
        "areaSize":        coalesce(areaSize[$lang],        areaSize.en),
        "propertyType":    coalesce(propertyType[$lang],    propertyType.en),
        "price":           coalesce(price[$lang],           price.en),
        "propertyStatus":  coalesce(propertyStatus[$lang],  propertyStatus.en),
        "yearBuilt":       coalesce(yearBuilt[$lang],       yearBuilt.en),
        "features":        coalesce(features[$lang],        features.en),
        "description":     coalesce(description[$lang],     description.en),
        "details":         coalesce(details[$lang],         details.en),
        "video":           coalesce(video[$lang],           video.en),
        "virtualTour":     coalesce(virtualTour[$lang],     virtualTour.en),
        "readMore":        coalesce(readMore[$lang],        readMore.en),
        "readLess":        coalesce(readLess[$lang],        readLess.en),
        "allPhotos":       coalesce(allPhotos[$lang],       allPhotos.en),
        "otherProperties": coalesce(otherProperties[$lang], otherProperties.en)
      }`,
      { lang },
    ),
  );
}

export function getNotFoundTexts(lang: Locale): Promise<NotFoundTextsData | null> {
  return cached(`getNotFoundTexts:${lang}`, () =>
    sanityClient.fetch<NotFoundTextsData | null>(
      `*[_type == "notFoundTexts"][0]{
        "title":    coalesce(title[$lang], title.en),
        "subtitle": coalesce(subtitle[$lang], subtitle.en),
        "back":     coalesce(back[$lang], back.en)
      }`,
      { lang },
    ),
  );
}

export function getSellersTexts(lang: Locale): Promise<SellersTextsData | null> {
  return cached(`getSellersTexts:${lang}`, () =>
    sanityClient.fetch<SellersTextsData | null>(
      `*[_type == "sellersTexts"][0]{
        "title":    coalesce(title[$lang], title.en),
        "enTitle":  title.en,
        "subtitle": coalesce(subtitle[$lang], subtitle.en)
      }`,
      { lang },
    ),
  );
}

export function getBlogTexts(lang: Locale): Promise<BlogTextsData | null> {
  return cached(`getBlogTexts:${lang}`, () =>
    sanityClient.fetch<BlogTextsData | null>(
      `*[_type == "blogTexts"][0]{
        "pageTitle":    coalesce(pageTitle[$lang], pageTitle.en),
        "pageSubtitle": coalesce(pageSubtitle[$lang], pageSubtitle.en),
        "relatedPosts": coalesce(relatedPosts[$lang], relatedPosts.en),
        "ctaReplyNote": coalesce(ctaReplyNote[$lang], ctaReplyNote.en)
      }`,
      { lang },
    ),
  );
}

export function getServices(lang: Locale): Promise<ServiceCard[]> {
  return cached(`getServices:${lang}`, () => sanityClient.fetch(
    `*[_type == "service"] | order(order asc) {
      "name":            coalesce(name[$lang], name.en),
      "cardDescription": coalesce(cardDescription[$lang], cardDescription.en),
      "cardButtonText":  coalesce(cardButtonText[$lang], cardButtonText.en),
      "cardIconUrl":     cardIcon.asset->url,
      "slug":            coalesce(slug[$lang].current, slug.en.current)
    }`,
    { lang },
  ));
}
