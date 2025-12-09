import { sanityClient } from './sanityClient';
import type { Writer } from '../types/writer';

type PortableText = unknown[];

/**
 * Writer projection for featured writers.
 * Matches the projection in data-sanity.ts for consistency.
 */
const writerProjection = `{
  "id": slug.current,
  "name": displayName,
  lastName,
  firstNames,
  years,
  "genre": array::join(genres, "/"),
  bio,
  "notableWorks": coalesce(notableWorks, []),
  "awards": coalesce(awards, []),
  wikipediaUrl,
  officialWebsite,
  "photo": {
    "source": select(
      defined(photo.asset) => "sanity",
      "unknown"
    ),
    "url": photo.asset->url,
    "license": photo.license,
    "attribution": photo.attribution,
    "alt": photo.alt,
    "status": select(
      defined(photo.asset) => "available",
      "needs_acquisition"
    ),
    "imageRef": select(
      defined(photo.asset) => {
        "_type": "image",
        "asset": photo.asset,
        "hotspot": photo.hotspot,
        "crop": photo.crop
      },
      null
    )
  },
  "confidence": coalesce(confidence, "medium"),
  "needsReview": coalesce(needsReview, false)
}`;

export interface SiteSettingsDoc {
  title?: string;
  heroIntro?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  heroDescription?: string;
  homeTeaser?: PortableText;
  featuredWriters?: Writer[];
}

interface AboutPageDoc {
  title: string;
  subtitle?: string;
  body?: PortableText;
}

export async function getSiteSettings(): Promise<SiteSettingsDoc | null> {
  const query = `*[_type == "siteSettings"][0]{
    title,
    heroIntro,
    heroTitle,
    heroSubtitle,
    heroDescription,
    homeTeaser,
    "featuredWriters": featuredWriters[]->${writerProjection}
  }`;
  return sanityClient.fetch<SiteSettingsDoc | null>(query);
}

export async function getAboutPage(): Promise<AboutPageDoc | null> {
  const query = `*[_type == "aboutPage"][0]{
    title,
    subtitle,
    body
  }`;
  return sanityClient.fetch<AboutPageDoc | null>(query);
}

