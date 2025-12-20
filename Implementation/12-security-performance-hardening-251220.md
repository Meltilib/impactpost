# #12 | 2025-12-20 | Security & Performance Hardening

## Overview
Comprehensive hardening of the IMPACTPOST codebase focusing on security attack vectors, API resilience, and code hygiene. This phase ensures the application is production-ready for high traffic and protected against common web vulnerabilities.

## Technical Changes

### 🔐 1. Security Attack Vectors
- **IP Rate Limiting**: Implemented sliding-window rate limiting on `/api/newsletter/subscribe` using Upstash Redis (5 requests/minute).
- **HMAC Verification**: Added robust HMAC-SHA256 signature verification for Sanity webhooks in `/api/revalidate`, supporting both Hex and Base64 signatures.
- **Open Redirect Protection**: Strict validation of redirect paths in `/api/disable-draft` to ensure only internal paths are allowed.
- **Authorization**: Added explicit `requireAdmin()` guards to all admin API endpoints as defense-in-depth.
- **Upload Hardening**: Enforced 10MB file size limits and MIME type allowlists in `/api/admin/upload`.

### 🚀 2. Performance & Resilience
- **Broadcast sequential batching**: Refactored newsletter broadcast to process subscribers in sequential batches (49 recipients) with small delays to avoid hitting Resend rate limits.
- **Pagination**: Implemented automatic pagination for fetching large subscriber lists from Resend during broadcast.
- **Serverless Optimization**: Set `maxDuration = 60` for the broadcast route to reduce timeout risks on larger sends.
- **Duplicate Check O(1)**: Optimized newsletter subscription to use a "try-create" pattern instead of fetching all contacts.

### 🔧 3. Code Hygiene & DX
- **Centralized Utilities**: Created `fetchWithTimeout` and `escapeHtml` in `src/lib/utils.ts` for unified cross-route usage.
- **Hydration Fix**: Resolved initial render mismatch in `useBookmarks.ts` by delaying localStorage access until `useEffect`.
- **Type Safety**: Eliminated `any` types in admin actions for advertisement documents.

## Files Touched
- `src/app/api/newsletter/subscribe/route.ts`
- `src/app/api/admin/newsletter/send/route.ts`
- `src/app/api/admin/subscribers/route.ts`
- `src/app/api/revalidate/route.ts`
- `src/lib/rate-limit.ts`
- `src/lib/utils.ts`
- `src/lib/admin/actions.ts`
- `src/hooks/use-bookmarks.ts`
- `src/app/layout.tsx`

## Verification
- Verified rate limiting with multiple sequential requests (returned 429).
- Verified valid and invalid HMAC signatures for revalidation.
- Full `npm run lint` and `npx tsc --noEmit` validation passed.
