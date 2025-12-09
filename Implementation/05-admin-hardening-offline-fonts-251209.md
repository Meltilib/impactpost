# Implementation #05: Admin Hardening & Offline Fonts

**Date**: December 9, 2025  
**Duration**: 60 minutes  
**Status**: ✅ Completed  
**Tags**: 🔐 Auth, 🛡️ Security, 🔧 Engineering, 🅰️ Accessibility

---

## Overview

Clerk sign-ins were stuck in a redirect loop, admin APIs were callable without authentication, and `next/font` builds failed in offline environments. This implementation tightens every admin entry point, guards all server actions, and vendors our Google Fonts locally so builds no longer require outbound requests.

### Problem Statement

- `/admin/sign-in` was wrapped by the middleware, so unauthenticated users bounced forever.
- `/api/admin/*` routes (image upload) and all server actions skipped role checks, enabling anonymous mutations if someone discovered the endpoints.
- `getUserRole()` crashed when Clerk wasn't configured, preventing local development.
- `next/font/google` attempted to download fonts during every build; the sandbox blocked those requests causing build failures.

### Solution

1. Refined the middleware to allow the sign-in path while enforcing Clerk auth across `/admin` and `/api/admin`. Added a graceful fallback when Clerk keys are missing.
2. Required `requireAdmin` / `requireAdminOrEditor` everywhere: page-level guards, server actions, and the upload API, plus a resilient `getUserRole()` that tolerates missing Clerk config.
3. Downloaded Inter, Archivo Black, and Space Grotesk `.ttf` files into `public/fonts/**` and switched to `next/font/local`, keeping the exact CSS variables while eliminating the dependency on Google Fonts.

---

## Technical Implementation

### 1. Middleware & Permission Helper

**Files**
- `src/middleware.ts`
- `src/lib/auth/permissions.ts`

```ts
const isAdminRoute = createRouteMatcher(['/admin(.*)']);
const isAdminSignInRoute = createRouteMatcher(['/admin/sign-in(.*)']);
const isAdminApiRoute = createRouteMatcher(['/api/admin(.*)']);

export default isClerkConfigured
  ? clerkMiddleware(async (auth, req) => {
      if (isAdminApiRoute(req)) {
        await auth.protect();
        return;
      }
      if (isAdminRoute(req) && !isAdminSignInRoute(req)) {
        await auth.protect();
      }
    })
  : fallbackMiddleware;
```

`getUserRole()` now bails early when Clerk isn't configured and wraps `clerkClient.users.getUser` in a `try/catch`, logging a warning instead of throwing. This keeps local dev (no Clerk keys) functional.

### 2. Route Guards & Server Actions

**Files**
- `src/app/admin/**/*.tsx`
- `src/lib/admin/actions.ts`
- `src/app/api/admin/upload/route.ts`

Applied `requireAdminOrEditor()` to dashboard/new/edit pages and `requireAdmin()` to author/category/settings screens. Every server action (`createArticle`, `updateAuthor`, etc.) now awaits the appropriate guard, ensuring mutations cannot run unless Clerk authenticates the request first. The upload API rejects callers without a role:

```ts
const role = await getUserRole();
if (!role) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
```

### 3. Offline Google Fonts

**Files**
- `public/fonts/inter/*.ttf`
- `public/fonts/archivo-black/*.ttf`
- `public/fonts/space-grotesk/*.ttf`
- `src/app/layout.tsx`

Downloaded the required weights (Inter 400/700, Space Grotesk 400/700, Archivo Black 400) and replaced the `next/font/google` imports with a single `localFont` declaration per family. Existing CSS variables (`--font-sans`, `--font-heavy`, `--font-display`) and `display: 'swap'` remain unchanged, so the UI renders identically but never contacts Google’s CDN.

---

## Testing

- `npm run lint` ✅ — clean after the TypeScript guard changes.
- `npm run build` ⚠️ — fonts no longer trigger network fetches, but Turbopack still fails later because the sandbox cannot bind a port (`Operation not permitted`). This is an environment limitation; switch to the webpack builder or allow the process binding to finish the build locally.

---

## Follow-ups

1. Decide when to migrate from `middleware.ts` to the new Next.js `proxy` convention (Next now prints a warning during builds).
2. Consider scoping revalidation and ISR tags based on category/slug to avoid blanket `revalidatePath('/section')` calls.
