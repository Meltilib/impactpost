import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isClerkConfigured = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
const isAdminRoute = createRouteMatcher(['/admin(.*)']);
const isAdminSignInRoute = createRouteMatcher(['/admin/sign-in(.*)']);
const isAdminApiRoute = createRouteMatcher(['/api/admin(.*)']);

// Fallback middleware when Clerk is not configured
function fallbackMiddleware() {
  return NextResponse.next();
}

export default isClerkConfigured
  ? clerkMiddleware(async (auth, req) => {
      // Ensure admin APIs are always authenticated
      if (isAdminApiRoute(req)) {
        await auth.protect();
        return;
      }

      // Protect admin routes but allow the sign-in flow
      if (isAdminRoute(req) && !isAdminSignInRoute(req)) {
        await auth.protect();
      }
    })
  : fallbackMiddleware;

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
