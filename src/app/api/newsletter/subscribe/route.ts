import { NextResponse } from 'next/server';
import { isValidEmail, fetchWithTimeout } from '@/lib/utils';
import { newsletterRateLimiter, getClientIp, checkRateLimit } from '@/lib/rate-limit';
import { getResendEnv, buildResendHeaders, getContactUrl } from '@/lib/resend/config';

export async function POST(req: Request) {
    try {
        // 0. Rate Limiting (Security)
        const clientIp = getClientIp(req);
        const rateLimitResult = await checkRateLimit(newsletterRateLimiter, clientIp);

        if (!rateLimitResult.success) {
            console.log(`[Newsletter] Rate limit exceeded for IP: ${clientIp}`);
            return NextResponse.json(
                { error: 'Too many requests. Please try again later.' },
                {
                    status: 429,
                    headers: {
                        'Retry-After': '60',
                        'X-RateLimit-Remaining': '0',
                    }
                }
            );
        }

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

        const { apiKey, audienceId, configured } = getResendEnv();

        if (configured) {
            // 1) Pre-flight: check if contact already exists to avoid duplicate welcomes
            const contactUrl = getContactUrl(email);
            const existingRes = await fetchWithTimeout(
                contactUrl,
                { headers: buildResendHeaders(apiKey!) },
                8000
            );

            if (existingRes.ok) {
                const existing = await existingRes.json().catch(() => ({}));
                const wasUnsubscribed = existing?.unsubscribed === true;

                // If previously unsubscribed, resubscribe in place
                if (wasUnsubscribed) {
                    await fetchWithTimeout(
                        contactUrl,
                        {
                            method: 'PATCH',
                            headers: buildResendHeaders(apiKey!),
                            body: JSON.stringify({ unsubscribed: false })
                        },
                        8000
                    ).catch(() => null);
                }

                return NextResponse.json({
                    success: true,
                    message: wasUnsubscribed
                        ? 'Welcome back! You have been re-subscribed.'
                        : 'You are already subscribed!',
                    isDuplicate: true,
                    mock: false
                });
            }

            if (existingRes.status !== 404) {
                const errText = await existingRes.text().catch(() => '');
                console.error('[Newsletter] Contact lookup failed:', existingRes.status, errText);
                return NextResponse.json(
                    { error: 'Could not verify subscription status. Please try again.' },
                    { status: 502 }
                );
            }

            // 2) Create new contact
            const res = await fetchWithTimeout(
                `https://api.resend.com/audiences/${audienceId}/contacts`,
                {
                    method: 'POST',
                    headers: buildResendHeaders(apiKey!),
                    body: JSON.stringify({
                        email,
                        unsubscribed: false
                    })
                }
            );

            const responseData = await res.json().catch(() => ({}));

            if (!res.ok) {
                const message = typeof responseData?.message === 'string' ? responseData.message : '';
                // Treat duplicate indicators as success (defensive)
                if (/already|exists/i.test(message)) {
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

            // Successfully created new subscriber - send welcome email
            if (res.status === 201) {
                console.log(`[Newsletter] New subscriber added: ${email}`);
                try {
                    const { sendWelcomeEmail } = await import('@/lib/email/send-welcome-email');
                    sendWelcomeEmail(email).catch(err => console.error('[API] Welcome email failed:', err));
                } catch (emailErr) {
                    console.error('[API] Could not import welcome email module:', emailErr);
                }
            }

            return NextResponse.json({
                success: true,
                message: 'Thank you for subscribing!',
                isDuplicate: false,
                mock: false
            });
        }

        if (!configured) {
            console.warn('[Newsletter] Resend is not configured. Returning mock success.');
        }

        return NextResponse.json({
            success: true,
            message: 'Thank you for subscribing!',
            mock: true
        });

    } catch (error) {
        // Handle timeout specifically
        if (error instanceof Error && error.name === 'AbortError') {
            console.error('[Newsletter] API request timed out');
            return NextResponse.json(
                { error: 'Request timed out. Please try again.' },
                { status: 504 }
            );
        }

        console.error('Newsletter Error:', error);
        return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
    }
}
