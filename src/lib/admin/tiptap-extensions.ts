import { Node } from '@tiptap/core';
import {
  KEY_TAKEAWAYS_CARD,
  KEY_TAKEAWAYS_ITEM,
  KEY_TAKEAWAYS_TITLE,
  STYLED_QUOTE_ATTRIBUTION,
  STYLED_QUOTE_TEXT,
  getStyledQuoteContainerClasses,
} from '@/lib/article-block-styles';

/**
 * LeadParagraph Extension
 * Block node that renders the drop-cap intro paragraph.
 */
export const LeadParagraphExtension = Node.create({
  name: 'leadParagraph',
  group: 'block',
  content: 'inline*',
  selectable: true,

  parseHTML() {
    return [
      { tag: 'p[data-type="lead-paragraph"]' },
      { tag: 'p.lead-paragraph' },
    ];
  },

  renderHTML() {
    return [
      'p',
      {
        'data-type': 'lead-paragraph',
        class:
          'lead-paragraph mb-6 leading-relaxed text-xl text-gray-800 first-letter:text-5xl first-letter:font-heavy first-letter:text-brand-purple first-letter:mr-2 first-letter:float-left first-letter:leading-none',
      },
      0,
    ];
  },
});

/**
 * StyledQuote Extension
 * Creates a custom block type for featured quotes with style variants
 */
export const StyledQuoteExtension = Node.create({
  name: 'styledQuote',
  group: 'block',
  atom: true,
  draggable: true,
  selectable: true,

  addAttributes() {
    return {
      quote: {
        default: '',
        parseHTML: (element) => element.getAttribute('data-quote') || '',
      },
      attribution: {
        default: '',
        parseHTML: (element) => element.getAttribute('data-attribution') || '',
      },
      style: {
        default: 'teal',
        parseHTML: (element) => element.getAttribute('data-style') || 'teal',
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="styled-quote"]',
        getAttrs: (element) => {
          const el = element as HTMLElement;
          const quote = el.getAttribute('data-quote') || el.textContent || '';
          const attribution = el.getAttribute('data-attribution') || el.querySelector('cite')?.textContent?.replace(/^—\s*/, '') || '';
          const style = el.getAttribute('data-style') || 'teal';
          return { quote, attribution, style };
        },
      },
      {
        tag: 'div.styled-quote',
        getAttrs: (element) => {
          const el = element as HTMLElement;
          const quote = el.textContent || '';
          const attribution = el.querySelector('cite')?.textContent?.replace(/^—\s*/, '') || '';
          return { quote, attribution, style: 'teal' };
        },
      },
      {
        tag: 'blockquote.styled-quote',
      },
      {
        tag: 'div[class*="border-brand"]',
      },
    ];
  },

  renderHTML({ node }) {
    return [
      'div',
      {
        'data-type': 'styled-quote',
        'data-quote': node.attrs.quote,
        'data-attribution': node.attrs.attribution,
        'data-style': node.attrs.style,
        class: getStyledQuoteContainerClasses(node.attrs.style as string),
      },
      [
        'blockquote',
        { class: STYLED_QUOTE_TEXT },
        `"${node.attrs.quote}"`,
      ],
      ...(node.attrs.attribution
        ? [
            [
              'cite',
              { class: STYLED_QUOTE_ATTRIBUTION },
              `— ${node.attrs.attribution}`,
            ],
          ]
        : []),
    ];
  },
});

/**
 * KeyTakeaways Extension
 * Creates a custom block type for key takeaway bullet lists
 */
export const KeyTakeawaysExtension = Node.create({
  name: 'keyTakeaways',
  group: 'block',
  atom: true,
  draggable: true,
  selectable: true,

  addAttributes() {
    return {
      items: {
        default: [],
        parseHTML: (element) => {
          const data = element.getAttribute('data-items');
          return data ? JSON.parse(data) : [];
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="key-takeaways"]',
        getAttrs: (element) => {
          const el = element as HTMLElement;
          const data = el.getAttribute('data-items');
          if (data) {
            try {
              return { items: JSON.parse(data) };
            } catch (e) {
              // fall through to text extraction
            }
          }
          const items = Array.from(el.querySelectorAll('li')).map((li) => li.textContent || '').filter(Boolean);
          return { items };
        },
      },
      {
        tag: 'div.key-takeaways',
        getAttrs: (element) => {
          const items = Array.from((element as HTMLElement).querySelectorAll('li')).map((li) => li.textContent || '').filter(Boolean);
          return { items };
        },
      },
    ];
  },

  renderHTML({ node }) {
    const items = node.attrs.items as string[];
    return [
      'div',
      {
        'data-type': 'key-takeaways',
        'data-items': JSON.stringify(items),
        class: KEY_TAKEAWAYS_CARD,
      },
      [
        'div',
        { class: KEY_TAKEAWAYS_TITLE },
        'Key Takeaways',
      ],
      [
        'ul',
        { class: 'list-disc list-inside space-y-1 text-sm' },
        ...items.map((item) => ['li', { class: KEY_TAKEAWAYS_ITEM }, item]),
      ],
    ];
  },
});

/**
 * CalloutBox Extension
 * Creates a custom block type for callout/alert boxes
 */
export const CalloutBoxExtension = Node.create({
  name: 'calloutBox',
  group: 'block',
  atom: true,
  draggable: true,
  selectable: true,

  addAttributes() {
    return {
      title: {
        default: '',
        parseHTML: (element) => element.getAttribute('data-title') || '',
      },
      content: {
        default: '',
        parseHTML: (element) => element.getAttribute('data-content') || '',
      },
      variant: {
        default: 'info',
        parseHTML: (element) => element.getAttribute('data-variant') || 'info',
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="callout-box"]',
      },
      {
        tag: 'div.callout-box',
      },
      {
        tag: 'div.callout-box-preview',
      },
    ];
  },

  renderHTML({ node }) {
    const variantColors: Record<string, string> = {
      info: 'bg-blue-50 border-blue-300',
      warning: 'bg-yellow-50 border-yellow-300',
      success: 'bg-green-50 border-green-300',
      note: 'bg-gray-50 border-gray-300',
    };

    return [
      'div',
      {
        'data-type': 'callout-box',
        'data-title': node.attrs.title,
        'data-content': node.attrs.content,
        'data-variant': node.attrs.variant,
        class: `callout-box-preview border-l-4 p-3 ${variantColors[node.attrs.variant] || variantColors.info}`,
      },
      ...(node.attrs.title
        ? [
            [
              'div',
              { class: 'font-bold text-sm mb-1' },
              node.attrs.title,
            ],
          ]
        : []),
      [
        'div',
        { class: 'text-sm' },
        node.attrs.content,
      ],
    ];
  },
});
