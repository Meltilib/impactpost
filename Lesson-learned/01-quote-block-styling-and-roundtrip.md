# Lesson Learned: Quote & Key Takeaways Styling Regression

## What went wrong
- Styled quote backgrounds disappeared because the shared style constant forced `bg-white` and only applied a left border; variant background utilities were unused by consumers.
- Legacy articles stored quotes as plain blockquotes and key takeaways as a heading + list, so the custom renderers never ran and the blocks rendered with default prose styles.

## Impact
- Live articles showed unstyled quotes and key takeaways (lost tinted backgrounds and uppercase heading), reducing visual hierarchy and brand consistency.

## Root causes
- Style token drift: `STYLED_QUOTE_CARD_BASE` hard-coded `bg-white`; renderers relied on it without adding variant backgrounds.
- Data shape drift: Editor/renderer expected `_type: styledQuote` / `_type: keyTakeaways`, but older content remained generic Portable Text blocks.

## Fix implemented
- Reworked the quote style helper to keep the left accent border while defaulting to white background (per latest design request).
- Added compatibility shims in the renderer and converter to detect legacy blockquote + list patterns and map them to the custom block types, so old content renders correctly and stays correct after re-save.

## Prevent / detect next time
- When adding custom Portable Text types, include a small “legacy upgrade” helper or migration script up front and keep it with the feature.
- Document expected block shapes and enforce them in editor load/save paths so data doesn’t silently fall back to generic blocks.
- Add a quick visual regression checklist (or snapshot test if feasible) covering custom blocks after style token changes.

## Ownership / links
- Area: content rendering + admin editor
- Files touched: `src/lib/article-block-styles.ts`, `src/components/portable-text.tsx`, `src/lib/admin/portable-text-converter.ts`, `src/lib/admin/tiptap-extensions.ts`.
