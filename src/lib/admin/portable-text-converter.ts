import {
  KEY_TAKEAWAYS_CARD,
  KEY_TAKEAWAYS_ITEM,
  KEY_TAKEAWAYS_TITLE,
  STYLED_QUOTE_ATTRIBUTION,
  STYLED_QUOTE_TEXT,
  getStyledQuoteContainerClasses,
} from '@/lib/article-block-styles';

/**
 * Bi-directional converter between Sanity Portable Text and HTML/Tiptap formats
 * Handles all custom block types and standard Portable Text structures
 */

interface PortableBlock {
  _type: string;
  _key?: string;
  [key: string]: unknown;
}

interface TextSpan {
  text: string;
  marks?: string[];
  [key: string]: unknown;
}

interface TiptapMark {
  type: string;
}

/**
 * Convert Sanity Portable Text to HTML string for Tiptap editor
 * Maps: leadParagraph, styledQuote, keyTakeaways, calloutBox, block, image
 */
export function convertPortableTextToHTML(portableText: unknown): string {
  if (!portableText || typeof portableText !== 'object') return '';

  const blocks = normalizeLegacyPortableText(Array.isArray(portableText) ? portableText : []);
  
  return blocks.map((block: unknown) => {
    const b = block as Record<string, unknown>;
    const blockType = b._type as string;

    switch (blockType) {
      case 'leadParagraph':
        return convertBlockToHTML({
          ...b,
          style: 'lead',
        });

      case 'styledQuote':
        const quote = b.quote as string;
        const attribution = b.attribution as string;
        const style = b.style as string;
        const cite = attribution
          ? `<cite class="${STYLED_QUOTE_ATTRIBUTION}">— ${escapeHtml(attribution)}</cite>`
          : '';
        const cardClasses = getStyledQuoteContainerClasses(style);
        return `<div data-type="styled-quote" data-quote="${escapeHtml(quote)}" data-attribution="${escapeHtml(
          attribution || '',
        )}" data-style="${escapeHtml(style)}" class="${cardClasses}"><blockquote class="${STYLED_QUOTE_TEXT}">"${escapeHtml(
          quote,
        )}"</blockquote>${cite}</div>`;

      case 'keyTakeaways':
        const items = b.items as string[];
        const listItems = (Array.isArray(items) ? items : [])
          .map((item) => `<li class="${KEY_TAKEAWAYS_ITEM}"><span class="text-brand-teal">•</span> ${escapeHtml(item)}</li>`)
          .join('');
        return `<div data-type="key-takeaways" data-items='${JSON.stringify(items || [])}' class="${KEY_TAKEAWAYS_CARD}"><h4 class="${KEY_TAKEAWAYS_TITLE}">Key Takeaways</h4><ul class="space-y-2">${listItems}</ul></div>`;

      case 'calloutBox':
        const title = b.title as string;
        const content = b.content as string;
        const variant = b.variant as string;
        const titleHtml = title ? `<h4>${escapeHtml(title)}</h4>` : '';
        return `<div data-type="callout-box" data-title="${escapeHtml(title || '')}" data-content="${escapeHtml(
          content || '',
        )}" data-variant="${escapeHtml(variant || 'info')}" class="callout-box callout-box--${escapeHtml(
          variant || 'info',
        )}">${titleHtml}<p>${escapeHtml(content)}</p></div>`;

      case 'image':
        return `<img src="${b.asset ? getSanityImageUrl(b.asset as Record<string, unknown>) : ''}" alt="${escapeHtml(String(b.alt || ''))}" />`;

      case 'block':
        return convertBlockToHTML(b);

      default:
        return '';
    }
  }).filter(Boolean).join('');
}

/**
 * Convert Portable Text blocks to a Tiptap JSON document to avoid HTML parse loss.
 */
