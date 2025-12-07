export const STYLED_QUOTE_CARD_BASE =
  'styled-quote my-10 rounded-md shadow-hard-sm px-6 py-6 md:px-8 md:py-8 bg-white';

export const STYLED_QUOTE_TEXT =
  'styled-quote-block text-xl md:text-2xl italic leading-relaxed text-gray-800';

export const STYLED_QUOTE_ATTRIBUTION =
  'text-sm font-bold text-gray-600 not-italic';

export const STYLED_QUOTE_VARIANT_BORDERS: Record<string, string> = {
  teal: 'border-brand-teal',
  coral: 'border-brand-coral',
  purple: 'border-brand-purple',
};

export const STYLED_QUOTE_VARIANT_BACKGROUNDS: Record<string, string> = {
  teal: 'bg-quote-teal',
  coral: 'bg-quote-coral',
  purple: 'bg-quote-purple',
};

export function getStyledQuoteContainerClasses(style?: string): string {
  const border = STYLED_QUOTE_VARIANT_BORDERS[style || ''] || STYLED_QUOTE_VARIANT_BORDERS.teal;
  return `${STYLED_QUOTE_CARD_BASE} border-l-4 ${border}`;
}

export const KEY_TAKEAWAYS_CARD =
  'key-takeaways my-10 rounded-md border-l-4 bg-quote-teal border-brand-teal shadow-hard-sm px-6 py-6 md:px-8 md:py-8';

export const KEY_TAKEAWAYS_TITLE =
  'text-brand-teal uppercase font-bold text-xs md:text-sm mb-4 tracking-[0.2em]';

export const KEY_TAKEAWAYS_ITEM =
  'flex gap-2 text-gray-800';
