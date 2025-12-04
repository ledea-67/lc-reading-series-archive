import type { Writer, WritersData } from '../types/writer';
import writersJson from '../data/writers.json';

const data = writersJson as WritersData;

export const writers: Writer[] = data.writers;
export const metadata = data.metadata;

/**
 * Get a single writer by their ID
 */
export function getWriterById(id: string): Writer | undefined {
  return writers.find((writer) => writer.id === id);
}

/**
 * Get all writers who appeared in a specific year
 */
export function getWritersByYear(year: number): Writer[] {
  return writers.filter((writer) => writer.years.includes(year));
}

/**
 * Get all writers of a specific genre
 * Handles compound genres like "fiction/poetry" by checking if the genre contains the search term
 */
export function getWritersByGenre(genre: string): Writer[] {
  const searchGenre = genre.toLowerCase();
  return writers.filter((writer) =>
    writer.genre.toLowerCase().includes(searchGenre)
  );
}

/**
 * Get all years that have associated writers, sorted in descending order
 * Excludes year 0 (unknown year)
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
 * Get all writers with unknown year (year = 0)
 */
export function getWritersWithUnknownYear(): Writer[] {
  return writers.filter((writer) => writer.years.includes(0));
}

/**
 * Get all unique genres from the writers data
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