export function convertPortableTextToTiptapDoc(portableText: unknown): Record<string, unknown> {
  const blocks = normalizeLegacyPortableText(Array.isArray(portableText) ? portableText : []);

  const content = (blocks as PortableBlock[]).map((block) => {
    switch (block._type) {
      case 'leadParagraph':
        return {
          type: 'leadParagraph',
          content: textSpansToTiptap(block.children as TextSpan[] | undefined, block.text as string | undefined),
        };
      case 'block':
        if (block.style === 'lead') {
          return {
            type: 'leadParagraph',
            content: textSpansToTiptap(block.children as TextSpan[] | undefined, block.text as string | undefined),
          };
        }
        return portableBlockToTiptap(block);
      case 'styledQuote':
        return {
          type: 'styledQuote',
          attrs: {
            quote: block.quote || '',
            attribution: block.attribution || '',
            style: block.style || 'teal',
          },
        };
      case 'keyTakeaways':
        return {
          type: 'keyTakeaways',
          attrs: {
            items: block.items || [],
          },
        };
      case 'calloutBox':
        return {
          type: 'calloutBox',
          attrs: {
            title: block.title || '',
            content: block.content || '',
            variant: block.variant || 'info',
          },
        };
      case 'block':
      default:
        return portableBlockToTiptap(block);
    }
  }).flat().filter(Boolean);

  // Fallback: never return an empty document—use a blank paragraph so editor renders content area.
  // Note: empty paragraphs should have empty content array, not empty text nodes
  const safeContent = content.length > 0 ? content : [{ type: 'paragraph', content: [] }];

  return { type: 'doc', content: safeContent };
}

function textSpansToTiptap(children?: TextSpan[], fallbackText?: string) {
  const spans = children && children.length > 0 ? children : [{ text: fallbackText || '', marks: [] }];
  const textNodes = spans
    .filter((span: TextSpan) => span.text && span.text.length > 0)
    .map((span: TextSpan) => ({
      type: 'text',
      text: span.text,
      marks: (span.marks || []).map((mark: string): TiptapMark => ({ type: mark === 'strong' ? 'bold' : mark === 'em' ? 'italic' : mark === 'underline' ? 'underline' : mark })),
    }));
  return textNodes;
}

function portableBlockToTiptap(block: PortableBlock) {
  const style = block.style as string || 'normal';
  const content = ((block.children || []) as TextSpan[])
    .filter((child: TextSpan) => child.text && child.text.length > 0)
    .map((child: TextSpan) => ({
      type: 'text',
      text: child.text,
      marks: (child.marks || []).map((mark: string): TiptapMark => ({ type: mark === 'strong' ? 'bold' : mark === 'em' ? 'italic' : mark === 'underline' ? 'underline' : mark })),
    }));

  if (block.listItem === 'bullet') {
    return {
      type: 'bulletList',
      content: [
        {
          type: 'listItem',
          content: [{ type: 'paragraph', content }],
        },
      ],
    };
  }
  if (block.listItem === 'number') {
    return {
      type: 'orderedList',
      content: [
        {
          type: 'listItem',
          content: [{ type: 'paragraph', content }],
        },
      ],
    };
  }

  if (style === 'blockquote') {
    return {
      type: 'blockquote',
      content: [{ type: 'paragraph', content }],
    };
  }

  if (style === 'h2' || style === 'h3' || style === 'h4') {
    const level = Number(style.replace('h', ''));
    return {
      type: 'heading',
      attrs: { level },
      content,
    };
  }

  if (style === 'lead') {
    return {
      type: 'leadParagraph',
      content,
    };
  }

  return { type: 'paragraph', content };
}

/**
 * Convert a standard Portable Text block to HTML
 */
