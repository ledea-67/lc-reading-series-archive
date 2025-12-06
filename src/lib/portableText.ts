import { toHTML } from '@portabletext/to-html';

/**
 * Render a Portable Text array to an HTML string.
 * Safe to use during Astro's server-side build.
 */
export function portableTextToHtml(value: unknown): string {
  if (!value || !Array.isArray(value)) return '';
  return toHTML(value as any[]);
}

