# IMPACT POST: Vite to Next.js Migration Plan

## Executive Summary

This document outlines a comprehensive migration strategy from the current Vite + React SPA to Next.js 15 App Router, with focus on **SEO optimization**, **UX excellence**, **performance**, and **long-term stability**.

---

## Current State Analysis

### Existing Tech Stack
- **Framework**: Vite + React 19
- **Routing**: react-router-dom with HashRouter
- **Styling**: Tailwind CSS (inline classes)
- **Icons**: lucide-react
- **Data**: Static TypeScript files

### Critical Issues (SEO/Performance)
| Issue | Impact | Priority |
|-------|--------|----------|
| HashRouter (`/#/`) | Search engines cannot crawl hash routes - **ZERO SEO** | Critical |
| Client-side only rendering | Slow First Contentful Paint, poor Core Web Vitals | Critical |
| No metadata management | Missing titles, descriptions, OG tags | Critical |
| No sitemap/robots.txt | Search engines struggle to discover pages | High |
| No image optimization | Large images slow page load | High |
| Static data, no CMS | Cannot scale content operations | Medium |

### Current Components (3)
- `Layout.tsx` - Header, Footer, Navigation (220 lines)
- `ArticleCard.tsx` - Story display component (3 variants)
- `Button.tsx` - Reusable button component

### Current Pages (4)
- `Home.tsx` - Homepage with hero, pillars, stories, events
- `ArticlePage.tsx` - Individual article view
- `SectionPage.tsx` - Category listing pages
- `AboutPage.tsx` - About/mission page

---

## Target Architecture: Next.js 15 App Router

### Why Next.js 15?
1. **Server Components by default** - Better SEO, faster initial load
2. **Metadata API** - Built-in SEO management
3. **Image Optimization** - Automatic WebP/AVIF, lazy loading
4. **Partial Prerendering** - Combine static + dynamic content
5. **Streaming** - Progressive rendering for better UX
6. **File-based routing** - Simpler, more intuitive
7. **Built-in performance** - Code splitting, prefetching automatic

### Recommended Tech Stack
```
Framework:        Next.js 15 (App Router)
Styling:          Tailwind CSS 4 (keep existing)
Icons:            lucide-react (keep existing)
CMS:              Sanity.io (recommended) or Contentful
Email:            Resend + React Email
Payments:         Stripe
Analytics:        Vercel Analytics + Google Analytics 4
Search:           Algolia (Phase 2)
Hosting:          Vercel (optimal for Next.js)
```

---

## Directory Structure (Next.js App Router)

