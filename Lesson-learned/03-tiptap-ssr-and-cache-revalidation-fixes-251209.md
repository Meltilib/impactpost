# Lesson Learned: Tiptap SSR Hydration & Cache Revalidation (2025-12-09)

## Issues Encountered

### 1. TypeScript Build Error: AuthorPayload imageAssetId Type
**Symptom:** Vercel build failed with type error - `null` not assignable to `string | undefined`.

**Root Cause:** The `AuthorPayload` interface defined `imageAssetId?: string` but the UI intentionally passes `null` to signal "remove image" (distinct from `undefined` meaning "no change").

**Fix:** Updated `AuthorPayload.imageAssetId` type from `string | undefined` to `string | null | undefined` in `src/lib/admin/actions.ts`.

**Lesson:** When designing optional fields that need to distinguish between "not set", "explicitly cleared", and "has value", use union types like `T | null | undefined` and document the semantic meaning of each.

---

### 2. Empty Content Editor When Editing Articles
**Symptom:** RichEditor showed empty content when opening existing articles for editing, despite data being fetched correctly.

**Root Cause:** Tiptap's `useEditor` hook with `immediatelyRender: false` (required for SSR) captures the `content` option at initialization time. Due to React hydration timing, the `initialDoc` prop wasn't available when the editor was created client-side.

**Fix:** Added a `useEffect` in `rich-editor.tsx` to sync `initialDoc` to the editor after it's ready:
```typescript
useEffect(() => {
  if (!editor || !initialDoc) return;
  // Check if editor is empty and initialDoc has content, then set it
  if (!hasRealContent && initialContent?.length > 0) {
    editor.commands.setContent(initialDoc);
  }
}, [editor, initialDoc]);
```

**Lesson:** When using Tiptap with Next.js SSR (`immediatelyRender: false`), always add an effect to sync initial content after hydration. The `useEditor` hook options are captured once and won't react to prop changes.

---

### 3. Tiptap Rejecting Content: "Empty text nodes are not allowed"
**Symptom:** Console errors `RangeError: Empty text nodes are not allowed` when loading articles with content.

**Root Cause:** The Portable Text to Tiptap converter was creating text nodes with empty strings (`{ type: 'text', text: '' }`), which ProseMirror/Tiptap schema rejects.

**Fix:** Updated `portable-text-converter.ts`:
1. Added `.filter()` before `.map()` in `textSpansToTiptap` and `portableBlockToTiptap` to exclude empty text spans
2. Changed empty document fallback from `[{ type: 'text', text: '' }]` to `[]` (empty content array)
3. Updated fallbacks in `rich-editor.tsx` and `article-form.tsx` to use `{ type: 'paragraph', content: [] }` instead of including empty text nodes

**Lesson:** ProseMirror/Tiptap strictly enforces that text nodes must have non-empty content. When converting between formats, always filter out empty text before creating Tiptap nodes. Empty paragraphs should have `content: []`, not `content: [{ type: 'text', text: '' }]`.

---

### 4. Homepage Image Not Matching Article Image After Update
**Symptom:** Homepage showed old article image while article page showed the newly uploaded image.

**Root Cause:** 
1. ISR caching with 60-second revalidation meant stale data could persist
2. `updateArticle` wasn't revalidating the specific article slug path
3. `ImageUpload` component's `preview` state wasn't syncing with the `value` prop after mount

**Fix:**
1. Enhanced revalidation in `updateArticle` to include `/news/${slug}` and category pages
2. Added `useEffect` in `ImageUpload` to sync `preview` state with `value` prop

**Lesson:** 
- Always revalidate ALL relevant paths after mutations, including specific dynamic routes
- React `useState` initial value is only used once - use `useEffect` to sync state with props that may change after mount
- For ISR sites, users may need to hard refresh or wait for revalidation period

---

## Key Files Modified
- `src/lib/admin/actions.ts` - Type fix + enhanced revalidation
- `src/lib/admin/portable-text-converter.ts` - Empty text node filtering
- `src/components/admin/rich-editor.tsx` - SSR hydration sync for initialDoc
- `src/components/admin/article-form.tsx` - Empty doc fallback fix
- `src/components/admin/image-upload.tsx` - Preview state sync

## Testing Checklist
- [ ] Verify build passes with `npm run build`
- [ ] Test editing existing articles - content should load in editor
- [ ] Test creating new articles - empty editor should work
- [ ] Test uploading new images - should reflect on all pages after revalidation
- [ ] Test removing author images - should work without type errors
