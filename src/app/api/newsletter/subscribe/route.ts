import { NextResponse } from 'next/server';
import { isValidEmail } from '@/lib/utils';

// Helper to check if contact already exists in the audience
async function checkContactExists(apiKey: string, audienceId: string, email: string): Promise<boolean> {
    try {
        // Query the audience contacts to check if email exists
        const res = await fetch(`https://api.resend.com/audiences/${audienceId}/contacts`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
            },
        });

        if (!res.ok) {
            console.warn('[Newsletter] Could not check existing contacts:', res.status);
            return false; // Assume new if we can't check
        }

        const data = await res.json();
        const contacts = data?.data || [];

        // Check if any contact has this email
        return contacts.some((contact: { email?: string }) =>
            contact.email?.toLowerCase() === email.toLowerCase()
        );
    } catch (err) {
        console.error('[Newsletter] Error checking contact existence:', err);
        return false; // Assume new if check fails
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, honeypot } = body;

        // 1. Honeypot Check (Security)
        if (honeypot) {
            console.log(`[Spam Blocked] Honeypot filled by: ${email}`);
            return NextResponse.json({ success: true, message: 'Subscribed!' });
        }

        if (typeof email !== 'string' || !isValidEmail(email)) {
            return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
        }

        const apiKey = process.env.RESEND_API_KEY;
        const audienceId = process.env.RESEND_AUDIENCE_ID;

        if (apiKey && audienceId) {
            // FIRST: Check if contact already exists
            const alreadyExists = await checkContactExists(apiKey, audienceId, email);

            if (alreadyExists) {
                console.log(`[Newsletter] Contact already exists: ${email}`);
                return NextResponse.json({
                    success: true,
                    message: 'You are already subscribed!',
                    isDuplicate: true,
                    mock: false
                });
            }

            // Create the contact (we know it doesn't exist)
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

            const responseData = await res.json().catch(() => ({}));

            if (!res.ok) {
                const message = typeof responseData?.message === 'string' ? responseData.message : '';
                const looksDuplicate = res.status === 409 || /already|exists/i.test(message);

                if (looksDuplicate) {
                    return NextResponse.json({
                        success: true,
                        message: 'You are already subscribed!',
                        isDuplicate: true,
                        mock: false
                    });
                }

                console.error('Resend API Error:', JSON.stringify(responseData, null, 2));
                return NextResponse.json({
                    error: 'Failed to subscribe. Please try again.',
                    debug: process.env.NODE_ENV === 'development' ? responseData : undefined
                }, { status: 500 });
            }

            // Successfully created - send welcome email
            console.log(`[Newsletter] New subscriber added: ${email}`);
            try {
                const { sendWelcomeEmail } = await import('@/lib/email/send-welcome-email');
                sendWelcomeEmail(email).catch(err => console.error('[API] Welcome email failed:', err));
            } catch (emailErr) {
                console.error('[API] Could not import welcome email module:', emailErr);
            }

            return NextResponse.json({
                success: true,
                message: 'Thank you for subscribing!',
                isDuplicate: false,
                mock: false
            });
        }

        if (!apiKey) {
            console.warn('[Newsletter] RESEND_API_KEY not configured.');
        } else {
            console.warn('[Newsletter] RESEND_AUDIENCE_ID not set.');
        }

        return NextResponse.json({
            success: true,
            message: 'Thank you for subscribing!',
            mock: true
        });

    } catch (error) {
        console.error('Newsletter Error:', error);
        return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
    }
}
