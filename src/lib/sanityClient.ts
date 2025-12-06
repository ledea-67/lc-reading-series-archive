/**
 * Sanity Client
 *
 * Configured client for fetching data from Sanity CMS.
 * Uses environment variables for project ID, dataset, API version, and read token.
 */
import { createClient } from '@sanity/client';

// Prefer Astro/Vite env, but fall back to process.env so that
// Vercel's build-time environment variables are always honored.
const projectId =
  import.meta.env.SANITY_PROJECT_ID ?? process.env.SANITY_PROJECT_ID;
const dataset =
  import.meta.env.SANITY_DATASET ??
  process.env.SANITY_DATASET ??
  'production';
const apiVersion =
  import.meta.env.SANITY_API_VERSION ??
  process.env.SANITY_API_VERSION ??
  '2025-01-01';
const token =
  import.meta.env.SANITY_READ_TOKEN ?? process.env.SANITY_READ_TOKEN;

// Log non-sensitive Sanity client configuration at build time.
const sanityBuildMode = import.meta.env?.MODE ?? process.env.NODE_ENV ?? 'unknown';
console.log(
  '[sanityClient] projectId =',
  projectId,
  '| dataset =',
  dataset,
  '| apiVersion =',
  apiVersion,
  '| hasToken =',
  Boolean(token),
  '| mode =',
  sanityBuildMode,
);

if (!projectId) {
  throw new Error('Missing SANITY_PROJECT_ID environment variable');
}

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true, // Use CDN for faster reads in production
  token, // Read-only token for authenticated requests
});
