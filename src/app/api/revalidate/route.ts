import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

// Sanity webhook payload types
interface SanityWebhookPayload {
  _type: string;
  _id: string;
  slug?: {
    current: string;
  };
  category?: {
    _ref: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    const body: SanityWebhookPayload = await request.json();
    const { _type, slug } = body;

    // Revalidate based on content type
    switch (_type) {
      case 'article':
        // Revalidate the specific article page
        if (slug?.current) {
          revalidatePath(`/news/${slug.current}`);
        }
        // Revalidate article listing pages
        revalidatePath('/news');
        revalidatePath('/');
        // Revalidate section pages (category might have changed)
        revalidatePath('/section/[category]', 'page');
        break;

      case 'event':
        // Revalidate events pages
        revalidatePath('/community/events');
        if (slug?.current) {
          revalidatePath(`/community/events/${slug.current}`);
        }
        // Homepage shows events
        revalidatePath('/');
        break;

      case 'category':
        // Revalidate all section pages
        revalidatePath('/section/[category]', 'page');
        revalidatePath('/news');
        revalidatePath('/');
        break;

      case 'author':
        // Revalidate all article pages (authors are displayed on articles)
        revalidatePath('/news/[slug]', 'page');
        revalidatePath('/');
        break;

      default:
        // For any other type, do a broad revalidation
        revalidatePath('/');
    }

    return NextResponse.json({
      revalidated: true,
      type: _type,
      slug: slug?.current,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Revalidation error:', error);
    return NextResponse.json(
      { error: 'Error revalidating', details: String(error) },
      { status: 500 }
    );
  }
}

// Also support GET for testing
export async function GET() {
  return NextResponse.json({
    message: 'Revalidation endpoint is ready',
    usage: 'POST with Sanity webhook payload',
  });
}
