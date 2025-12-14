import { NextResponse } from 'next/server';
import { client } from '@/lib/sanity/client';
import { articleBySlugQuery } from '@/lib/sanity/queries';

// Helper to chunk array into batches
function chunkArray<T>(array: T[], size: number): T[][] {
    const result: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
        result.push(array.slice(i, i + size));
    }
    return result;
}

export async function POST(req: Request) {
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

        const apiKey = process.env.RESEND_API_KEY;
        const audienceId = process.env.RESEND_AUDIENCE_ID;

        if (!apiKey) {
            return NextResponse.json({ success: true, message: 'Mock Broadcast: API Key not configured.' });
        }

        // 2. Fetch Subscribers
        // We reuse the logic from the subscriber route, or call Resend directly.
        // For broadcast, we need all contacts.
        let allEmails: string[] = [];

        // Fetch contacts (handling pagination would be next step for large lists)
        const contactsUrl = audienceId
            ? `https://api.resend.com/audiences/${audienceId}/contacts`
            : 'https://api.resend.com/audiences/contacts'; // Fallback

        const contactsRes = await fetch(contactsUrl, {
            headers: { 'Authorization': `Bearer ${apiKey}` }
        });

        if (contactsRes.ok) {
            const contactsData = await contactsRes.json();
            // Assuming data.data is the array
            if (Array.isArray(contactsData.data)) {
                allEmails = contactsData.data
                    .filter((c: { unsubscribed?: boolean }) => !c.unsubscribed)
                    .map((c: { email: string }) => c.email);
            }
        }

        if (allEmails.length === 0) {
            return NextResponse.json({ error: 'No subscribers found to send to.' }, { status: 400 });
        }

        // 3. Prepare Email Content (Simplified HTML)
        const subject = `New Story: ${article.title}`;
        const imageUrl = article.mainImage?.asset?.url;

        const htmlContent = `
      <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto;">
        <h1 style="font-size: 24px; font-weight: bold; margin-bottom: 16px;">${article.title}</h1>
        ${imageUrl ? `<img src="${imageUrl}" style="width: 100%; border-radius: 8px; margin-bottom: 20px;" alt="${article.title}" />` : ''}
        <p style="font-size: 16px; line-height: 1.6; color: #333;">${article.excerpt || ''}</p>
        <div style="margin-top: 30px;">
           <a href="https://impactpost.ca/news/${slug}" style="background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 4px;">Read Full Story</a>
        </div>
        <p style="margin-top: 40px; font-size: 12px; color: #888;">
           You are receiving this because you subscribed to Impact Post. 
           <a href="#">Unsubscribe</a>
        </p>
      </div>
    `;

        // 4. Batch Send (Using BCC to protect privacy)
        // Resend allows up to 50 recipients in batch.
        const batches = chunkArray(allEmails, 49); // Leave 1 spot for 'to'

        for (const batch of batches) {
            await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    from: 'Impact Post <newsletter@impactpost.ca>', // Replace with verified domain
                    to: 'newsletter@impactpost.ca', // Send "to" self
                    bcc: batch, // BCC everyone else
                    subject: subject,
                    html: htmlContent
                })
            });
        }

        return NextResponse.json({ success: true, count: allEmails.length });

    } catch (error: unknown) {
        console.error('Broadcast Error:', error);
        const message = error instanceof Error ? error.message : 'Failed to broadcast';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
