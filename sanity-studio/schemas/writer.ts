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
      fields: [
        defineField({
          name: 'audioClips',
          title: 'Audio clips',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                defineField({
                  name: 'title',
                  title: 'Title',
                  type: 'string',
                  validation: (Rule) => Rule.required(),
                }),
                defineField({
                  name: 'description',
                  title: 'Description',
                  type: 'text',
                }),
                defineField({
                  name: 'url',
                  title: 'URL',
                  type: 'url',
                  description:
                    'Direct URL to the audio file or audio-as-video (L&C media server, podcast host, YouTube, etc.).',
                  validation: (Rule) => Rule.required(),
                }),
              ],
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
              fields: [
                defineField({
                  name: 'title',
                  title: 'Title',
                  type: 'string',
                  validation: (Rule) => Rule.required(),
                }),
                defineField({
                  name: 'description',
                  title: 'Description',
                  type: 'text',
                }),
                defineField({
                  name: 'url',
                  title: 'URL',
                  type: 'url',
                  description:
                    'Direct URL or embed URL (L&C media server, YouTube, Vimeo, Panopto, etc.).',
                  validation: (Rule) => Rule.required(),
                }),
              ],
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
