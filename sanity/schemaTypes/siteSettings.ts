import { defineField, defineType } from 'sanity';

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'isTickerActive',
      title: 'Enable Ticker',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'tickerItems',
      title: 'Ticker Items',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'text',
              title: 'Text',
              type: 'string',
              validation: (Rule) => Rule.required().max(160),
            }),
          ],
        },
      ],
      validation: (Rule) => Rule.max(12),
      description: 'Items scroll from left to right; first item appears immediately.',
      initialValue: [
        { text: 'BREAKING: New Cultural Centre Approved in Etobicoke' },
        { text: 'Youth Scholarship Applications Open until Nov 30' },
        { text: 'Community Business Awards Nominations Now Open' },
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Site Settings',
        subtitle: 'Ticker & global options',
      };
    },
  },
});
