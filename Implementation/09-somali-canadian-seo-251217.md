# Somali-Canadian SEO Refinement Implementation

**Date:** 2025-12-17
**Feature:** SEO Refinement & Canada-Somali Diaspora Targeting

## Overview
Implemented a consolidated SEO strategy targeting the Canadian-Somali diaspora, based on a comparative review of developer proposals and industry best practices. The implementation focuses on optimal title lengths, visible H1 headers, geographic keywords key to the diaspora, and enhanced Schema.org structured data.

## Changes

### 1. Global SEO Configuration (`src/lib/constants.ts`)
- **Tagline**: Updated to "Canadian-Somali News & Perspectives" (35 chars) to balance niche targeting with professional tone.
- **Meta Description**: Updated to 155 chars to maximize mobile visibility while maintaining urgency:
  > "Leading voice of the Canadian-Somali diaspora. Independent news, youth stories, and community perspectives from Toronto to Vancouver. Stay informed."
- **Keywords**: Implemented a comprehensive keyword array covering:
  - **Niche**: "Canadian Somali news", "Somali diaspora Canada"
  - **Geographic**: "Toronto Somali community", "Edmonton", "Ottawa", "Vancouver"
  - **Topics**: "diaspora journalism", "Somali youth Canada"

### 2. Layout & Structured Data (`src/app/layout.tsx`)
- **JSON-LD Schema**:
  - Added `areaServed`: `{ "@type": "Country", "name": "Canada" }`
  - Added `audience`: `{ "@type": "Audience", "audienceType": "Canadian-Somali diaspora" }`
- **Metadata**: Verified integration of new `SITE_CONFIG` keywords and template.

### 3. Visible H1 Implementation (`src/app/page.tsx`)
- **Strategy**: Replaced hidden/screen-reader-only H1 (which risks "cloaking" penalties) with a visible, design-integrated header.
- **Component**:
  ```tsx
  <section className="container mx-auto px-4 pt-6 pb-2">
    <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-800 border-l-4 border-brand-purple pl-4">
      Impact Post: Voices of the Canadian-Somali Diaspora
    </h1>
  </section>
  ```
- **Placement**: Located immediately below navigation, before the Lead Story/Hero section.

## Verification Checklist
- [x] **Title Tags**: Browser tabs show correct localized title format.
- [x] **Meta Description**: Verified 155 char count and content in `constants.ts`.
- [x] **H1 Visibility**: Verified `<h1>` is visible in DOM and styled correctly in `page.tsx`.
- [x] **Schema**: Verified `application/ld+json` contains correct `areaServed` and `audience` in `layout.tsx`.
- [x] **Build**: Changes passed type checking and linting.
