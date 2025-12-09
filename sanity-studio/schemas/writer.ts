import { defineType, defineField } from 'sanity';

export const writerType = defineType({
  name: 'writer',
  title: 'Writer',
  type: 'document',
  fields: [
    defineField({
      name: 'displayName',
      title: 'Display name',
      type: 'string',
      description:
        'How this writer\'s name should appear on the site (e.g. "Ada Limón", "J. Hillis Miller").',
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'lastName',
      title: 'Last name',
      type: 'string',
      description:
        'Used for alphabetical sorting. For single-name authors, repeat the full name here.',
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'firstNames',
      title: 'First names / initials',
      type: 'string',
      description:
        'Optional. Everything before the last name (e.g. "Ada", "J. Hillis"). Initials and multiple names are welcome.',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description:
        'Stable URL id (e.g. "ondaatje-michael"). For imported records this will already be set; avoid regenerating for existing writers.',
      options: {
        source: 'displayName',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'years',
      title: 'Appearance years',
      type: 'array',
      of: [{ type: 'number' }],
      description:
        'Years this writer appeared in the Reading Series. No hard range limits so the archive can grow backward/forward.',
      validation: (Rule) => Rule.min(1),
    }),
    defineField({
      name: 'genres',
      title: 'Genres',
      type: 'array',
      of: [{ type: 'string' }],
      description:
        'Normalized genres (e.g. ["poetry"], ["fiction", "nonfiction"]). Imported from the existing genre string.',
      validation: (Rule) => Rule.min(1),
    }),
    defineField({
      name: 'bio',
      title: 'Biography',
      type: 'text',
      rows: 5,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'notableWorks',
      title: 'Notable works',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'awards',
      title: 'Awards & honors',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'wikipediaUrl',
      title: 'Wikipedia URL',
      type: 'url',
    }),
    defineField({
      name: 'officialWebsite',
      title: 'Official website',
      type: 'url',
    }),
    defineField({
      name: 'photo',
      title: 'Photo',
      type: 'image',
      description: 'Writer headshot or portrait photo.',
      options: {
        hotspot: true, // Enables UI for selecting focal point
      },
      fields: [
        defineField({
          name: 'attribution',
          title: 'Attribution',
          type: 'string',
          description: 'Photo credit (e.g. "John Smith Photography")',
        }),
        defineField({
          name: 'license',
          title: 'License',
          type: 'string',
          description: 'License type (e.g. "CC BY 2.0", "Press", "Fair Use")',
        }),
        defineField({
          name: 'alt',
          title: 'Alt text',
          type: 'string',
          description: 'Describe the image for accessibility',
        }),
      ],
    }),
    defineField({
      name: 'media',
      title: 'Media (audio / video)',
      type: 'object',
      description:
        'Audio and video recordings of readings, interviews, or other appearances. Each clip can be either uploaded directly or linked from an external platform.',
      fields: [
        defineField({
          name: 'audioClips',
          title: 'Audio clips',
          type: 'array',
          of: [
            {
              type: 'object',
              title: 'Audio clip',
              fields: [
                defineField({
                  name: 'title',
                  title: 'Title',
                  type: 'string',
                  description: 'A descriptive title for this recording.',
                  validation: (Rule) => Rule.required(),
                }),
                defineField({
                  name: 'description',
                  title: 'Description',
                  type: 'text',
                  rows: 2,
                  description: 'Optional context about this recording.',
                }),
                defineField({
                  name: 'audioFile',
                  title: 'Upload audio file',
                  type: 'file',
                  options: {
                    accept: 'audio/*',
                  },
                  description:
                    'Upload an audio file directly (MP3, WAV, etc.). Best for recordings under 50MB. Files are served from Sanity\'s CDN and play in the browser\'s native audio player.',
                }),
                defineField({
                  name: 'externalUrl',
                  title: 'External URL',
                  type: 'url',
                  description:
                    'Link to audio hosted elsewhere (SoundCloud, podcast host, etc.). Use this for larger files or when the recording already exists on another platform.',
                }),
              ],
              validation: (Rule) =>
                Rule.custom((clip) => {
                  if (!clip) return true;
                  const hasFile = clip.audioFile?.asset;
                  const hasUrl = clip.externalUrl;
                  if (!hasFile && !hasUrl) {
                    return 'Please provide either an uploaded audio file or an external URL.';
                  }
                  return true;
                }),
              preview: {
                select: {
                  title: 'title',
                  hasFile: 'audioFile.asset',
                  url: 'externalUrl',
                },
                prepare({ title, hasFile, url }) {
                  const source = hasFile ? '📁 Uploaded' : url ? '🔗 External' : '⚠️ No source';
                  return {
                    title: title || 'Untitled audio',
                    subtitle: source,
                  };
                },
              },
            },
          ],
        }),
        defineField({
          name: 'videoClips',
          title: 'Video clips',
          type: 'array',
          of: [
            {
              type: 'object',
              title: 'Video clip',
              fields: [
                defineField({
                  name: 'title',
                  title: 'Title',
                  type: 'string',
                  description: 'A descriptive title for this video.',
                  validation: (Rule) => Rule.required(),
                }),
                defineField({
                  name: 'description',
                  title: 'Description',
                  type: 'text',
                  rows: 2,
                  description: 'Optional context about this video.',
                }),
                defineField({
                  name: 'videoFile',
                  title: 'Upload video file',
                  type: 'file',
                  options: {
                    accept: 'video/*',
                  },
                  description:
                    'Upload a video file directly (MP4, WebM, etc.). Best for short clips under 2-3 minutes. Larger videos may buffer on slow connections since there\'s no adaptive streaming.',
                }),
                defineField({
                  name: 'externalUrl',
                  title: 'External URL',
                  type: 'url',
                  description:
                    'Link to video hosted on YouTube, Vimeo, or another platform. Recommended for longer recordings — these services provide adaptive streaming for better playback quality.',
                }),
              ],
              validation: (Rule) =>
                Rule.custom((clip) => {
                  if (!clip) return true;
                  const hasFile = clip.videoFile?.asset;
                  const hasUrl = clip.externalUrl;
                  if (!hasFile && !hasUrl) {
                    return 'Please provide either an uploaded video file or an external URL.';
                  }
                  return true;
                }),
              preview: {
                select: {
                  title: 'title',
                  hasFile: 'videoFile.asset',
                  url: 'externalUrl',
                },
                prepare({ title, hasFile, url }) {
                  const source = hasFile ? '📁 Uploaded' : url ? '🔗 External' : '⚠️ No source';
                  return {
                    title: title || 'Untitled video',
                    subtitle: source,
                  };
                },
              },
            },
          ],
        }),
      ],
    }),
    defineField({
      name: 'confidence',
      title: 'Data confidence',
      type: 'string',
      options: {
        list: [
          { title: 'High', value: 'high' },
          { title: 'Medium', value: 'medium' },
          { title: 'Low', value: 'low' },
        ],
      },
    }),
    defineField({
      name: 'needsReview',
      title: 'Needs review',
      type: 'boolean',
    }),
  ],
  orderings: [
    {
      title: 'Last Name, A-Z',
      name: 'lastNameAsc',
      by: [
        { field: 'lastName', direction: 'asc' },
        { field: 'firstNames', direction: 'asc' },
      ],
    },
    {
      title: 'Last Name, Z-A',
      name: 'lastNameDesc',
      by: [
        { field: 'lastName', direction: 'desc' },
        { field: 'firstNames', direction: 'desc' },
      ],
    },
  ],
  preview: {
    select: {
      title: 'displayName',
      years: 'years',
      genres: 'genres',
    },
    prepare({ title, years, genres }) {
      const yearsList = Array.isArray(years) && years.length > 0 ? years.join(', ') : '';
      const genreList =
        Array.isArray(genres) && genres.length > 0 ? genres.join(', ') : '';
      const bits = [];
      if (yearsList) bits.push(`Years: ${yearsList}`);
      if (genreList) bits.push(genreList);
      return {
        title,
        subtitle: bits.join(' - ') || undefined,
      };
    },
  },
});
