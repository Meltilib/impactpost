import { defineType, defineArrayMember } from 'sanity';

export const blockContent = defineType({
  name: 'blockContent',
  title: 'Body Content',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        { title: 'Normal', value: 'normal' },
        { title: 'H2', value: 'h2' },
        { title: 'H3', value: 'h3' },
        { title: 'H4', value: 'h4' },
        { title: 'Quote', value: 'blockquote' },
      ],
      lists: [
        { title: 'Bullet', value: 'bullet' },
        { title: 'Numbered', value: 'number' },
      ],
      marks: {
        decorators: [
          { title: 'Bold', value: 'strong' },
          { title: 'Italic', value: 'em' },
          { title: 'Underline', value: 'underline' },
        ],
        annotations: [
          {
            name: 'link',
            type: 'object',
            title: 'Link',
            fields: [
              {
                name: 'href',
                type: 'url',
                title: 'URL',
                validation: (Rule) =>
                  Rule.uri({
                    scheme: ['http', 'https', 'mailto', 'tel'],
                  }),
              },
              {
                name: 'openInNewTab',
                type: 'boolean',
                title: 'Open in new tab',
                initialValue: false,
              },
            ],
          },
        ],
      },
    }),
    defineArrayMember({
      type: 'image',
      options: { hotspot: true },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alt Text',
          description: 'Important for accessibility and SEO',
        },
        {
          name: 'caption',
          type: 'string',
          title: 'Caption',
        },
      ],
    }),
    // Lead Paragraph (Drop Cap)
    defineArrayMember({
      type: 'object',
      name: 'leadParagraph',
      title: 'Lead Paragraph (Drop Cap)',
      fields: [
        {
          name: 'text',
          type: 'text',
          title: 'Paragraph Text',
          rows: 4,
          validation: (Rule) => Rule.required(),
        },
      ],
      preview: {
        select: { text: 'text' },
        prepare({ text }) {
          return {
            title: 'Lead Paragraph',
            subtitle: text?.slice(0, 60) + '...',
          };
        },
      },
    }),
    // Styled Quote Block
    defineArrayMember({
      type: 'object',
      name: 'styledQuote',
      title: 'Featured Quote',
      fields: [
        {
          name: 'quote',
          type: 'text',
          title: 'Quote Text',
          rows: 3,
          validation: (Rule) => Rule.required(),
        },
        {
          name: 'attribution',
          type: 'string',
          title: 'Attribution (optional)',
        },
        {
          name: 'style',
          type: 'string',
          title: 'Style',
          options: {
            list: [
              { title: 'Teal', value: 'teal' },
              { title: 'Coral', value: 'coral' },
              { title: 'Purple', value: 'purple' },
            ],
          },
          initialValue: 'teal',
        },
      ],
      preview: {
        select: { quote: 'quote', style: 'style' },
        prepare({ quote, style }) {
          return {
            title: 'Featured Quote',
            subtitle: `[${style}] ${quote?.slice(0, 50)}...`,
          };
        },
      },
    }),
    // Key Takeaways Box
    defineArrayMember({
      type: 'object',
      name: 'keyTakeaways',
      title: 'Key Takeaways Box',
      fields: [
        {
          name: 'items',
          type: 'array',
          of: [{ type: 'string' }],
          title: 'Takeaway Items',
          validation: (Rule) => Rule.required().min(1),
        },
      ],
      preview: {
        select: { items: 'items' },
        prepare({ items }) {
          return {
            title: 'Key Takeaways',
            subtitle: `${items?.length || 0} items`,
          };
        },
      },
    }),
    // Callout Box
    defineArrayMember({
      type: 'object',
      name: 'calloutBox',
      title: 'Callout Box',
      fields: [
        {
          name: 'title',
          type: 'string',
          title: 'Title (optional)',
        },
        {
          name: 'content',
          type: 'text',
          title: 'Content',
          rows: 4,
          validation: (Rule) => Rule.required(),
        },
        {
          name: 'variant',
          type: 'string',
          title: 'Variant',
          options: {
            list: [
              { title: 'Info (Blue)', value: 'info' },
              { title: 'Warning (Yellow)', value: 'warning' },
              { title: 'Success (Green)', value: 'success' },
              { title: 'Note (Gray)', value: 'note' },
            ],
          },
          initialValue: 'info',
        },
      ],
      preview: {
        select: { title: 'title', variant: 'variant' },
        prepare({ title, variant }) {
          return {
            title: title || 'Callout Box',
            subtitle: `[${variant}]`,
          };
        },
      },
    }),
  ],
});
