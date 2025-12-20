import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, honeypot } = body;

        // 1. Honypot Check (Security)
        // If the hidden 'honeypot' field has any value, it's a bot.
        // Return success to fool the bot into thinking it worked.
        if (honeypot) {
            console.log(`[Spam Blocked] Honeypot filled by: ${email}`);
            return NextResponse.json({ success: true, message: 'Subscribed!' });
        }

        if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
            return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
        }

        const apiKey = process.env.RESEND_API_KEY;
        const audienceId = process.env.RESEND_AUDIENCE_ID;

        // 2. Add to Resend
        if (apiKey) {
            if (audienceId) {
                // Create Contact in specific Audience
                const res = await fetch(`https://api.resend.com/audiences/${audienceId}/contacts`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${apiKey}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email,
                        unsubscribed: false
                    })
                });

                if (!res.ok) {
                    const errorData = await res.json().catch(() => ({}));
                    console.error('Resend API Error details:', JSON.stringify(errorData, null, 2));

                    // Handle "Already exists" - Return success but with a specific flag
                    if (res.status === 409) {
                        return NextResponse.json({ success: true, message: 'You are already subscribed!', isDuplicate: true });
                    }
                    console.error('Resend API Error status:', res.status);
                    return NextResponse.json({
                        error: 'Failed to subscribe. Please try again.',
                        debug: process.env.NODE_ENV === 'development' ? errorData : undefined
                    }, { status: 500 });
                }

                // If successful and not a duplicate, try to send a welcome email
                // We do this after the successful contact creation
                // We use import() here to keep it server-side and avoid issues if needed
                try {
                    const { sendWelcomeEmail } = await import('@/lib/email/send-welcome-email');
                    // We don't 'await' this if we want it to be truly non-blocking for response time,
                    // but since subscription is the main goal, we trigger it and handle background completion
                    sendWelcomeEmail(email).catch(err => console.error('[API] Welcome email trigger failed:', err));
                } catch (emailErr) {
                    console.error('[API] Could not import welcome email module:', emailErr);
                }
            } else {
                // Fallback if no audience ID (mostly for testing/logging if configured incorrectly)
                console.warn('RESEND_AUDIENCE_ID not set. Email not added to specific list.');
            }
        }
        return NextResponse.json({ success: true, message: 'Thank you for subscribing!' });

    } catch (error) {
        console.error('Newsletter Error:', error);
        return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
    }
}
