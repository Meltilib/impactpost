
• High Severity

  - Admin middleware protects every /admin(.*) request, so visiting /admin/sign-in triggers auth.protect() and
    Clerk immediately redirects back to the same path, creating a redirect loop that blocks all logins (src/
    middleware.ts:12-18, src/app/admin/sign-in/[[...sign-in]]/page.tsx:1-18).
  - getUserRole() calls clerkClient() as if it were a function; in reality it is an object, so the first guarded
    page (requireAdmin() in src/app/admin/categories/page.tsx:13-44) throws TypeError: clerkClient is not a function
    before any UI renders (src/lib/auth/permissions.ts:4-18).
  - Role-based access control never actually runs: dashboard, new/edit/article management, authors, and settings
    pages don’t call requireAdmin or requireAdminOrEditor, and the server actions (createArticle, updateArticle,
    deleteArticle, etc.) perform mutations with no role check, so any authenticated Clerk user can fully manage
    content once they reach /admin (src/app/admin/page.tsx:7-49, src/app/admin/new/page.tsx:1-6, src/app/admin/edit/
    [id]/page.tsx:11-39, src/app/admin/authors/page.tsx:12-41, src/app/admin/settings/page.tsx:14-33, src/lib/admin/
    actions.ts:22-111).
  - /api/admin/upload lets anyone stream files into your Sanity project using your write token because the middleware
    only matches /admin(.*), not /api/admin, and the route itself has zero authentication (src/middleware.ts:12-18,
    src/app/api/admin/upload/route.ts:4-30).

  High Plan

  - Allow /admin/sign-in (and other public auth pages) to bypass auth.protect() while extending the matcher to
    include /api/admin(.*). Why: the current matcher both locks out the sign-in UI and leaves admin-only APIs
    exposed. Benefit: admins can authenticate normally and every admin-prefixed API call inherits Clerk protection.
  - Fix getUserRole() to use the clerkClient.users.getUser API directly (no invocation) and handle missing metadata
    gracefully. Why: the mistaken function call crashes every guard, so the only page that tries to read roles is
    unusable. Benefit: role lookups become reliable and guards can actually execute.
  - Apply requireAdmin/requireAdminOrEditor in every admin route layer (dashboard, new/edit/article, authors,
    categories, settings) and inside each server action before mutating Sanity. Why: without role gating, any logged-
    in user can create/update/delete content and the server actions remain callable even if the UI adds guards later.
    Benefit: role promises in this branch (“role-based access control”) become real, limiting high-risk operations to
    approved roles.
  - Require authentication (and ideally role checks) inside /api/admin/upload before uploading to Sanity. Why:
    otherwise anonymous users can burn API quota, store malicious assets, or exfiltrate your write token’s
    capabilities. Benefit: only vetted admins can upload media, keeping your Sanity token and storage safe.

  Medium Severity

  - The Sanity revalidation endpoint blindly trusts every POST and even exposes a GET “test” response, so any bot can
    hammer it and force expensive cache invalidations (src/app/api/revalidate/route.ts:16-84).
  - Article/category CRUD actions revalidate '/section', a route that does not exist, so newly added stories never
    refresh category pages until the ISR timer or manual revalidate hits (src/lib/admin/actions.ts:46-50, 85-89, 101-
    104, 415-478).
  - The branch checks in thousands of generated assets and dependencies under sanity/dist and sanity/node_modules,
    ballooning the repo by multiple gigabytes and guaranteeing constant merge conflicts (sanity/dist/index.html:1-14,
    sanity/node_modules/.package-lock.json:1-15).
  - revalidatePath for authors uses '/news/[slug]' without specifying which slug changed, so all article pages
    get invalidated even for minor author edits, leading to unnecessary rebuild churn (src/app/api/revalidate/
    route.ts:52-55).

  Medium Plan

  - Add a shared secret (or Sanity signature verification) and drop the open GET handler on /api/revalidate. Why:
    without verification anyone can DDoS your ISR cache. Benefit: only Sanity webhooks you trust will trigger
    revalidation, reducing load.
  - Replace the revalidatePath('/section') calls with either revalidatePath('/section/[category]', 'page') plus
    expect them.
  - Remove sanity/dist, sanity/node_modules, .sanity artifacts from Git and add the folders to .gitignore. Why:
    committing build outputs and dependencies explodes repo size and slows every clone/dev install. Benefit: faster
    installs, cleaner diffs, and no accidental deployment of stale Studio builds.
  - Narrow the revalidation scope for authors to the affected article slug(s) instead of blanket '/news/[slug]'. Why:
    current logic regenerates every article for any author tweak, which is both slow and unnecessary. Benefit: much
    faster webhook handling and fewer cache invalidations.

  Low Severity

  - Several App Router pages incorrectly type params as Promise and await them even though Next passes plain
    objects (src/app/news/[slug]/page.tsx:21-37, src/app/section/[category]/page.tsx:9-49, src/app/admin/edit/[id]/
    page.tsx:7-18). This compiles only because await on a non-thenable returns the value, but it hides real typing
    mistakes.
  - Unlike author/category creation, createArticle never checks for slug collisions before writing to Sanity, so
    duplicated slugs silently overwrite whichever article Sanity returns first (src/lib/admin/actions.ts:22-55 vs.
    the slug guards in updateAuthor/createCategory nearby).
  - Read-only admin loaders (fetchAuthors, fetchCategories, fetchArticlesForAdmin) all run through the write client,
    forcing you to provision a SANITY_WRITE_TOKEN just to view dashboard data (src/lib/admin/actions.ts:113-181).
    That widens the blast radius if the token leaks and complicates local read-only setups.
  - The article form fetches authors and categories inside a client-side useEffect, meaning the form renders without
    any select options until the browser makes two extra round trips to the server (src/components/admin/article-
    form.tsx:60-87). You already have server access in the page, so the data could be streamed as props to avoid the
    blank states.

  Low Plan

  - Update every page component to declare params: { ... } and drop the unnecessary await. Why: the current typing
    can mask real async bugs and confuses future readers. Benefit: clearer types and no accidental reliance on
    undefined behavior.
  - Add a slug uniqueness check (similar to the author/category guards) before writeClient.create in createArticle.
    Why: duplicate slugs currently succeed and only surface later as routing conflicts. Benefit: editors get
    immediate feedback and the site avoids ambiguous /news/[slug] routes.
  - Introduce a read-only Sanity client (no token) for fetches that never mutate data, and reserve the write token
    for actual mutations. Why: today every dashboard read requires the highly privileged token. Benefit: you can run
    the admin UI in read-only contexts and reduce risk if that client leaks.
  - Fetch authors and categories on the server page (or through serverActions passed as props) and hydrate the form
    with ready-to-use arrays. Why: client-side fetching delays the form and complicates error handling. Benefit:
    faster first paint and simpler data flow for the editor UI.

  Let me know if you’d like help implementing any of the fixes or preparing the cleanup commits.