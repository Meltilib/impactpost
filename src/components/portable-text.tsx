'use client';

import { PortableText, type PortableTextComponents } from '@portabletext/react';
import type { PortableTextBlock } from '@portabletext/types';
import Image from 'next/image';
import { urlFor } from '@/lib/sanity/image';
import {
  KEY_TAKEAWAYS_CARD,
  KEY_TAKEAWAYS_ITEM,
  KEY_TAKEAWAYS_TITLE,
  STYLED_QUOTE_ATTRIBUTION,
  STYLED_QUOTE_TEXT,
  getStyledQuoteContainerClasses,
} from '@/lib/article-block-styles';

interface ImageValue {
  _type: 'image';
  asset?: {
    _id: string;
    url: string;
  };
  alt?: string;
  caption?: string;
}

interface LinkValue {
  _type: 'link';
  href: string;
  openInNewTab?: boolean;
}

interface LeadParagraphValue {
  _type: 'leadParagraph';
  text: string;
}

interface StyledQuoteValue {
  _type: 'styledQuote';
  quote: string;
  attribution?: string;
  style: 'teal' | 'coral' | 'purple';
}

interface KeyTakeawaysValue {
  _type: 'keyTakeaways';
  items: string[];
}

interface CalloutBoxValue {
  _type: 'calloutBox';
  title?: string;
  content: string;
  variant: 'info' | 'warning' | 'success' | 'note';
}

const components: PortableTextComponents = {
  block: {
    h2: ({ children }) => (
      <h2 className="font-display text-3xl mt-12 mb-6 text-brand-dark">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="font-display text-2xl mt-8 mb-4 text-brand-dark">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="font-display text-xl mt-6 mb-3 text-brand-dark">
        {children}
      </h4>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-brand-coral pl-6 italic my-8 text-xl text-gray-700">
        {children}
      </blockquote>
    ),
    normal: ({ children }) => (
      <p className="mb-6 leading-relaxed text-lg text-gray-800">
        {children}
      </p>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mb-6 pl-6 list-disc space-y-2 text-lg text-gray-800">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="mb-6 pl-6 list-decimal space-y-2 text-lg text-gray-800">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li className="leading-relaxed">{children}</li>,
    number: ({ children }) => <li className="leading-relaxed">{children}</li>,
  },
  types: {
    image: ({ value }: { value: ImageValue }) => {
      if (!value?.asset) return null;
      
      return (
        <figure className="my-8 border-2 border-black shadow-hard overflow-hidden">
          <Image
            src={urlFor(value).width(800).height(500).url()}
            alt={value.alt || ''}
            width={800}
            height={500}
            className="w-full h-auto"
          />
          {value.caption && (
            <figcaption className="bg-brand-light p-3 text-sm font-medium text-gray-600 border-t-2 border-black">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
    leadParagraph: ({ value }: { value: LeadParagraphValue }) => (
      <p className="mb-6 leading-relaxed text-xl text-gray-800 first-letter:text-5xl first-letter:font-heavy first-letter:text-brand-purple first-letter:mr-2 first-letter:float-left first-letter:leading-none">
        {value.text}
      </p>
    ),
    styledQuote: ({ value }: { value: StyledQuoteValue }) => {
      return (
        <div className={getStyledQuoteContainerClasses(value.style)}>
          <blockquote className={STYLED_QUOTE_TEXT}>
            &ldquo;{value.quote}&rdquo;
          </blockquote>
          {value.attribution && (
            <cite className={STYLED_QUOTE_ATTRIBUTION}>
              &mdash; {value.attribution}
            </cite>
          )}
        </div>
      );
    },
    keyTakeaways: ({ value }: { value: KeyTakeawaysValue }) => (
      <div className={KEY_TAKEAWAYS_CARD}>
        <h4 className={KEY_TAKEAWAYS_TITLE}>
          Key Takeaways
        </h4>
        <ul className="space-y-2">
          {value.items?.map((item, i) => (
            <li key={i} className={KEY_TAKEAWAYS_ITEM}>
              <span className="text-brand-teal">•</span> {item}
            </li>
          ))}
        </ul>
      </div>
    ),
    calloutBox: ({ value }: { value: CalloutBoxValue }) => {
      const variants = {
        info: 'bg-blue-50 border-blue-500 text-blue-900',
        warning: 'bg-yellow-50 border-yellow-500 text-yellow-900',
        success: 'bg-green-50 border-green-500 text-green-900',
        note: 'bg-gray-50 border-gray-500 text-gray-900',
      };
      return (
        <div className={`border-l-4 p-6 my-8 ${variants[value.variant] || variants.info}`}>
          {value.title && (
            <h4 className="font-bold text-sm mb-2 uppercase tracking-wide">
              {value.title}
            </h4>
          )}
          <p>{value.content}</p>
        </div>
      );
    },
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-bold">{children}</strong>
    ),
    em: ({ children }) => (
      <em className="italic">{children}</em>
    ),
    underline: ({ children }) => (
      <span className="underline">{children}</span>
    ),
    link: ({ value, children }: { value?: LinkValue; children: React.ReactNode }) => {
      const target = value?.openInNewTab ? '_blank' : undefined;
      const rel = value?.openInNewTab ? 'noopener noreferrer' : undefined;
      
      return (
        <a
          href={value?.href || '#'}
          target={target}
          rel={rel}
          className="text-brand-purple font-bold underline hover:text-brand-coral transition-colors"
        >
          {children}
        </a>
      );
    },
  },
};

interface ArticleBodyProps {
  content: PortableTextBlock[];
}

export function ArticleBody({ content }: ArticleBodyProps) {
  if (!content || content.length === 0) {
    return null;
  }

  const normalized = normalizeLegacyContent(content);

  return (
    <div className="prose max-w-none">
      <PortableText value={normalized} components={components} />
    </div>
  );
}

export default ArticleBody;

/**
 * Compatibility shim: convert legacy blockquote + list structures into
 * the newer styledQuote / keyTakeaways blocks so existing articles pick
 * up the new styling without a data migration.
 */
function normalizeLegacyContent(blocks: PortableTextBlock[]): PortableTextBlock[] {
  const result: PortableTextBlock[] = [];

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i] as Record<string, any>;
    const text = getBlockText(block).trim();
    const type = block._type;

    // Legacy styled quote: blockquote style in a regular block
    if (type === 'block' && block.style === 'blockquote') {
      result.push({
        _type: 'styledQuote',
        _key: block._key || `styledQuote-${i}`,
        quote: text,
        attribution: '',
        style: 'coral',
      } as any);
      continue;
    }

    // Legacy Key Takeaways: heading followed by list items
    const isKeyTakeawaysHeading =
      type === 'block' &&
      ['h2', 'h3', 'h4', 'normal'].includes(block.style || '') &&
      text.toLowerCase().startsWith('key takeaways');

    if (isKeyTakeawaysHeading) {
      const items: string[] = [];
      let j = i + 1;
      while (j < blocks.length) {
        const next = blocks[j] as Record<string, any>;
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
        } as any);
        i = j - 1; // skip consumed list blocks
        continue;
      }
    }

    result.push(block as PortableTextBlock);
  }

  return result;
}

function getBlockText(block: Record<string, any>): string {
  const children: any[] = block.children || [];
  return children
    .map((child) => (typeof child.text === 'string' ? child.text : ''))
    .join(' ');
}