function convertBlockToHTML(block: Record<string, unknown>): string {
  const style = block.style as string || 'normal';
  const children = block.children as unknown[] || [];
  const listItem = block.listItem as string;
  
  const content = children
    .map((child: unknown) => convertSpanToHTML(child as Record<string, unknown>))
    .join('');

  switch (style) {
    case 'h2':
      return `<h2>${content}</h2>`;
    case 'h3':
      return `<h3>${content}</h3>`;
    case 'h4':
      return `<h4>${content}</h4>`;
    case 'lead':
      return `<p data-type="lead-paragraph" class="lead-paragraph">${content}</p>`;
    case 'blockquote':
      return `<blockquote><p>${content}</p></blockquote>`;
    case 'normal':
    default:
      if (listItem === 'bullet') {
        return `<ul><li>${content}</li></ul>`;
      }
      if (listItem === 'number') {
        return `<ol><li>${content}</li></ol>`;
      }
      return `<p>${content}</p>`;
  }
}

/**
 * Compatibility: upgrade legacy blockquote + list structures to the
 * newer custom block types so they render and round-trip correctly.
 */
function normalizeLegacyPortableText(blocks: unknown[]): unknown[] {
  const result: unknown[] = [];

  type BlockWithMeta = {
    _type?: string;
    _key?: string;
    style?: string;
    listItem?: string;
    children?: { text?: string }[];
    marks?: string[];
  };

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i] as BlockWithMeta;
    const text = getBlockText(block).trim();

    // Legacy styled quote stored as a blockquote-style block
    if (block._type === 'block' && block.style === 'blockquote') {
      result.push({
        _type: 'styledQuote',
        _key: block._key || `styledQuote-${i}`,
        quote: text,
        attribution: '',
        style: 'coral',
      });
      continue;
    }

    // Legacy Key Takeaways: heading followed by list blocks
    const isHeading =
      block._type === 'block' &&
      ['h2', 'h3', 'h4', 'normal'].includes(block.style || '') &&
      text.toLowerCase().startsWith('key takeaways');

    if (isHeading) {
      const items: string[] = [];
      let j = i + 1;
      while (j < blocks.length) {
        const next = blocks[j] as BlockWithMeta;
        if (next._type === 'block' && (next.listItem === 'bullet' || next.listItem === 'number')) {
          items.push(getBlockText(next));
          j += 1;
          continue;
        }
        break;
      }

      if (items.length > 0) {
        result.push({
          _type: 'keyTakeaways',
          _key: block._key || `keyTakeaways-${i}`,
          items,
        });
        i = j - 1;
        continue;
      }
    }

    result.push(block);
  }

  return result;
}

function getBlockText(block: { children?: { text?: string }[] }): string {
  const children = block?.children || [];
  return children.map((child) => (typeof child.text === 'string' ? child.text : '')).join(' ');
}



/**
 * Convert a Portable Text span to HTML
 */
function convertSpanToHTML(span: { text?: string; marks?: string[] }): string {
  const text = span.text || '';
  const marks = span.marks || [];

  let html = escapeHtml(text);

  // Apply marks in order
  for (const mark of marks) {
    switch (mark) {
      case 'strong':
        html = `<strong>${html}</strong>`;
        break;
      case 'em':
        html = `<em>${html}</em>`;
        break;
      case 'underline':
        html = `<u>${html}</u>`;
        break;
      case 'link':
        // Link annotations need special handling (would require markDefs)
        // For now, we'll skip the href since it's in markDefs
        break;
    }
  }

  return html;
}

/**
 * Convert Tiptap JSON to Sanity Portable Text format
 */
