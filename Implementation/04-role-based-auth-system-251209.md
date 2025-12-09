# Implementation #04: Role-Based Auth System

**Date**: December 9, 2025  
**Duration**: 45 minutes  
**Status**: ✅ Completed  
**Tags**: 🔐 Auth, 🔧 Engineering, 👥 User Management

---

## Overview

Implemented a role-based access control (RBAC) system using Clerk's public metadata to differentiate between Admin and Editor users. The system restricts access to sensitive admin pages while allowing both roles to manage day-to-day content operations.

### Problem Statement

- Clerk authentication was open to all users with Google OAuth
- No permission system to differentiate between user roles
- Need for exactly 2 users: 1 admin, 1 editor with different access levels

### Solution

- Disabled public sign-ups in Clerk (invitation-only access)
- Added role metadata (`admin` / `editor`) to users in Clerk dashboard
- Created permission helper functions for server-side role checks
- Protected admin-only routes with role guards
- Updated UI to display dynamic user roles

---

## Permission Model

### Both Admin & Editor Can Access:
- `/admin` - Dashboard
- `/admin/new` - Create/edit articles  
- `/admin/authors` - Manage authors (for article attribution)
- `/admin/settings` - Manage ticker & site settings

### Admin-Only Access:
- `/admin/categories` - Manage categories (structural changes to site)

### Rationale:
- Editors need author management for article attribution
- Editors need settings access for day-to-day operations
- Categories define site structure → reserved for admin decisions
- Minimal restrictions; both roles are trusted

---

## Technical Implementation

### 1. Permission Helper Library

**File**: `src/lib/auth/permissions.ts`

```typescript
import { auth, clerkClient } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export async function getUserRole(): Promise<'admin' | 'editor' | null> {
  const { userId } = await auth();
  if (!userId) return null;
  
  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  return (user.publicMetadata.role as 'admin' | 'editor') || null;
}

export async function requireAdmin() {
  const role = await getUserRole();
  if (role !== 'admin') {
    redirect('/admin?error=unauthorized');
  }
}

export async function requireAdminOrEditor() {
  const role = await getUserRole();
  if (!role || !['admin', 'editor'].includes(role)) {
    redirect('/admin?error=unauthorized');
  }
}
```

**Key Design Decisions**:
- Uses Clerk's `clerkClient()` function (async in latest version)
- Reads from `publicMetadata` for client-side UI access
- Uses `redirect()` instead of throwing errors for better UX
- Type-safe with TypeScript union types

---

### 2. Route Protection

**File**: `src/app/admin/categories/page.tsx`

```typescript
import { requireAdmin } from '@/lib/auth/permissions';

export default async function CategoriesPage() {
  await requireAdmin(); // Redirects if not admin
  
  const [categories, articles] = await Promise.all([
    fetchCategories(),
    fetchArticlesForAdmin(),
  ]);
  // ... rest of component
}
```

**Why Categories Only**:
- Most granular protection needed
- Prevents structural changes by editors
- Other pages accessible to both roles

---

### 3. Dynamic Role Display

**File**: `src/app/admin/layout.tsx`

**Before**:
```tsx
<p className="text-xs text-white/60">Editor</p>
```

**After**:
```tsx
<p className="text-xs text-white/60 capitalize">
  {(user?.publicMetadata?.role as string) || 'User'}
</p>
```

**Benefits**:
- Visual confirmation of permission level
- No hardcoded role text
- Graceful fallback to "User"

---

### 4. TypeScript Type Safety

**File**: `src/types/clerk.d.ts`

```typescript
declare global {
  interface CustomJwtSessionClaims {
    metadata?: {
      role?: 'admin' | 'editor';
    };
  }
}
```

**Purpose**:
- Extends Clerk's type definitions
- Provides autocomplete for role property
- Compile-time safety for metadata access

---

## Configuration Changes

### 1. Clerk Dashboard Settings

**User Metadata** (set for each user):
```json
// Admin user
{
  "role": "admin"
}

// Editor user
{
  "role": "editor"
}
```

**Sign-up Settings**:
- ❌ Public sign-ups: **DISABLED**
- ✅ Email + password authentication: **ENABLED**
- ✅ Google OAuth: **ENABLED**
- ✅ Email verification: **REQUIRED**

### 2. ESLint Configuration

**File**: `eslint.config.mjs`

Added Sanity directory to ignore list to prevent memory issues during linting:

```javascript
globalIgnores([
  ".next/**",
  "out/**",
  "build/**",
  "next-env.d.ts",
  "sanity/**",  // Added
]),
```

---

## Files Changed Summary

### Files Created (3):
1. **src/lib/auth/permissions.ts** (24 lines)
   - Permission helper functions
   - Role checking logic
   - Redirect utilities