```
impact-post-next/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout (header, footer)
│   │   ├── page.tsx                # Homepage
│   │   ├── loading.tsx             # Global loading UI
│   │   ├── error.tsx               # Global error boundary
│   │   ├── not-found.tsx           # 404 page
│   │   ├── globals.css             # Global styles
│   │   │
│   │   ├── (marketing)/            # Route group for public pages
│   │   │   ├── about/
│   │   │   │   └── page.tsx
│   │   │   ├── contact/
│   │   │   │   └── page.tsx
│   │   │   └── support/
│   │   │       └── page.tsx
│   │   │
│   │   ├── news/                   # Content pillar routes
│   │   │   ├── page.tsx            # All news listing
│   │   │   └── [category]/
│   │   │       ├── page.tsx        # Category listing
│   │   │       └── [slug]/
│   │   │           └── page.tsx    # Individual article
│   │   │
│   │   ├── youth-hub/
│   │   │   ├── page.tsx
│   │   │   ├── spotlights/
│   │   │   └── submit/
│   │   │
│   │   ├── multimedia/
│   │   │   ├── page.tsx
│   │   │   ├── videos/
│   │   │   ├── podcasts/
│   │   │   └── photo-essays/
│   │   │
│   │   ├── community/
│   │   │   ├── page.tsx
│   │   │   ├── events/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/page.tsx
│   │   │   ├── directory/          # Business directory (Phase 2)
│   │   │   └── resources/
│   │   │
│   │   ├── api/                    # API routes
│   │   │   ├── newsletter/
│   │   │   ├── contact/
│   │   │   └── revalidate/
│   │   │
│   │   ├── sitemap.ts              # Dynamic sitemap
│   │   └── robots.ts               # Dynamic robots.txt
│   │
│   ├── components/
│   │   ├── ui/                     # Base UI components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   └── badge.tsx
│   │   │
│   │   ├── layout/                 # Layout components
│   │   │   ├── header.tsx
│   │   │   ├── footer.tsx
│   │   │   ├── navigation.tsx
│   │   │   ├── mobile-menu.tsx
│   │   │   └── ticker.tsx
│   │   │
│   │   ├── articles/               # Article components
│   │   │   ├── article-card.tsx
│   │   │   ├── article-grid.tsx
│   │   │   ├── featured-article.tsx
│   │   │   └── article-body.tsx
│   │   │
│   │   ├── home/                   # Homepage sections
│   │   │   ├── hero-section.tsx
│   │   │   ├── pillars-section.tsx
│   │   │   ├── youth-hub-section.tsx
│   │   │   ├── events-sidebar.tsx
│   │   │   └── support-banner.tsx
│   │   │
│   │   └── forms/                  # Form components
│   │       ├── newsletter-form.tsx
│   │       └── contact-form.tsx
│   │
│   ├── lib/                        # Utilities
│   │   ├── utils.ts                # Helper functions
│   │   ├── constants.ts            # Site constants
│   │   └── sanity/                 # CMS client (Phase 2)
│   │       ├── client.ts
│   │       └── queries.ts
│   │
│   └── types/
│       └── index.ts                # TypeScript types
│
├── public/
│   ├── images/
│   ├── fonts/
│   └── favicon.ico
│
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## Migration Phases

### Phase 1: Foundation (Week 1-2) - CRITICAL
**Goal**: Working Next.js app with SEO fundamentals

#### 1.1 Project Setup
```bash
npx create-next-app@latest impact-post-next --typescript --tailwind --eslint --app --src-dir
```

#### 1.2 SEO Foundation
- [ ] Root layout with metadata
- [ ] Dynamic metadata for all routes
- [ ] Open Graph images
- [ ] Twitter Cards
- [ ] JSON-LD structured data (Article, Organization schemas)
- [ ] sitemap.ts (dynamic)
- [ ] robots.ts

**SEO Metadata Template:**
```typescript
// src/app/layout.tsx
export const metadata: Metadata = {
  metadataBase: new URL('https://impactpost.ca'),
  title: {
    default: 'IMPACT POST | Voices of Strength. Stories of Impact.',
    template: '%s | IMPACT POST'
  },
  description: 'Amplifying the voices, stories, and achievements of equity-deserving communities through independent journalism.',
  keywords: ['community news', 'equity journalism', 'diaspora media', 'Canadian news'],
  authors: [{ name: 'IMPACT POST' }],
  openGraph: {
    type: 'website',
    locale: 'en_CA',
    siteName: 'IMPACT POST',
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@impactpost',
  },
  robots: {
    index: true,
    follow: true,
  }
};
```

#### 1.3 Core Pages Migration
- [ ] Homepage (Server Component with streaming)
- [ ] Article page with dynamic metadata
- [ ] Section/Category pages
- [ ] About page
- [ ] 404 page
- [ ] Error boundary

#### 1.4 Component Migration
- [ ] Layout → Server Component + Client islands
- [ ] ArticleCard → Server Component
- [ ] Button → Client Component (interactions)
- [ ] Navigation → Hybrid (menu = client)

---

### Phase 2: Content & Data Layer (Week 3-4)
**Goal**: CMS integration, scalable content

#### 2.1 Sanity CMS Setup (Recommended)
- [ ] Define content schemas (Article, Author, Event, Category)
- [ ] Set up Sanity Studio
- [ ] Create GROQ queries
- [ ] Implement ISR (Incremental Static Regeneration)
- [ ] Webhook for on-demand revalidation

**Rendering Strategy:**
| Route | Strategy | Revalidation |
|-------|----------|--------------|
| Homepage | ISR | 60 seconds |
| Article pages | SSG + ISR | On publish |
| Category pages | ISR | 60 seconds |
| About/Static | SSG | Build time |

#### 2.2 Data Migration
- [ ] Migrate static data to CMS
- [ ] Create content import scripts
- [ ] Set up preview mode for editors

---

### Phase 3: Performance Optimization (Week 5)
**Goal**: Core Web Vitals excellence

#### 3.1 Image Optimization
```typescript
// Use Next.js Image component everywhere
import Image from 'next/image';

