# Implementation Note: Content Blocks Stabilization & Admin UX (2025-12-07)

## Goals
- Stop custom blocks (Lead, Featured Quote, Key Takeaways, Callout) from losing data/formatting on reload.
- Preserve lead-paragraph styling (drop cap + bold) across editor → save → render cycles.
- Surface article display order directly in the admin list for quicker curation.

## Changes
- **Quote styling:** Refined quote helper (`getStyledQuoteContainerClasses`) and kept white card with left accent border.
- **Key Takeaways reliability:** Added robust `parseHTML/getAttrs` fallbacks in Tiptap extensions to rebuild attrs from DOM when data attributes are missing. Prevents empty/blank panels on save.
- **Lead paragraph resilience:**
  - Added a dedicated leadParagraph Tiptap node and modal (no browser prompt).
  - Round-tripped lead paragraphs as block `style: 'lead'` so marks (bold/italic) persist; renderer now normalizes legacy `_type: 'leadParagraph'` or `style: 'lead'` to the drop-cap + bold class.
- **JSON-first editor load:** Introduced PT → Tiptap JSON conversion (`convertPortableTextToTiptapDoc`) and initialized the editor with JSON instead of HTML to avoid attr loss. Added safe fallbacks to ensure the editor never loads empty.
- **Admin dashboard UX:** Added **Order** column to the Articles table to show `displayOrder`.
- **Postmortem:** Logged lessons in `Lesson-learned/01-quote-block-styling-and-roundtrip.md`.

## Key Files Touched
- `src/lib/article-block-styles.ts`
- `src/components/portable-text.tsx`
- `src/lib/admin/portable-text-converter.ts`
- `src/lib/admin/tiptap-extensions.ts`
- `src/components/admin/rich-editor.tsx`
- `src/components/admin/article-form.tsx`
- `src/app/news/[slug]/page.tsx`
- `src/app/admin/page.tsx`
- `Lesson-learned/01-quote-block-styling-and-roundtrip.md`

## Verification Notes
- Editor loads existing articles with quotes, takeaways, and lead paragraphs intact (JSON init + getAttrs fallbacks).
- Saving and reloading keeps Key Takeaways items and lead drop-cap styling.
- Admin “Order” column shows `displayOrder` (or em dash when missing).

## Follow-ups
- Optional: add sort-by-order in admin table.
- Optional: migration script to convert legacy blockquote/list data to structured blocks in Sanity.
