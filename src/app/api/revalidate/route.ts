import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

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

/**
 * Verify webhook signature from Sanity
 * Requires SANITY_WEBHOOK_SECRET environment variable
 */
function timingSafeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  try {
    return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
  } catch {
    return false;
  }
}

function verifyWebhookSignature(body: string, signature: string | null, secret: string): boolean {
  if (!signature) return false;

  const hmac = crypto.createHmac('sha256', secret).update(body);
  const expectedHex = hmac.digest('hex');
  const expectedBase64 = hmac.digest('base64');

  // Sanity can be configured to send hex or base64; accept either for compatibility
  return timingSafeEqual(signature, expectedHex) || timingSafeEqual(signature, expectedBase64);
}

export async function POST(request: NextRequest) {
  const secret = process.env.SANITY_WEBHOOK_SECRET;

  // Security: Require webhook secret in production
  if (!secret) {
    console.error('[Revalidate] SANITY_WEBHOOK_SECRET not configured');
    return NextResponse.json(
      { error: 'Webhook secret not configured' },
      { status: 500 }
    );
  }

  // Get raw body for signature verification
  const rawBody = await request.text();
  const signature = request.headers.get('x-sanity-signature')
    || request.headers.get('sanity-webhook-signature');

  // Verify webhook signature
  if (!verifyWebhookSignature(rawBody, signature, secret)) {
    console.warn('[Revalidate] Invalid webhook signature');
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 401 }
    );
  }

  try {
    const body: SanityWebhookPayload = JSON.parse(rawBody);
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

    console.log(`[Revalidate] Success for ${_type}${slug?.current ? `: ${slug.current}` : ''}`);

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

// GET endpoint removed for security - revalidation should only happen via authenticated webhooks
