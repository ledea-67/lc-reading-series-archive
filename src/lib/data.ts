/**
 * Data Module
 *
 * Provides unified access to writer data, supporting both JSON and Sanity backends.
 * The data source is controlled by the USE_SANITY environment variable.
 *
 * When USE_SANITY=true: Fetches from Sanity CMS (requires valid Sanity credentials)
 * When USE_SANITY is unset or false: Uses local JSON file
 */
import type { Writer, WritersData, WritersMetadata } from '../types/writer';

// Resolve USE_SANITY from either Vite/Astro env or raw process.env.
// This makes behavior consistent between local `.env.local` and
// Vercel's build-time environment variables.
const rawUseSanity = import.meta.env?.USE_SANITY ?? process.env.USE_SANITY;

// Normalize USE_SANITY. Accept:
// - boolean true/false
// - strings: "true", "1", "yes", "on" (case-insensitive, trimmed)
let useSanity = false;
if (typeof rawUseSanity === 'boolean') {
  useSanity = rawUseSanity;
} else if (typeof rawUseSanity === 'string') {
  const normalized = rawUseSanity.trim().toLowerCase();
  useSanity = ['true', '1', 'yes', 'on'].includes(normalized);
}

// Log how USE_SANITY is resolved at build time for debugging.
// This will appear in Astro/Vercel build logs.
const buildMode = import.meta.env?.MODE ?? process.env.NODE_ENV ?? 'unknown';
console.log(
  '[data] USE_SANITY:',
  rawUseSanity,
  `(${typeof rawUseSanity})`,
  '→ useSanity =',
  useSanity,
  '| mode =',
  buildMode,
);

// Module-level state populated at load time
let _writers: Writer[] = [];
let _metadata: WritersMetadata;

if (useSanity) {
  // Dynamic import to avoid loading Sanity client when not needed
  const { getWriters, getMetadata } = await import('./data-sanity');
  _writers = await getWriters();
  _metadata = getMetadata();
} else {
  // Static JSON import
  const writersJson = (await import('../data/writers.json')).default as WritersData;
  _writers = writersJson.writers;
  _metadata = writersJson.metadata;
}

/**
 * All writers from the data source.
 */
export const writers: Writer[] = _writers;

/**
 * Dataset metadata.
 */
export const metadata: WritersMetadata = _metadata;

/**
 * Get a single writer by their ID/slug.
 */
export function getWriterById(id: string): Writer | undefined {
  return writers.find((writer) => writer.id === id);
}

/**
 * Get all writers who appeared in a specific year.
 */
export function getWritersByYear(year: number): Writer[] {
  return writers.filter((writer) => writer.years.includes(year));
}

/**
 * Get all writers of a specific genre.
 * Handles compound genres like "fiction/poetry" by checking if the genre contains the search term.
 */
export function getWritersByGenre(genre: string): Writer[] {
  const searchGenre = genre.toLowerCase();
  return writers.filter((writer) =>
    writer.genre.toLowerCase().includes(searchGenre)
  );
}

/**
 * Get all years that have associated writers, sorted in descending order.
 * Excludes year 0 (unknown year).
 */
export function getAllYears(): number[] {
  const yearsSet = new Set<number>();

  for (const writer of writers) {
    for (const year of writer.years) {
      if (year !== 0) {
        yearsSet.add(year);
      }
    }
  }

  return Array.from(yearsSet).sort((a, b) => b - a);
}

/**
 * Get all writers with unknown year (year = 0).
 */
export function getWritersWithUnknownYear(): Writer[] {
  return writers.filter((writer) => writer.years.includes(0));
}

/**
 * Get all unique genres from the writers data.
 */
export function getAllGenres(): string[] {
  const genresSet = new Set<string>();

  for (const writer of writers) {
    // Split compound genres and add each part
    const parts = writer.genre.split('/');
    for (const part of parts) {
      genresSet.add(part.trim().toLowerCase());
    }
  }

  return Array.from(genresSet).sort();
}
