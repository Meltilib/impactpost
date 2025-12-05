import { defineType, defineField } from 'sanity';

export const category = defineType({
  name: 'category',
  title: 'Content Pillar',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'color',
      title: 'Theme Color',
      type: 'string',
      description: 'Tailwind background class (e.g., bg-brand-purple)',
      options: {
        list: [
          { title: 'Purple', value: 'bg-brand-purple' },
          { title: 'Coral', value: 'bg-brand-coral' },
          { title: 'Teal', value: 'bg-brand-teal' },
          { title: 'Yellow', value: 'bg-brand-yellow' },
          { title: 'Blue', value: 'bg-brand-blue' },
          { title: 'Dark', value: 'bg-brand-dark' },
        ],
      },
    }),
    defineField({
      name: 'textColor',
      title: 'Text Color',
      type: 'string',
      description: 'Tailwind text class',
      options: {
        list: [
          { title: 'White', value: 'text-white' },
          { title: 'Black', value: 'text-black' },
        ],
      },
      initialValue: 'text-white',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      color: 'color',
    },
    prepare({ title, color }) {
      return {
        title,
        subtitle: color,
      };
    },
  },
});
