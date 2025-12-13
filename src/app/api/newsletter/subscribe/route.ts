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
                    const errorData = await res.json();
                    // Handle "Already exists" gracefully
                    if (res.status !== 409) {
                        console.error('Resend API Error:', errorData);
                        return NextResponse.json({ error: 'Failed to subscribe. Please try again.' }, { status: 500 });
                    }
                }
            } else {
                // Fallback if no audience ID (mostly for testing/logging if configured incorrectly)
                console.warn('RESEND_AUDIENCE_ID not set. Email not added to specific list.');
            }
        } else {
            // Mock success for dev without keys
            console.log(`[Dev Mode] Would add ${email} to Resend.`);
        }

        return NextResponse.json({ success: true, message: 'Thank you for subscribing!' });

    } catch (error) {
        console.error('Newsletter Error:', error);
        return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
    }
}
