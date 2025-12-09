# Lesson Learned: Turbopack, Clerk v6 API, and TypeScript Build Fixes

## What went wrong
- Production build failed with Turbopack sandbox error: "Operation not permitted while binding a port"
- Runtime error: `Cannot read properties of undefined (reading 'getUser')` from Clerk authentication
- Multiple TypeScript strict mode errors surfaced during webpack build that were hidden during dev

## Impact
- Builds could not complete in sandboxed/restricted environments (CI, certain dev setups)
- Admin pages crashed on load due to Clerk API incompatibility
- TypeScript errors blocked production deployment

## Root causes
1. **Turbopack sandbox limitation**: Turbopack spawns processes and binds ports for incremental compilation, which fails in sandboxed environments (Docker with restricted capabilities, macOS sandbox, certain CI runners)
2. **Clerk v6 API change**: `clerkClient` changed from a direct object to an async factory function in `@clerk/nextjs` v6+. Old usage `clerkClient.users.getUser()` no longer works.
3. **Loose TypeScript types**: `PortableBlock` interface used `[key: string]: unknown` index signature, causing property access to return `unknown` instead of expected types. Type casts were needed but missing.

## Fix implemented
1. **Turbopack**: Added `TURBOPACK=0` env var to build script in `package.json` to force webpack bundler
2. **Clerk API**: Changed `clerkClient.users.getUser(userId)` to `const client = await clerkClient(); client.users.getUser(userId)`
3. **TypeScript fixes**:
   - Added `.join('')` to array map in `portable-text.tsx` leadParagraph renderer
   - Made `value` optional in link mark component signature
   - Added `as unknown as` double-cast for legacy block normalization
   - Added explicit type casts for `textSpansToTiptap` arguments

## Prevent / detect next time
- **Turbopack**: Until Turbopack matures, default to webpack for production builds. Keep Turbopack for dev only if needed.
- **Clerk upgrades**: Check Clerk migration guides when upgrading major versions. The v5→v6 migration changed several APIs.
- **TypeScript strictness**: Run `npm run build` (not just `npm run dev`) before committing. Dev mode may not catch all type errors.
- **Interface design**: Avoid `[key: string]: unknown` catch-all index signatures when specific properties are known. Use explicit optional properties instead.

## Ownership / links
- Area: build tooling, authentication, type safety
- Files touched:
  - `package.json` (build script)
  - `src/lib/auth/permissions.ts` (Clerk API)
  - `src/components/portable-text.tsx` (TypeScript fixes)
  - `src/lib/admin/portable-text-converter.ts` (TypeScript fixes)

## Additional notes
- The middleware deprecation warning ("use proxy instead") is expected in Next.js 16 but non-blocking. Wait for Clerk to release proxy-compatible middleware before migrating.
- The `@sanity/image-url` deprecation warning is also non-blocking; migrate to named export `createImageUrlBuilder` when convenient.
