import { NextResponse } from 'next/server';
import { client } from '@/lib/sanity/client';
import { articleBySlugQuery } from '@/lib/sanity/queries';
import { requireAdmin } from '@/lib/auth/permissions';
import { fetchWithTimeout, escapeHtml } from '@/lib/utils';
import { getResendEnv, resendConfigMessage, shouldUseResendMock, buildResendHeaders } from '@/lib/resend/config';

// Timeout for email API calls (30 seconds per batch)
const EMAIL_TIMEOUT_MS = 30000;
// Allow serverless function up to 60s to reduce timeout risk on larger sends
export const maxDuration = 60;

// Helper to chunk array into batches
function chunkArray<T>(array: T[], size: number): T[][] {
    const result: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
        result.push(array.slice(i, i + size));
    }
    return result;
}

/**
 * Send emails to a batch of recipients
 * Returns success status and any errors
 */
async function sendEmailBatch(
    apiKey: string,
    batch: string[],
    subject: string,
    htmlContent: string
): Promise<{ success: boolean; error?: string }> {
    try {
        const response = await fetchWithTimeout(
            'https://api.resend.com/emails',
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    from: 'Impact Post <newsletter@impactpost.ca>',
                    to: 'newsletter@impactpost.ca',
                    bcc: batch,
                    subject: subject,
                    html: htmlContent
                })
            },
            EMAIL_TIMEOUT_MS
        );

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            return {
                success: false,
                error: `Batch failed: ${errorData.message || response.statusText}`
            };
        }

        return { success: true };
    } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
            return { success: false, error: 'Batch timed out' };
        }
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        };
    }
}

export async function POST(req: Request) {
    // Defense-in-depth: Verify admin role even though middleware protects this route
    await requireAdmin();

    try {
        const { slug } = await req.json();

        if (!slug) {
            return NextResponse.json({ error: 'Article slug is required' }, { status: 400 });
        }

        // 1. Fetch Article Data
        if (!client) {
            return NextResponse.json({ error: 'Sanity client not configured' }, { status: 500 });
        }
        const article = await client.fetch(articleBySlugQuery, { slug });

        if (!article) {
            return NextResponse.json({ error: 'Article not found' }, { status: 404 });
        }

        const { apiKey, audienceId, configured, missing } = getResendEnv();
        const allowMock = shouldUseResendMock(configured);

        if (!configured) {
            const message = resendConfigMessage(missing);
            // In dev, allow a mock success so editors can test the button without real email sends.
            if (allowMock) {
                return NextResponse.json({
                    success: true,
                    mock: true,
                    message: `Mock broadcast: ${message}`
                });
            }
            return NextResponse.json({ error: message }, { status: 503 });
        }

        // 2. Fetch subscribers with basic pagination to avoid huge payloads/timeouts
        const allEmails: string[] = [];
        // Resend enforces 1-100 for pagination; keep hard-capped to avoid 422 validation errors
        const pageSize = 100;
        let offset = 0;
        let hasMore = true;

        console.info(`[Broadcast] Fetching audience contacts | audienceId=${audienceId} pageSize=${pageSize}`);

        try {
            while (hasMore) {
                // Audience is required for broadcast; with valid config this URL is always defined.
                const contactsUrl = `https://api.resend.com/audiences/${audienceId}/contacts?limit=${pageSize}&offset=${offset}`;

                const contactsRes = await fetchWithTimeout(
                    contactsUrl,
                    { headers: buildResendHeaders(apiKey!) },
                    EMAIL_TIMEOUT_MS // Use email timeout for fetching contacts too
                );

                if (!contactsRes.ok) {
                    const errText = await contactsRes.text().catch(() => '');
                    throw new Error(`Fetch subscribers failed (${contactsRes.status}): ${errText}`);
                }

                const contactsData = await contactsRes.json().catch(() => ({}));
                const dataArr = Array.isArray(contactsData.data) ? contactsData.data : [];

                allEmails.push(
                    ...dataArr
                        .filter((c: { unsubscribed?: boolean }) => !c.unsubscribed)
                        .map((c: { email: string }) => c.email)
                        .filter(Boolean)
                );

                hasMore = dataArr.length === pageSize;
                offset += pageSize;
            }
        } catch (error) {
            console.error('[Broadcast] Failed to fetch contacts:', error);
            return NextResponse.json({
                error: 'Failed to fetch subscriber list'
            }, { status: 500 });
        }

        if (allEmails.length === 0) {
            return NextResponse.json({ error: 'No subscribers found to send to.' }, { status: 400 });
        }

        // 3. Prepare Email Content
        const safeTitle = escapeHtml(article.title || '');
        const safeExcerpt = escapeHtml(article.excerpt || '');
        const subject: string = `New Story: ${safeTitle}`;
        const imageUrl = article.mainImage?.asset?.url;

        const htmlContent = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="font-size: 24px; font-weight: bold; margin-bottom: 16px;">${safeTitle}</h1>
        ${imageUrl ? `<img src="${escapeHtml(imageUrl)}" style="width: 100%; border-radius: 8px; margin-bottom: 20px;" alt="${safeTitle}" />` : ''}
        <p style="font-size: 16px; line-height: 1.6; color: #333;">${safeExcerpt}</p>
        <div style="margin-top: 30px;">
           <a href="https://impactpost.ca/news/${escapeHtml(slug)}" style="background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 4px;">Read Full Story</a>
        </div>
        <p style="margin-top: 40px; font-size: 12px; color: #888;">
           You are receiving this because you subscribed to Impact Post. 
           <a href="#">Unsubscribe</a>
        </p>
      </div>
    `;

        // 4. Batch Send with progress tracking
        // Resend allows up to 50 recipients in batch
        const batches = chunkArray(allEmails, 49);
        const results: { batch: number; success: boolean; error?: string }[] = [];

        console.log(`[Broadcast] Starting send to ${allEmails.length} subscribers in ${batches.length} batches`);

        // Process batches sequentially to avoid rate limiting
        for (let i = 0; i < batches.length; i++) {
            const batch = batches[i];
            console.log(`[Broadcast] Sending batch ${i + 1}/${batches.length} (${batch.length} recipients)`);

            const result = await sendEmailBatch(apiKey!, batch, subject, htmlContent);
            results.push({ batch: i + 1, ...result });

            if (!result.success) {
                console.error(`[Broadcast] Batch ${i + 1} failed:`, result.error);
            }

            // Small delay between batches to avoid rate limiting
            if (i < batches.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        }

        const successCount = results.filter(r => r.success).length;
        const failedBatches = results.filter(r => !r.success);

        console.log(`[Broadcast] Complete: ${successCount}/${batches.length} batches successful`);

        if (failedBatches.length > 0) {
            return NextResponse.json({
                success: false,
                message: `Partial success: ${successCount}/${batches.length} batches sent`,
                totalSubscribers: allEmails.length,
                batchesSent: successCount,
                batchesFailed: failedBatches.length,
                errors: failedBatches.map(b => `Batch ${b.batch}: ${b.error}`)
            }, { status: 207 }); // 207 Multi-Status
        }

        return NextResponse.json({
            success: true,
            count: allEmails.length,
            batchesSent: batches.length
        });

    } catch (error: unknown) {
        console.error('Broadcast Error:', error);
        const message = error instanceof Error ? error.message : 'Failed to broadcast';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
