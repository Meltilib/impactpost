# Advertisement Tracking Feature Implementation

**Date:** 2025-12-16
**Feature:** Advertisement Tracking in Admin Portal

## Overview
Implemented a complete Advertisement Tracking system within the Admin Portal and Sanity CMS to manage ad campaigns and tag articles as sponsored content. This allows the editorial team to track revenue, manage campaign dates, and associate content with specific advertisers.

## Changes

### 1. Sanity Schema Updates
- **New `advertisement` Schema** (`sanity/schemaTypes/advertisement.ts`):
    - Fields: Title, Client Name, Revenue, Start/End Dates, Auto-renewal, Status, Image, Destination URL, Disclosure Text.
- **Updated `article` Schema** (`sanity/schemaTypes/article.ts`):
    - Added `isSponsored` boolean field.
    - Added `sponsor` reference field (links to `advertisement`), hidden if not sponsored.
- **Schema Registration**: Registered new types in `sanity/schemaTypes/index.ts`.

### 2. Admin Portal Features (`/admin`)

#### Advertisement Management
- **Dashboard (`/admin/advertisements`)**:
    - List view of all campaigns.
    - Displays status chips (Active, Scheduled, Expired).
    - Shows revenue and date ranges.
    - Delete functionality with confirmation.
- **Create & Edit Pages**:
    - `/admin/advertisements/new`: Form to create new campaigns.
    - `/admin/advertisements/edit/[id]`: Form to update existing campaigns.
- **Reusable Component**:
    - `AdvertisementForm`: Handles form state for both create and edit modes, including image uploads for ad creatives.

#### Article Management Updates
- **Article Editor (`/admin/new`, `/admin/edit/[id]`)**:
    - Added "Sponsored Content" toggle.
    - When enabled, exposes a dropdown to select an active Advertisement campaign.
    - Updates are persisted to Sanity via server actions.

### 3. Backend Actions (`src/lib/admin/actions.ts`)
- **New Functions**:
    - `fetchAdvertisements()`: Get all ads ordered by date.
    - `fetchAdvertisementById(id)`: Get single ad details.
    - `createAdvertisement(payload)`: Create new ad document.
    - `updateAdvertisement(id, payload)`: Update ad fields.
    - `deleteAdvertisement(id)`: Remove ad document.
- **Modified Functions**:
    - `createArticle`, `updateArticle`, `fetchArticleById`: Updated to handle `isSponsored` and `sponsor` reference.

## Verification
- **Linting**: Run `npm run lint` - Passed.
- **Build**: Run `npm run build` - Passed.
- **Manual**: Verified in Sanity Studio that schemas appear correctly and data is saved. Verified in Admin Portal that pages load and forms submit correctly.
