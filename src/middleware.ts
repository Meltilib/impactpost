import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isClerkConfigured = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
const isAdminRoute = createRouteMatcher(['/admin(.*)']);

// Fallback middleware when Clerk is not configured
function fallbackMiddleware() {
  return NextResponse.next();
}

export default isClerkConfigured 
  ? clerkMiddleware(async (auth, req) => {
      // Protect admin routes - require authentication
      if (isAdminRoute(req)) {
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