<Image
  src={story.imageUrl}
  alt={story.title}
  width={800}
  height={600}
  priority={featured}  // For above-fold images
  placeholder="blur"
  blurDataURL={story.blurHash}
/>
```

#### 3.2 Font Optimization
```typescript
// src/app/layout.tsx
import { Inter, Playfair_Display } from 'next/font/google';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap'
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap'
});
```

#### 3.3 Performance Targets
| Metric | Target | Current Issue |
|--------|--------|---------------|
| LCP (Largest Contentful Paint) | < 2.5s | Client render delay |
| FID (First Input Delay) | < 100ms | Heavy JS bundle |
| CLS (Cumulative Layout Shift) | < 0.1 | Image placeholders |
| TTFB (Time to First Byte) | < 800ms | No SSR |

#### 3.4 Bundle Optimization
- [ ] Dynamic imports for heavy components
- [ ] Route-based code splitting (automatic)
- [ ] Tree shaking verification
- [ ] Bundle analyzer review

---

### Phase 4: Features & Integration (Week 6-7)
**Goal**: Full feature parity + new capabilities

#### 4.1 Newsletter Integration
```typescript
// Server Action for newsletter
'use server';
import { Resend } from 'resend';

export async function subscribeNewsletter(formData: FormData) {
  const email = formData.get('email');
  // Add to Resend audience
  // Send welcome email
}
```

#### 4.2 Search Implementation
- [ ] Client-side search with Algolia InstantSearch
- [ ] Server-side search fallback
- [ ] Search page with filters

#### 4.3 Analytics Setup
- [ ] Vercel Analytics (automatic)
- [ ] Google Analytics 4
- [ ] Custom event tracking

---

### Phase 5: PRD Features (Week 8-10)
**Goal**: Implement features from PRD roadmap

#### 5.1 Events Calendar
- [ ] Event listing page
- [ ] Event detail page
- [ ] iCal export
- [ ] Event submission form

#### 5.2 Youth Hub
- [ ] Youth spotlights section
- [ ] Story submission form
- [ ] Youth-specific content filter

#### 5.3 Support/Donations
- [ ] Stripe integration
- [ ] Donation page
- [ ] Membership tiers (foundation)

---

## UX Improvements

### Navigation
- [ ] Sticky header with scroll behavior
- [ ] Mobile-first responsive menu
- [ ] Breadcrumb navigation
- [ ] "Back to top" button
- [ ] Reading progress indicator (articles)

### Content Discovery
- [ ] Related articles component
- [ ] "Read next" suggestions
- [ ] Category filters
- [ ] Tag system
- [ ] Search with autocomplete

### Accessibility (WCAG 2.1 AA)
- [ ] Keyboard navigation
- [ ] Focus indicators
- [ ] Skip to content link
- [ ] ARIA labels
- [ ] Color contrast verification
- [ ] Screen reader testing

### Performance Perception
- [ ] Skeleton loaders
- [ ] Optimistic UI updates
- [ ] Page transition animations
- [ ] Prefetch on hover

---

## Stability & Reliability

### Error Handling
```typescript
// src/app/error.tsx
'use client';
export default function Error({ error, reset }) {
  return (
    <div className="error-container">
      <h2>Something went wrong</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}
```

### Testing Strategy
| Type | Tools | Coverage Target |
|------|-------|-----------------|
| Unit | Vitest | 80% utilities |
| Component | React Testing Library | Critical components |
| E2E | Playwright | User flows |
| Visual | Chromatic | UI regression |

### Monitoring
- [ ] Vercel Error Tracking
- [ ] Sentry integration
- [ ] Uptime monitoring
- [ ] Core Web Vitals monitoring

### CI/CD Pipeline
```yaml
# .github/workflows/ci.yml
- Lint (ESLint)
- Type check (TypeScript)
- Unit tests
- Build verification
- Lighthouse CI
- Preview deployment
```

---

## SEO Checklist

### Technical SEO
- [ ] Clean URL structure (`/news/community-voices/article-slug`)
- [ ] Canonical URLs
- [ ] Hreflang tags (future: multi-language)
- [ ] XML Sitemap with all pages
- [ ] robots.txt properly configured
- [ ] No broken links (404 monitoring)

### On-Page SEO
- [ ] Unique title tags per page
- [ ] Meta descriptions (150-160 chars)
- [ ] H1 tags (one per page)
- [ ] Image alt text
- [ ] Internal linking strategy
- [ ] External links with rel="noopener"

### Structured Data
```typescript
// Article schema
{
  "@context": "https://schema.org",
  "@type": "NewsArticle",
  "headline": article.title,
  "image": article.imageUrl,
  "datePublished": article.publishedAt,
  "dateModified": article.updatedAt,
  "author": {
    "@type": "Person",
    "name": article.author.name
  },
  "publisher": {
    "@type": "Organization",
    "name": "IMPACT POST",
    "logo": {
      "@type": "ImageObject",
      "url": "https://impactpost.ca/logo.png"
    }
  }
}
```

### Social Sharing
- [ ] Open Graph tags
- [ ] Twitter Cards
- [ ] Facebook debugger testing
- [ ] LinkedIn post inspector testing

---

## Migration Execution Plan

### Pre-Migration
1. [ ] Audit current content URLs
2. [ ] Set up redirects map
3. [ ] Document all current functionality
4. [ ] Set up staging environment

### Migration Steps
1. [ ] Create Next.js project alongside existing
2. [ ] Migrate components incrementally
3. [ ] Test each route thoroughly
4. [ ] Set up 301 redirects from old URLs
5. [ ] Deploy to staging
6. [ ] QA testing
7. [ ] Performance testing
8. [ ] SEO audit (Lighthouse, ahrefs)
9. [ ] Deploy to production
10. [ ] Monitor for issues

### Post-Migration
1. [ ] Submit new sitemap to Google Search Console
2. [ ] Monitor Core Web Vitals
3. [ ] Check for crawl errors
4. [ ] Verify all redirects work
5. [ ] Monitor analytics for traffic changes

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| SEO ranking drop | 301 redirects, gradual rollout |
| Broken links | Link audit, redirect map |
| Performance regression | Lighthouse CI, monitoring |
| CMS learning curve | Phased CMS adoption |
| Downtime | Blue-green deployment |

---

## Success Metrics

### Technical
- [ ] Lighthouse Performance: >90
- [ ] Lighthouse SEO: >95
- [ ] Lighthouse Accessibility: >95
- [ ] LCP < 2.5s
- [ ] CLS < 0.1
- [ ] FID < 100ms

### Business
- [ ] Organic traffic increase: 50% in 3 months
- [ ] Page views per session: +30%
- [ ] Bounce rate decrease: -20%
- [ ] Newsletter signups: +40%

---

## Timeline Summary

| Phase | Duration | Deliverables |
|-------|----------|--------------|
| 1. Foundation | 2 weeks | Working Next.js app with SEO |
| 2. Content Layer | 2 weeks | CMS integration |
| 3. Performance | 1 week | Core Web Vitals optimization |
| 4. Features | 2 weeks | Full feature parity |
| 5. PRD Features | 2-3 weeks | Events, Youth Hub, Donations |
| **Total** | **9-10 weeks** | Production-ready platform |

---

## Appendix

### Useful Resources
- [Next.js Documentation](https://nextjs.org/docs)
- [Next.js Migration from Vite](https://nextjs.org/docs/app/guides/migrating/from-vite)
- [Next.js SEO Guide](https://nextjs.org/learn/seo)
- [Sanity.io + Next.js Guide](https://www.sanity.io/guides/nextjs-app-router)
- [Vercel Analytics](https://vercel.com/analytics)

### Key Dependencies
```json
{
  "dependencies": {
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "@sanity/client": "^6.0.0",
    "lucide-react": "^0.555.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0"
  },
  "devDependencies": {
    "@types/node": "^22.0.0",
    "@types/react": "^19.0.0",
    "typescript": "^5.8.0",
    "tailwindcss": "^4.0.0",
    "eslint": "^9.0.0",
    "eslint-config-next": "^15.0.0"
  }
}
```

---

**Document Version**: 1.0  
**Created**: December 4, 2025  
**Status**: Ready for Review
