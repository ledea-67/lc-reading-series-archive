export interface WriterPhoto {
  source: string;
  url: string | null;
  license: string | null;
  attribution: string | null;
  alt: string | null;
  status: 'available' | 'needs_acquisition' | string;
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
