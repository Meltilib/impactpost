import { defineType, defineField } from 'sanity';

export const event = defineType({
  name: 'event',
  title: 'Event',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
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
      name: 'eventDate',
      title: 'Date & Time',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      description: 'Venue name and address, or "Virtual" for online events',
    }),
    defineField({
      name: 'type',
      title: 'Event Type',
      type: 'string',
      options: {
        list: [
          { title: 'Culture', value: 'Culture' },
          { title: 'Networking', value: 'Networking' },
          { title: 'Community', value: 'Community' },
          { title: 'Literature', value: 'Literature' },
          { title: 'Workshop', value: 'Workshop' },
          { title: 'Conference', value: 'Conference' },
        ],
      },
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'registrationUrl',
      title: 'Registration Link',
      type: 'url',
      description: 'External link for event registration',
    }),
    defineField({
      name: 'image',
      title: 'Event Image',
      type: 'image',
      options: { hotspot: true },
    }),
  ],
  orderings: [
    {
      title: 'Event Date, Upcoming',
      name: 'eventDateAsc',
      by: [{ field: 'eventDate', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      date: 'eventDate',
      type: 'type',
      media: 'image',
    },
    prepare({ title, date, type, media }) {
      const formattedDate = date
        ? new Date(date).toLocaleDateString('en-CA', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })
        : 'No date';
      return {
        title,
        subtitle: `${formattedDate} • ${type || 'Event'}`,
        media,
      };
    },
  },
});
