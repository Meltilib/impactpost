# Phase 2: Sanity CMS Integration (2025-12-04)

## Overview
- Integrated Sanity.io as headless CMS for IMPACT POST with zero visual changes to the existing Neo-Brutalist design.
- Created complete content schemas (Article, Author, Category, Event) with rich text support.
- Implemented smart data fetching layer that falls back to static data when Sanity isn't configured.
- Added ISR (Incremental Static Regeneration) with 60-second revalidation and webhook support.

## Problem
Content was hardcoded in static TypeScript files (`src/lib/data.ts`), requiring developer intervention for any content changes. This blocked non-technical editors from managing articles, events, and other content.

## What Changed (with file references)

### Sanity Project Structure
- **sanity/sanity.config.ts** — NEW: Sanity Studio configuration with custom desk structure
- **sanity/sanity.cli.ts** — NEW: CLI configuration for Sanity commands
- **sanity/schemaTypes/index.ts** — NEW: Schema exports

### Content Schemas
- **sanity/schemaTypes/article.ts** — NEW: Article schema with title, subtitle, slug, author, mainImage, category, tags, body (Portable Text), excerpt, publishedAt, isFeatured, SEO fields
- **sanity/schemaTypes/author.ts** — NEW: Author schema with name, slug, role, image, bio
- **sanity/schemaTypes/category.ts** — NEW: Content pillar schema with title, slug, description, color, textColor
- **sanity/schemaTypes/event.ts** — NEW: Event schema with title, slug, eventDate, location, type, description, registrationUrl, image
- **sanity/schemaTypes/blockContent.ts** — NEW: Rich text schema with headings, quotes, lists, links, images

### Next.js Integration
- **src/lib/sanity/client.ts** — NEW: Conditional Sanity client (handles missing config gracefully)
- **src/lib/sanity/queries.ts** — NEW: All GROQ queries for articles, events, categories
- **src/lib/sanity/mappers.ts** — NEW: Maps Sanity documents to existing TypeScript types (Story, Event)
- **src/lib/sanity/image.ts** — NEW: Image URL builder with fallback
- **src/lib/sanity/fetch.ts** — NEW: Smart data fetching with static data fallback
- **src/lib/sanity/index.ts** — NEW: Barrel exports

### Components
- **src/components/portable-text.tsx** — NEW: Design-matched Portable Text renderer (Neo-Brutalist styling)

### API Routes
- **src/app/api/preview/route.ts** — NEW: Enable draft mode for content preview
- **src/app/api/disable-draft/route.ts** — NEW: Exit preview mode
- **src/app/api/revalidate/route.ts** — NEW: Webhook for on-demand ISR revalidation

### Updated Pages (with ISR)
- **src/app/page.tsx** — Async data fetching with `fetchFeaturedStory`, `fetchRecentStories`, `fetchEvents`
- **src/app/news/page.tsx** — Async data fetching with `fetchAllStories`
- **src/app/news/[slug]/page.tsx** — Async data fetching with `fetchStoryBySlug`, Portable Text support
- **src/app/section/[category]/page.tsx** — Async data fetching with `fetchStoriesByCategory`

### Configuration
- **package.json** — Added sanity scripts (`sanity:dev`, `sanity:deploy`), new dependencies
- **.env.example** — NEW: Environment variable template for Sanity configuration

### Dependencies Added
- `sanity` — Sanity Studio framework
- `@sanity/client` — Sanity API client
- `@sanity/vision` — GROQ query playground
- `@sanity/image-url` — Image URL builder
- `next-sanity` — Next.js integration utilities
- `@portabletext/react` — Rich text renderer

## Key Architecture Decisions

### Graceful Fallback Pattern
```typescript
// When Sanity isn't configured, falls back to static data
const client = useSanity ? createClient({...}) : null;

async function fetchFeaturedStory() {
  if (sanityClient) {
    const article = await sanityClient.fetch(query);
    if (article) return mapSanityArticle(article);
  }
  return FEATURED_STORY; // Static fallback
}
```

### ISR Strategy
| Route | Revalidation |
|-------|--------------|
| Homepage | 60 seconds |
| Article pages | 60 seconds |
| Category pages | 60 seconds |
| Static pages | Build time |

### Design Preservation
- All existing components unchanged
- Portable Text renderer uses existing Tailwind classes
- Hard shadows, coral borders, brand colors preserved

## Validation
```bash
npm run build   # Successful build with all routes
npm run lint    # No errors or warnings
```

## To Enable Sanity
1. Create project at sanity.io/manage
2. Copy `.env.example` to `.env.local`:
   ```
   NEXT_PUBLIC_SANITY_PROJECT_ID="your-id"
   NEXT_PUBLIC_SANITY_DATASET="production"
   NEXT_PUBLIC_USE_SANITY="true"
   ```
3. Run `npm run sanity:dev` to start Sanity Studio

## Follow-ups
- Create data migration script to import existing static content to Sanity
- Configure Sanity webhook to hit `/api/revalidate` on publish
- Set up Sanity roles (Admin, Editor, Contributor) at sanity.io/manage
- Deploy Sanity Studio with `npm run sanity:deploy`
