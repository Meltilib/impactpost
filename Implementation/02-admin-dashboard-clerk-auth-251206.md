# Phase 2b: Admin Dashboard with Clerk Authentication (2025-12-06)

## Overview
- Built a custom admin dashboard at `/admin` for article creation and management.
- Integrated Clerk for secure authentication with individual user accounts.
- Added Tiptap rich text editor with custom block types (Lead Paragraph, Featured Quote, Key Takeaways, Callout Box).
- Implemented granular article placement controls for homepage sections.
- Created server actions for CRUD operations with Sanity write client.

## Problem
Sanity Studio, while powerful, presents a complex interface that can be overwhelming for editors who need to quickly create and publish articles. The team needed:
1. A simpler, branded admin interface
2. Secure authentication with individual user accounts and audit trail
3. Custom content blocks matching the site's Neo-Brutalist design
4. Granular control over homepage article placement (hero, sidebar, grid)

## What Changed (with file references)

### Authentication Layer
- **src/middleware.ts** — NEW: Clerk middleware protecting `/admin/*` routes with fallback for unconfigured state
- **src/app/admin/sign-in/[[...sign-in]]/page.tsx** — NEW: Branded Clerk sign-in page

### Admin Dashboard Structure
- **src/app/admin/layout.tsx** — NEW: Admin shell with sidebar navigation, Clerk UserButton, and setup instructions when Clerk isn't configured
- **src/app/admin/page.tsx** — NEW: Article list dashboard with status, category, author, placement columns
- **src/app/admin/new/page.tsx** — NEW: Create article page wrapper
- **src/app/admin/edit/[id]/page.tsx** — NEW: Edit article page with data fetching

### Article Editor Components
- **src/components/admin/article-form.tsx** — NEW: Complete article form with:
  - Title, slug (auto-generated), excerpt fields
  - Category and author dropdowns (fetched from Sanity)
  - Hero image upload with drag-drop
  - Tiptap rich text editor integration
  - Placement controls (featured-hero, sidebar, grid, hidden)
  - Display order for priority within sections
  - Tag management
  - Save Draft / Publish buttons
  
- **src/components/admin/rich-editor.tsx** — NEW: Tiptap editor wrapper with:
  - Toolbar: Bold, Italic, H2, H3, Lists, Quote, Image, Link
  - Custom block buttons: Lead Paragraph, Featured Quote, Key Takeaways, Callout Box
  - Modal dialogs for custom block insertion
  - Portable Text conversion on save
  
- **src/components/admin/image-upload.tsx** — NEW: Drag-drop image uploader with preview and Sanity asset upload

### Server Actions & API
- **src/lib/admin/actions.ts** — NEW: Server actions for:
  - `createArticle()` - Create new article in Sanity
  - `updateArticle()` - Update existing article
  - `deleteArticle()` - Delete article
  - `fetchAuthors()` - Get all authors for dropdown
  - `fetchCategories()` - Get all categories for dropdown
  - `fetchArticlesForAdmin()` - List articles with metadata
  - `fetchArticleById()` - Get single article for editing

- **src/lib/sanity/write-client.ts** — NEW: Sanity client with write token for mutations

- **src/app/api/admin/upload/route.ts** — NEW: Image upload endpoint that uploads to Sanity assets

### Custom Block Types (Sanity Schema)
- **sanity/schemaTypes/blockContent.ts** — MODIFIED: Added 4 custom block types:
  - `leadParagraph` - Drop cap paragraph for article openings
  - `styledQuote` - Featured quote with teal/coral/purple variants
  - `keyTakeaways` - Bullet point callout box
  - `calloutBox` - Info/warning/success/note variants

### Article Placement System (Sanity Schema)
- **sanity/schemaTypes/article.ts** — MODIFIED: Added placement fields:
  - `placement` - String select: "featured-hero", "sidebar", "grid", "hidden"
  - `displayOrder` - Number for priority within section (lower = higher)
  - `pinnedUntil` - Optional datetime for time-limited pinning

### Frontend Renderers
- **src/components/portable-text.tsx** — MODIFIED: Added renderers for custom blocks:
  - `leadParagraph` - Drop cap styling with `first-letter:` CSS
  - `styledQuote` - Colored background blockquotes
  - `keyTakeaways` - Teal callout with bullet list
  - `calloutBox` - Variant-colored callout boxes

### Query Updates
- **src/lib/sanity/queries.ts** — MODIFIED: 
  - Updated `featuredArticleQuery` to use placement-based ordering
  - Added `sidebarArticlesQuery` for Community Pulse section
  - Updated `recentArticlesQuery` to filter by grid placement

- **src/lib/sanity/fetch.ts** — MODIFIED:
  - Added `fetchSidebarStories()` function
  - Updated imports for new query

