/**
 * Sanity Client
 *
 * Configured client for fetching data from Sanity CMS.
 * Uses environment variables for project ID, dataset, API version, and read token.
 */
import { createClient } from '@sanity/client';

const projectId = import.meta.env.SANITY_PROJECT_ID;
const dataset = import.meta.env.SANITY_DATASET || 'production';
const apiVersion = import.meta.env.SANITY_API_VERSION || '2025-01-01';
const token = import.meta.env.SANITY_READ_TOKEN;

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
