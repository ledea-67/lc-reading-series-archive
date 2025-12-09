import { defineType, defineField } from 'sanity';

export const siteSettingsType = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Site title',
      type: 'string',
      description: 'Main site title shown in the browser and metadata.',
    }),
    defineField({
      name: 'heroIntro',
      title: 'Homepage hero intro',
      type: 'string',
      description: 'Small word above the hero title (e.g. "The").',
    }),
    defineField({
      name: 'heroTitle',
      title: 'Homepage hero title',
      type: 'string',
      description:
        'Main heading on the homepage (e.g. "Lewis & Clark College Reading Series").',
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'Homepage hero subtitle',
      type: 'string',
      description: 'Secondary line beneath the hero title (e.g. "Archive").',
    }),
    defineField({
      name: 'heroDescription',
      title: 'Homepage hero description',
      type: 'text',
      rows: 4,
      description:
        'Short paragraph that appears under the hero metadata on the homepage.',
    }),
    defineField({
      name: 'homeTeaser',
      title: 'Homepage teaser (about the archive)',
      type: 'array',
      of: [{ type: 'block' }],
      description:
        'Rich text used in the "About the archive" teaser on the homepage.',
    }),
    defineField({
      name: 'featuredWriters',
      title: 'Featured writers',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'writer' }],
        },
      ],
      description:
        'Select up to 6 writers to feature on the homepage. Drag to reorder.',
      validation: (Rule) => Rule.max(6).unique(),
    }),
  ],
});