### Dependencies Added
```json
{
  "@clerk/nextjs": "^6.x",
  "@tiptap/react": "^2.x",
  "@tiptap/starter-kit": "^2.x",
  "@tiptap/extension-image": "^2.x",
  "@tiptap/extension-placeholder": "^2.x",
  "@tiptap/extension-link": "^2.x"
}
```

## Key Architecture Decisions

### Authentication Strategy: Clerk
Chose Clerk over alternatives because:
- Individual user accounts (vs shared password)
- Built-in 2FA support
- Audit trail (who logged in when)
- Easy user offboarding (disable account instantly)
- 10-minute setup with excellent DX
- Free tier covers small editorial teams

```typescript
// Middleware with graceful fallback
const isClerkConfigured = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

export default isClerkConfigured 
  ? clerkMiddleware(async (auth, req) => {
      if (isAdminRoute(req)) await auth.protect();
    })
  : fallbackMiddleware;
```

### Rich Text Editor: Tiptap
Chose Tiptap over alternatives (Slate, Lexical, Draft.js) because:
- Best React integration
- Excellent documentation
- Extensible for custom blocks
- Active maintenance (1M+ weekly npm downloads)
- Headless architecture matches our design system

### Portable Text Conversion
Tiptap uses its own JSON format, requiring conversion to Sanity's Portable Text:
```typescript
function convertTiptapToPortableText(json: unknown): unknown[] {
  // Maps Tiptap nodes → Portable Text blocks
  // Handles: paragraph, heading, blockquote, lists, images
  // Custom blocks inserted as raw Portable Text objects
}
```

### Graceful Degradation
Admin dashboard works in three states:
1. **Clerk not configured**: Shows setup instructions with Clerk signup link
2. **Clerk configured, Sanity write token missing**: Dashboard loads but writes fail
3. **Fully configured**: Full functionality

## Environment Variables Required

```env
# Clerk Authentication (required for admin)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_xxx
CLERK_SECRET_KEY=sk_live_xxx
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/admin/sign-in
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/admin

# Sanity Write Access (required for creating/editing)
SANITY_WRITE_TOKEN=xxx  # Get from sanity.io/manage → API → Tokens → Add (Editor role)
```

## File Summary

### Files Created (15)
| File | Purpose |
|------|---------|
| `src/middleware.ts` | Clerk auth middleware with fallback |
| `src/app/admin/layout.tsx` | Admin shell with sidebar |
| `src/app/admin/page.tsx` | Article list dashboard |
| `src/app/admin/new/page.tsx` | Create article page |
| `src/app/admin/edit/[id]/page.tsx` | Edit article page |
| `src/app/admin/sign-in/[[...sign-in]]/page.tsx` | Clerk sign-in |
| `src/components/admin/article-form.tsx` | Article editor form |
| `src/components/admin/rich-editor.tsx` | Tiptap editor wrapper |
| `src/components/admin/image-upload.tsx` | Drag-drop uploader |
| `src/lib/admin/actions.ts` | Server actions for CRUD |
| `src/lib/sanity/write-client.ts` | Sanity write client |
| `src/app/api/admin/upload/route.ts` | Image upload API |

### Files Modified (5)
| File | Changes |
|------|---------|
| `sanity/schemaTypes/article.ts` | Added placement, displayOrder, pinnedUntil fields |
| `sanity/schemaTypes/blockContent.ts` | Added 4 custom block types |
| `src/components/portable-text.tsx` | Added 4 custom block renderers |
| `src/lib/sanity/queries.ts` | Added placement-based queries |
| `src/lib/sanity/fetch.ts` | Added fetchSidebarStories() |

## Validation
```bash
npm run lint    # ✅ No errors
npm run build   # ✅ Successful build
```

Build output shows admin routes as dynamic (ƒ):
```
├ ƒ /admin
├ ƒ /admin/edit/[id]
├ ƒ /admin/new
├ ƒ /admin/sign-in/[[...sign-in]]
├ ƒ /api/admin/upload
```

## Admin UX Flow

1. **Access**: Navigate to `/admin` (no public link by default)
2. **Authentication**: Clerk sign-in with email/password or social login
3. **Dashboard**: View all articles with status, placement, author
4. **Create/Edit**: 
   - Fill title (slug auto-generates)
   - Write excerpt
   - Select category and author from dropdowns
   - Upload hero image (drag-drop)
   - Write content with rich editor
   - Insert custom blocks via toolbar
   - Set homepage placement
   - Publish or Save Draft

## Follow-ups
- [ ] Add footer "Admin" link for easy access (standard CMS pattern)
- [ ] Create authors/categories management pages in admin
- [ ] Add article preview within admin before publishing
- [ ] Implement article search/filter in dashboard
- [ ] Add bulk operations (delete multiple, change placement)
- [ ] Set up Clerk webhook for user activity logging
- [ ] Create onboarding flow for new editors
