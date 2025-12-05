import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const secret = searchParams.get('secret');
  const slug = searchParams.get('slug') || '/';
  const type = searchParams.get('type') || 'article';

  // Check the secret
  if (secret !== process.env.SANITY_PREVIEW_SECRET) {
    return new Response('Invalid token', { status: 401 });
  }

  // Enable Draft Mode
  const draft = await draftMode();
  draft.enable();

  // Redirect to the path based on type
  let redirectPath = '/';
  
  if (type === 'article' && slug) {
    redirectPath = `/news/${slug}`;
  } else if (type === 'event' && slug) {
    redirectPath = `/community/events/${slug}`;
  } else if (slug && slug !== '/') {
    redirectPath = slug;
  }

  redirect(redirectPath);
}
