/**
 * Sanity-backed Data Module
 *
 * Provides the same API as the JSON-backed data.ts but fetches from Sanity.
 * This module is used when USE_SANITY=true.
 */
import { sanityClient } from './sanityClient';
import type { Writer, WritersMetadata } from '../types/writer';

/**
 * GROQ projection that maps Sanity writer documents to the Writer type.
 * This ensures consistent shape regardless of data source.
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
  "media": {
    "audioClips": media.audioClips[]{
      title,
      description,
      "fileUrl": audioFile.asset->url,
      externalUrl
    },
    "videoClips": media.videoClips[]{
      title,
      description,
      "fileUrl": videoFile.asset->url,
      externalUrl
    }
  },
  "confidence": coalesce(confidence, "medium"),
  "needsReview": coalesce(needsReview, false)
}`;

/**
 * Cache for writer data to avoid repeated fetches during static build.
 * Astro builds are single-process, so module-level caching works well.
 */
let cachedWriters: Writer[] | null = null;

/**
 * Fetch all writers from Sanity, sorted by last name then first names.
 */
async function fetchAllWriters(): Promise<Writer[]> {
  if (cachedWriters) {
    return cachedWriters;
  }

  const query = `*[_type == "writer"] | order(lastName asc, firstNames asc) ${writerProjection}`;
  const results = await sanityClient.fetch<Writer[]>(query);

  cachedWriters = results;
  return results;
}

/**
 * All writers from Sanity.
 * Note: This is async, unlike the JSON version which is sync.
 * The switch in data.ts handles this difference.
 */
export async function getWriters(): Promise<Writer[]> {
  return fetchAllWriters();
}

/**
 * Metadata about the dataset.
 * Since this is now managed in Sanity, we return a static object.
 * Could be extended to fetch from a Sanity singleton document if needed.
 */
export function getMetadata(): WritersMetadata {
  return {
    project: 'Lewis & Clark College Reading Series Archive',
    version: '1.0-sanity',
    lastUpdated: new Date().toISOString().split('T')[0],
    totalWriters: cachedWriters?.length ?? 0,
    status: 'sanity',
    notes: 'Data sourced from Sanity CMS',
  };
}

/**
 * Get a single writer by their slug/ID.
 */
export async function getWriterById(id: string): Promise<Writer | undefined> {
  const query = `*[_type == "writer" && slug.current == $id][0] ${writerProjection}`;
  const result = await sanityClient.fetch<Writer | null>(query, { id });
  return result ?? undefined;
}

/**
 * Get all writers who appeared in a specific year.
 */
export async function getWritersByYear(year: number): Promise<Writer[]> {
  const query = `*[_type == "writer" && $year in years] | order(lastName asc, firstNames asc) ${writerProjection}`;
  return sanityClient.fetch<Writer[]>(query, { year });
}

/**
 * Get all writers of a specific genre.
 * Matches if the genre is in the genres array.
 */
export async function getWritersByGenre(genre: string): Promise<Writer[]> {
  const searchGenre = genre.toLowerCase();
  const query = `*[_type == "writer" && $genre in genres] | order(lastName asc, firstNames asc) ${writerProjection}`;
  return sanityClient.fetch<Writer[]>(query, { genre: searchGenre });
}

/**
 * Get all years that have associated writers, sorted descending.
 * Excludes year 0 (unknown year).
 */
export async function getAllYears(): Promise<number[]> {
  const query = `array::unique(*[_type == "writer"].years[@ != 0]) | order(@ desc)`;
  return sanityClient.fetch<number[]>(query);
}

/**
 * Get all writers with unknown year (year = 0).
 */
export async function getWritersWithUnknownYear(): Promise<Writer[]> {
  const query = `*[_type == "writer" && 0 in years] | order(lastName asc, firstNames asc) ${writerProjection}`;
  return sanityClient.fetch<Writer[]>(query);
}

/**
 * Get all unique genres from the writers data.
 */
export async function getAllGenres(): Promise<string[]> {
  const query = `array::unique(*[_type == "writer"].genres[])`;
  const genres = await sanityClient.fetch<string[]>(query);
  return genres.sort();
}
