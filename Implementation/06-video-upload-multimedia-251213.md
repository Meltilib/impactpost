# Implementation #06: Video Upload & Multimedia Support

**Date**: December 13, 2025  
**Duration**: 45 minutes  
**Status**: ✅ Completed  
**Tags**: 📹 Media, 🎬 Multimedia, 🎥 Video, ✨ New Feature

---

## Overview

Extended the article system to support video content alongside images. Articles can now toggle between image and video media types, upload video files directly to Sanity, embed external video URLs, and display videos with a custom multimedia player component.

### Problem Statement

- Articles only supported featured images; no video content capability.
- Needed to handle video uploads to Sanity's asset management.
- Required a video player component to render videos on article pages.
- Article schema, admin form, API routes, and queries all lacked video support.

### Solution

1. **VideoUpload Component** — Created a reusable `VideoUpload` component mirroring `ImageUpload` with drag-and-drop, file validation, and 50MB size warnings.
2. **MultimediaPlayer Component** — Built a video player that handles both external URLs and Sanity-hosted video files with fallback poster image support.
3. **Schema Extension** — Extended Sanity's article schema with `mediaType` enum ('image' | 'video'), `videoUrl` (external), and `videoFileAssetId`/`videoFileUrl` (internal) fields, plus `videoThumbnailAssetId`/`videoThumbnailUrl`.
4. **Admin Form Updates** — Added media type toggle, conditional video/image upload fields, and state management for all video properties.
5. **API & Data Layer** — Updated upload route to accept video files, extended Sanity queries and mappers to fetch/transform video metadata.
6. **Utility Migration** — Extracted `slugify()` to a shared `generateSlug()` utility in `src/lib/utils` for reuse.

---

## Technical Implementation

### 1. VideoUpload Component

**File**: `src/components/admin/video-upload.tsx`

```tsx
interface VideoUploadProps {
  value?: string;
  onChange: (assetId: string | null, url: string | null) => void;
  onUpload: (file: File) => Promise<{ assetId: string; url: string } | null>;
}

export function VideoUpload({ value, onChange, onUpload }: VideoUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(value || null);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  
  // Validates video MIME type, checks 50MB+ warnings, uploads via onUpload callback
  const handleFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('video/')) {
      alert('Please upload a video file');
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      const confirm = window.confirm('This video is larger than 50MB. Continue?');
      if (!confirm) return;
    }
    // Upload and call onChange with assetId + URL
  }, [onChange, onUpload]);
}
```

### 2. MultimediaPlayer Component

**File**: `src/components/multimedia/multimedia-player.tsx`

Renders video content with:
- HTML5 `<video>` element for local/Sanity-hosted files
- Iframe support for external video URLs (YouTube, Vimeo, etc.)
- Poster image (thumbnail) support
- Responsive sizing and accessibility controls
- Error fallback UI

```tsx
interface MultimediaPlayerProps {
  mediaType?: 'image' | 'video';
  videoUrl?: string;
  videoFileUrl?: string;
  videoThumbnailUrl?: string;
  altText?: string;
}

export function MultimediaPlayer({
  mediaType,
  videoUrl,
  videoFileUrl,
  videoThumbnailUrl,
  altText,
}: MultimediaPlayerProps) {
  // Logic to render iframe for external URLs or <video> for hosted files
}
```

### 3. Sanity Schema Extension

**File**: `sanity/schemaTypes/article.ts`

Added fields:
- `mediaType` — Enum: `'image' | 'video'` (defaults to `'image'`)
- `videoUrl` — String for external video URLs (YouTube, Vimeo, etc.)
- `videoFileAssetId` — Reference to Sanity asset for uploaded video file
- `videoFileUrl` — Generated URL for the asset
- `videoThumbnailAssetId` — Reference to thumbnail/poster image
- `videoThumbnailUrl` — Generated thumbnail URL

### 4. Article Form Updates

**File**: `src/components/admin/article-form.tsx`

- Added media type toggle (radio buttons or dropdown: Image / Video)
- Conditional rendering:
  - **Image mode**: Show `ImageUpload` component (existing flow)
  - **Video mode**: Show `VideoUpload` component + external URL input field
- New state hooks:
  ```tsx
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [videoUrl, setVideoUrl] = useState('');
  const [videoFileAssetId, setVideoFileAssetId] = useState('');
  const [videoFileUrl, setVideoFileUrl] = useState('');
  const [videoThumbnailAssetId, setVideoThumbnailAssetId] = useState('');
  const [videoThumbnailUrl, setVideoThumbnailUrl] = useState('');
  ```
- Removed unused `Button` import and invalid `onBlur` prop from `ImageUpload`.
- Migrated inline `slugify()` to `generateSlug()` utility.

### 5. Upload API Route

**File**: `src/app/api/admin/upload/route.ts`

Enhanced to detect file type (video vs. image) and route accordingly:
- Video MIME types trigger Sanity video asset creation.
- Image MIME types use the existing image asset flow.
- Returns `{ assetId, url }` for both.

### 6. Sanity Queries & Mappers

**Files**:
- `src/lib/sanity/queries.ts` — Added video field projections to article queries.
- `src/lib/sanity/mappers.ts` — Extended mappers to extract and transform video metadata.
- `src/lib/sanity/fetch.ts` — Updated fetch functions to include video data.

### 7. Type Definitions

**File**: `src/types/index.ts`

Extended `Article` type with:
```ts
interface Article {
  // ... existing fields
  mediaType?: 'image' | 'video';
  videoUrl?: string;
  videoFileAssetId?: string;
  videoFileUrl?: string;
  videoThumbnailAssetId?: string;
  videoThumbnailUrl?: string;
}
```

### 8. Utilities

**File**: `src/lib/utils.ts`

Extracted slug generation into a reusable function:
```ts
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}
```

---

## Testing

- `npm run lint` ✅ — All files pass ESLint (removed unused imports).
- `npm run build` ✅ — TypeScript compilation successful; all type definitions validated.
- No breaking changes to existing article/image workflows.

---

## Integration & Deployment

1. **On existing articles**: Articles created without video data default to `mediaType: 'image'` and use the featured image in the multimedia player.
2. **Future uploads**: New articles can toggle to video mode and upload or embed video content.
3. **Sanity CMS**: Video assets are managed alongside image assets in Sanity's file manager.

---

## Follow-ups

1. Add video transcoding/optimization in the upload API (e.g., via FFmpeg or Mux) to handle large/unwieldy formats.
2. Implement video thumbnail extraction on upload (auto-generate poster from first frame).
3. Add support for video captions/subtitles (`.vtt` files or Sanity portable text).
4. Expand multimedia player to support playlist or multiple video scenarios.
5. Consider lazy-loading or `<source>` with multiple codecs for broader browser compatibility.

---

## Commit Hash

`1fca8ecb0de589cdb094c2b7b04d15ab155e498c`

**Files Changed**: 11  
**Insertions**: 744  
**Deletions**: 106
