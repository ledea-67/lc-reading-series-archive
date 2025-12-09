/**
 * Sanity image asset reference for building CDN URLs.
 */
export interface SanityImageAsset {
  _ref: string;
  _type: 'reference';
}

/**
 * Sanity image hotspot for focal point cropping.
 */
export interface SanityImageHotspot {
  x: number;
  y: number;
  height: number;
  width: number;
}

/**
 * Sanity image crop settings.
 */
export interface SanityImageCrop {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

/**
 * Full Sanity image reference with hotspot/crop data.
 * Used to generate optimized CDN URLs via @sanity/image-url.
 */
export interface SanityImageRef {
  _type: 'image';
  asset: SanityImageAsset;
  hotspot?: SanityImageHotspot;
  crop?: SanityImageCrop;
}

export interface WriterPhoto {
  source: string;
  url: string | null;
  license: string | null;
  attribution: string | null;
  alt: string | null;
  status: 'available' | 'needs_acquisition' | string;
  /**
   * Sanity image reference for CDN URL generation.
   * Present when photo is uploaded to Sanity; null for legacy local images.
   */
  imageRef?: SanityImageRef | null;
}

/**
 * Audio clip - either uploaded directly to Sanity or linked externally.
 */
export interface AudioClip {
  title: string;
  description?: string | null;
  /** CDN URL for directly uploaded audio file */
  fileUrl?: string | null;
  /** URL to externally hosted audio (SoundCloud, podcast host, etc.) */
  externalUrl?: string | null;
}

/**
 * Video clip - either uploaded directly to Sanity or linked externally.
 */
export interface VideoClip {
  title: string;
  description?: string | null;
  /** CDN URL for directly uploaded video file */
  fileUrl?: string | null;
  /** URL to externally hosted video (YouTube, Vimeo, etc.) */
  externalUrl?: string | null;
}

/**
 * Media collection for a writer - audio and video recordings.
 */
export interface WriterMedia {
  audioClips?: AudioClip[] | null;
  videoClips?: VideoClip[] | null;
}

export interface Writer {
  id: string;
  name: string;
  /**
   * Optional structured name parts for sorting.
   * Present for Sanity-backed data; omitted in legacy JSON.
   */
  lastName?: string;
  firstNames?: string | null;
  years: number[];
  genre: string;
  bio: string;
  notableWorks: string[];
  awards: string[];
  wikipediaUrl: string | null;
  officialWebsite: string | null;
  photo: WriterPhoto;
  /**
   * Audio and video recordings of readings, interviews, etc.
   * Present for Sanity-backed data; omitted in legacy JSON.
   */
  media?: WriterMedia | null;
  confidence: 'high' | 'medium' | 'low';
  needsReview: boolean;
}

export interface WritersMetadata {
  project: string;
  version: string;
  lastUpdated: string;
  totalWriters: number;
  status: string;
  notes: string;
}

export interface WritersData {
  metadata: WritersMetadata;
  writers: Writer[];
}