export function convertTiptapToPortableText(json: unknown): unknown[] {
  if (!json || typeof json !== 'object') return [];
  
  const doc = json as { content?: unknown[] };
  if (!doc.content) return [];

  return doc.content.map((node: unknown, index: number) => {
    const n = node as { type: string; content?: unknown[]; attrs?: Record<string, unknown> };
    
    switch (n.type) {
      case 'paragraph': {
        return {
          _type: 'block',
          _key: `block-${index}`,
          style: 'normal',
          markDefs: [],
          children: extractChildren(n.content),
        };
      }

      case 'leadParagraph':
        return {
          _type: 'block',
          _key: `lead-${index}`,
          style: 'lead',
          markDefs: [],
          children: extractChildren(n.content),
        };
      
      case 'heading':
        const level = (n.attrs?.level as number) || 2;
        return {
          _type: 'block',
          _key: `block-${index}`,
          style: `h${level}`,
          markDefs: [],
          children: extractChildren(n.content),
        };
      
      case 'blockquote':
        return {
          _type: 'block',
          _key: `block-${index}`,
          style: 'blockquote',
          markDefs: [],
          children: n.content?.flatMap((p: unknown) => {
            const para = p as { content?: unknown[] };
            return extractChildren(para.content);
          }) || [],
        };
      
      case 'bulletList':
      case 'orderedList':
        return (n.content || []).map((item: unknown, itemIndex: number) => {
          const listItem = item as { content?: unknown[] };
          return {
            _type: 'block',
            _key: `block-${index}-${itemIndex}`,
            style: 'normal',
            listItem: n.type === 'bulletList' ? 'bullet' : 'number',
            level: 1,
            markDefs: [],
            children: listItem.content?.flatMap((p: unknown) => {
              const para = p as { content?: unknown[] };
              return extractChildren(para.content);
            }) || [],
          };
        });
      
      case 'image':
        return {
          _type: 'image',
          _key: `block-${index}`,
          asset: {
            _type: 'reference',
            _ref: n.attrs?.src || '',
          },
        };

      case 'styledQuote':
        return {
          _type: 'styledQuote',
          _key: `quote-${index}`,
          quote: n.attrs?.quote || '',
          attribution: n.attrs?.attribution || '',
          style: n.attrs?.style || 'teal',
        };

      case 'keyTakeaways':
        return {
          _type: 'keyTakeaways',
          _key: `takeaways-${index}`,
          items: (n.attrs?.items as string[]) || [],
        };

      case 'calloutBox':
        return {
          _type: 'calloutBox',
          _key: `callout-${index}`,
          title: n.attrs?.title || '',
          content: n.attrs?.content || '',
          variant: n.attrs?.variant || 'info',
        };
      
      default:
        return {
          _type: 'block',
          _key: `block-${index}`,
          style: 'normal',
          markDefs: [],
          children: [{ _type: 'span', _key: 'span-0', text: '', marks: [] }],
        };
    }
  }).flat();
}

/**
 * Extract children spans from Tiptap nodes
 */
function extractChildren(content?: unknown[]): unknown[] {
  if (!content) return [{ _type: 'span', _key: 'span-0', text: '', marks: [] }];
  
  return content.map((child: unknown, idx: number) => {
    const c = child as { type: string; text?: string; marks?: { type: string }[] };
    
    if (c.type === 'text') {
      const marks: string[] = [];
      if (c.marks) {
        c.marks.forEach((mark) => {
          if (mark.type === 'bold') marks.push('strong');
          if (mark.type === 'italic') marks.push('em');
          if (mark.type === 'underline') marks.push('underline');
        });
      }
      
      return {
        _type: 'span',
        _key: `span-${idx}`,
        text: c.text || '',
        marks,
      };
    }
    
    return {
      _type: 'span',
      _key: `span-${idx}`,
      text: '',
      marks: [],
    };
  });
}

/**
 * Escape HTML special characters
 */
function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Convert Sanity asset reference to image URL
 */
function getSanityImageUrl(asset: Record<string, unknown>): string {
  const ref = asset._ref as string;
  if (!ref) return '';
  
  // Sanity image ref format: image-{id}-{width}x{height}-{format}
  const parts = ref.split('-');
  if (parts.length < 2) return '';
  
  const imageId = parts.slice(1, -2).join('-');
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
  
  if (!projectId) return '';
  
  return `https://cdn.sanity.io/images/${projectId}/${dataset}/${imageId}-${ref.split('-').slice(-2).join('-')}.webp`;
}