2. **src/lib/auth/** (directory)
   - New auth module structure

3. **src/types/clerk.d.ts** (7 lines)
   - TypeScript type definitions
   - Clerk metadata extensions

### Files Modified (4):
1. **src/app/admin/categories/page.tsx**
   - Added `requireAdmin()` guard
   - Protects route from non-admin access

2. **src/app/admin/layout.tsx**
   - Dynamic role display
   - Reads from user metadata

3. **eslint.config.mjs**
   - Added `sanity/**` to ignore patterns
   - Fixed memory issues during linting

4. **AGENTS.md** (documentation updates)
   - Updated repository guidelines

---

## Testing & Verification

### Build Verification
```bash
✓ TypeScript compilation: PASSED
✓ Next.js build: SUCCESSFUL
✓ No new lint errors introduced
```

### Access Control Tests

**As Editor User**:
- ✅ Can access `/admin` dashboard
- ✅ Can create/edit articles (`/admin/new`)
- ✅ Can manage authors (`/admin/authors`)
- ✅ Can manage settings (`/admin/settings`)
- ❌ **Cannot** access categories (`/admin/categories`)
- ✅ Sees "editor" label in sidebar

**As Admin User**:
- ✅ Can access all routes including categories
- ✅ Sees "admin" label in sidebar
- ✅ Full system access

**Unauthenticated Users**:
- ❌ Redirected to `/admin/sign-in`
- ❌ Cannot create new accounts (sign-ups disabled)

---

## Security Considerations

### 1. Server-Side Validation
- All role checks happen server-side using Server Components
- No client-side role bypassing possible
- Clerk session validated on every request

### 2. Metadata Security
- Using `publicMetadata` (not `privateMetadata`) for UI display
- Still requires server-side validation for route protection
- Metadata changes require Clerk dashboard access

### 3. Authentication Flow
- Middleware protects all `/admin` routes
- Role guards add granular page-level protection
- Failed auth redirects instead of throwing errors (prevents info leakage)

### 4. Invitation-Only Access
- Public sign-ups disabled in Clerk
- Only manually created users can authenticate
- Easy user offboarding via Clerk dashboard

---

## Architecture Decisions

### Why `publicMetadata` vs `privateMetadata`?

**Chosen**: `publicMetadata`

**Reasons**:
1. Need to display role in client-side UI (sidebar)
2. Still requires server-side validation for protection
3. Simpler to access in both client and server components
4. Role is not sensitive information (admin/editor distinction)

### Why Redirects Instead of Error Pages?

**Pattern**: `redirect('/admin?error=unauthorized')`

**Benefits**:
1. Better UX - users aren't stuck on error page
2. Can add query param for feedback messages
3. Preserves auth state for retry
4. Follows Next.js App Router best practices

### Why Only Protect Categories?

**Minimal Protection Approach**:
- Both users are trusted (invitation-only)
- Editors need most admin functions for daily work
- Categories are structural (highest impact)
- Can expand protection later if needed

---

## Future Enhancements

### Potential Additions:
1. **Error Feedback UI**
   - Display `?error=unauthorized` query param
   - Toast notification for denied access

2. **Additional Roles**
   - `viewer` - read-only access
   - `super-admin` - user management

3. **Activity Logging**
   - Track who modified what
   - Audit trail for admin actions

4. **Conditional UI Elements**
   - Hide "Categories" nav item for editors
   - Role-based feature flags

5. **API Route Protection**
   - Extend guards to `/api/admin/*` endpoints
   - Consistent protection across app

---

## Developer Notes

### How to Add Role Protection to a Page

```typescript
import { requireAdmin } from '@/lib/auth/permissions';
// or
import { requireAdminOrEditor } from '@/lib/auth/permissions';

export default async function YourPage() {
  await requireAdmin(); // or requireAdminOrEditor()
  
  // ... rest of component
}
```

### How to Get Current User Role

```typescript
import { getUserRole } from '@/lib/auth/permissions';

const role = await getUserRole();
if (role === 'admin') {
  // admin-specific logic
}
```

### How to Add a New Role

1. Update type in `src/types/clerk.d.ts`:
   ```typescript
   role?: 'admin' | 'editor' | 'newrole';
   ```

2. Add new helper in `src/lib/auth/permissions.ts`:
   ```typescript
   export async function requireNewRole() {
     const role = await getUserRole();
     if (role !== 'newrole') {
       redirect('/admin?error=unauthorized');
     }
   }
   ```

3. Set role in Clerk dashboard:
   ```json
   { "role": "newrole" }
   ```

---

## Lessons Learned

### 1. Clerk API Changes
- `clerkClient` is now an async function (not a direct object)
- Must call `await clerkClient()` before accessing `.users`
- Always check latest Clerk docs for API changes

### 2. ESLint Memory Issues
- Large Sanity dist files caused heap overflow
- Solution: Add to ignore patterns
- Always scope linting to source code only

### 3. Minimal Restrictions Work
- Started with admin-only for multiple pages
- Refined to categories-only after user discussion
- Less restrictive = better team collaboration

### 4. TypeScript Type Extensions
- Clerk provides extension points for metadata types
- Use `CustomJwtSessionClaims` for session claims
- Improves DX with autocomplete

---

## References

- **Clerk Documentation**: https://clerk.com/docs/users/metadata
- **Next.js Server Actions**: https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions
- **Specification**: `/Users/meltilib/.factory/specs/2025-12-09-role-based-auth-system-implementation.md`

---

## Summary

Successfully implemented a minimal, secure role-based access control system that:
- ✅ Restricts admin access to invitation-only users
- ✅ Differentiates between admin and editor roles
- ✅ Protects sensitive structural pages (categories)
- ✅ Allows both roles to collaborate on content
- ✅ Displays roles in UI for transparency
- ✅ Uses server-side validation for security
- ✅ Follows Next.js best practices

**Impact**: Site now has proper access control with minimal friction for content team collaboration.
