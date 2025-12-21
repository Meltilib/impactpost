import { NextResponse } from 'next/server';
import { isValidEmail, fetchWithTimeout } from '@/lib/utils';
import { getResendEnv, buildResendHeaders, getContactUrl } from '@/lib/resend/config';

export async function POST(req: Request) {
    try {
        const url = new URL(req.url);
        const contentType = req.headers.get('content-type') || '';

        // 1) Prefer query param (Gmail may pass email in the URL)
        let email: string | null = url.searchParams.get('email');

        // 2) Body parsing with wide tolerance (form + json)
        if (!email) {
            if (contentType.includes('application/x-www-form-urlencoded')) {
                const formData = await req.formData().catch(() => null);
                const value = formData?.get('email') ?? formData?.get('recipient');
                email = typeof value === 'string' ? value : null;
            } else if (contentType.includes('application/json')) {
                const body = await req.json().catch(() => ({}));
                email = typeof body.email === 'string' ? body.email : null;
            } else {
                const formData = await req.formData().catch(() => null);
                const value = formData?.get('email') ?? formData?.get('recipient');
                email = typeof value === 'string' ? value : null;
            }
        }

        if (!email || !isValidEmail(email)) {
            console.warn('[Unsubscribe] Missing or invalid email. Returning success for idempotency.');
            return NextResponse.json({ success: true, message: 'Unsubscribed' });
        }

        const { apiKey, configured } = getResendEnv();

        if (!configured) {
            console.warn('[Unsubscribe] Resend not configured. Cannot process unsubscribe.');
            return NextResponse.json({ success: true, message: 'Unsubscribed' });
        }

        // Fire-and-forget the Resend PATCH to keep Gmail's one-click path instant
        (async () => {
            try {
                await fetchWithTimeout(
                    getContactUrl(email),
                    {
                        method: 'PATCH',
                        headers: buildResendHeaders(apiKey!),
                        body: JSON.stringify({ unsubscribed: true })
                    },
                    8000
                );
            } catch (error) {
                console.error('[Unsubscribe] Error calling Resend API (async):', error);
            }
        })();

        // Always return success immediately to satisfy RFC 8058 one-click expectations
        return NextResponse.json({
            success: true,
            message: 'You have been unsubscribed. Sorry to see you go!'
        });
    } catch (error) {
        console.error('[Unsubscribe] Error:', error);
        return NextResponse.json(
            { error: 'Failed to process unsubscribe' },
            { status: 500 }
        );
    }
}

/**
 * GET handler for unsubscribe links (for email clients that follow links)
 * Requires email query parameter
 */
export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    if (!email || !isValidEmail(email)) {
        return NextResponse.json(
            { error: 'Invalid or missing email parameter' },
            { status: 400 }
        );
    }

    // For GET requests, just return HTML form that can be auto-submitted
    // or shown to user for confirmation
    return new NextResponse(
        `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Unsubscribe from Impact Post</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            margin: 0;
            padding: 20px;
        }
        .container {
            background: white;
            border-radius: 8px;
            padding: 40px;
            max-width: 500px;
            text-align: center;
            box-shadow: 0 10px 40px rgba(0,0,0,0.1);
        }
        h1 {
            color: #333;
            margin-bottom: 20px;
        }
        p {
            color: #666;
            line-height: 1.6;
            margin-bottom: 30px;
        }
        .buttons {
            display: flex;
            gap: 10px;
            justify-content: center;
        }
        button {
            padding: 12px 24px;
            border: none;
            border-radius: 4px;
            font-size: 16px;
            cursor: pointer;
            transition: all 0.2s;
        }
        .unsubscribe-btn {
            background: #dc3545;
            color: white;
        }
        .unsubscribe-btn:hover {
            background: #c82333;
        }
        .cancel-btn {
            background: #6c757d;
            color: white;
        }
        .cancel-btn:hover {
            background: #5a6268;
        }
        .email-display {
            background: #f8f9fa;
            padding: 12px;
            border-radius: 4px;
            word-break: break-all;
            margin: 20px 0;
            color: #333;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Unsubscribe from Impact Post</h1>
        <p>We're sorry to see you go. You will no longer receive emails from us.</p>
        <div class="email-display">${email}</div>
        <div class="buttons">
            <form method="POST" style="margin: 0;">
                <input type="hidden" name="email" value="${email}">
                <button type="submit" class="unsubscribe-btn">Confirm Unsubscribe</button>
            </form>
            <button class="cancel-btn" onclick="window.close()">Cancel</button>
        </div>
    </div>
</body>
</html>
        `,
        {
            headers: { 'Content-Type': 'text/html; charset=utf-8' },
        }
    );
}
