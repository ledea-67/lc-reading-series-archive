/**
 * Sanity Image URL Builder
 *
 * Generates optimized image URLs from Sanity image references.
 * Handles automatic format selection (WebP/AVIF), resizing, and cropping.
 */
import { createImageUrlBuilder } from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

// Initialize the builder with project config
const builder = createImageUrlBuilder({
  projectId: import.meta.env.SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID || 'o7465upq',
  dataset: import.meta.env.SANITY_DATASET || process.env.SANITY_DATASET || 'production',
});

/**
 * Image reference shape from Sanity.
 * This is what we get back from GROQ queries with image fields.
 */
export interface SanityImageRef {
  _type: 'image';
  asset: {
    _ref: string;
    _type: 'reference';
  };
  hotspot?: {
    x: number;
    y: number;
    height: number;
    width: number;
  };
  crop?: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
}

/**
 * Options for generating image URLs.
 */
export interface ImageUrlOptions {
  width?: number;
  height?: number;
  quality?: number;
  fit?: 'clip' | 'crop' | 'fill' | 'fillmax' | 'max' | 'scale' | 'min';
}

/**
 * Default image sizes for the site.
 * These match the CSS requirements in WriterHero and WriterCard.
 */
export const IMAGE_SIZES = {
  // Writer detail page hero (200px display, 2x for retina)
  writerHero: { width: 400, height: 500 },
  // Writer card in grids (various sizes, max ~200px display)
  writerCard: { width: 400, height: 500 },
  // Thumbnail for smaller uses
  thumbnail: { width: 200, height: 250 },
} as const;

/**
 * Generate an optimized image URL from a Sanity image reference.
 *
 * @param source - Sanity image reference (from GROQ query)
 * @param options - Size and quality options
 * @returns Optimized CDN URL with auto format selection
 *
 * @example
 * // In an Astro component:
 * const imageUrl = getImageUrl(writer.photo, IMAGE_SIZES.writerHero);
 * // Returns: https://cdn.sanity.io/images/projectId/dataset/imageId-400x500.webp?...
 */
export function getImageUrl(
  source: SanityImageRef | SanityImageSource | null | undefined,
  options: ImageUrlOptions = {}
): string | null {
  if (!source) {
    return null;
  }

  const { width, height, quality = 80, fit = 'crop' } = options;

  let img = builder.image(source);

  if (width) {
    img = img.width(width);
  }
  if (height) {
    img = img.height(height);
  }

  img = img
    .fit(fit)
    .quality(quality)
    .auto('format'); // Serves WebP/AVIF to supporting browsers

  return img.url();
}

/**
 * Check if an image reference is valid and has an asset.
 */
export function hasValidImage(source: SanityImageRef | null | undefined): source is SanityImageRef {
  return !!(source?.asset?._ref);
}
