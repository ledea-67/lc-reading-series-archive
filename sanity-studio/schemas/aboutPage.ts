import { defineType, defineField } from 'sanity';

export const aboutPageType = defineType({
  name: 'aboutPage',
  title: 'About Page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Page title',
      type: 'string',
      description: 'Main heading for the About page.',
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'subtitle',
      title: 'Page subtitle',
      type: 'string',
      description:
        'Optional subtitle shown under the main title (e.g. “A living record of the Reading Series”).',
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [{ type: 'block' }],
      description:
        'Rich text body for the About page. Use headings and paragraphs to structure the content.',
    }),
  ],
});

