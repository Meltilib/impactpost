import { NextResponse } from 'next/server';
import { getUserRole } from '@/lib/auth/permissions';
import { isValidEmail, fetchWithTimeout } from '@/lib/utils';
import { adminRateLimiter, getClientIp, checkRateLimit } from '@/lib/rate-limit';

type SubscriberStatus = 'subscribed' | 'unsubscribed';

type ResendContact = {
    id: string;
    email: string;
    created_at: string;
    unsubscribed?: boolean;
    unsubscribed_at?: string | null;
};

type Subscriber = {
    id: string;
    email: string;
    created_at: string;
    status: SubscriberStatus;
    unsubscribed_at?: string | null;
};

function normalizeContact(contact: ResendContact): Subscriber {
    const status: SubscriberStatus = contact.unsubscribed ? 'unsubscribed' : 'subscribed';
    return {
        id: contact.id,
        email: contact.email,
        created_at: contact.created_at,
        status,
        unsubscribed_at: contact.unsubscribed_at ?? null
    };
}

async function requireAdmin(req: Request) {
    // 0. Rate Limiting for Admin API
    const clientIp = getClientIp(req);
    const rateLimitResult = await checkRateLimit(adminRateLimiter, clientIp);
    if (!rateLimitResult.success) {
        return NextResponse.json(
            { error: 'Too many requests' },
            { status: 429 }
        );
    }

    const role = await getUserRole();
    if (role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return null;
}

function getResendConfig() {
    const apiKey = process.env.RESEND_API_KEY;
    const audienceId = process.env.RESEND_AUDIENCE_ID;
    return { apiKey, audienceId };
}

function getContactsListUrl(audienceId?: string) {
    return audienceId
        ? `https://api.resend.com/audiences/${audienceId}/contacts`
        : 'https://api.resend.com/contacts';
}

function getContactsCreateUrl(audienceId?: string) {
    return audienceId
        ? `https://api.resend.com/audiences/${audienceId}/contacts`
        : 'https://api.resend.com/contacts';
}

function getContactUrl(contactIdOrEmail: string) {
    return `https://api.resend.com/contacts/${encodeURIComponent(contactIdOrEmail)}`;
}
export async function GET(req: Request) {
    const authError = await requireAdmin(req);
    if (authError) return authError;

    const apiKey = process.env.RESEND_API_KEY;
    const audienceId = process.env.RESEND_AUDIENCE_ID;

    if (!apiKey) {
        // ... (mock data 72-81)
    }

    try {
        const listUrl = getContactsListUrl(audienceId);
        const res = await fetchWithTimeout(listUrl, {
            headers: {
                'Authorization': `Bearer ${apiKey}`
            },
            cache: 'no-store'
        }, 15000);

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            const message = errorData?.message || 'Failed to fetch subscribers';
            return NextResponse.json({ error: message }, { status: res.status });
        }

        const data = await res.json();
        const contacts = Array.isArray(data?.data) ? data.data : [];
        const subscribers = contacts.map((contact: ResendContact) => normalizeContact(contact));

        return NextResponse.json({ subscribers }, { headers: { 'Cache-Control': 'no-store' } });
    } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
            return NextResponse.json({ error: 'Request timed out' }, { status: 504 });
        }
        console.error('[subscribers] Failed to fetch:', error);
        return NextResponse.json({ error: 'Failed to fetch subscribers' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const authError = await requireAdmin(req);
    if (authError) return authError;

    const { apiKey, audienceId } = getResendConfig();
    if (!apiKey) {
        return NextResponse.json({ error: 'Resend API key not configured.' }, { status: 400 });
    }

    try {
        const { email } = await req.json();
        if (typeof email !== 'string' || !isValidEmail(email)) {
            return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 });
        }

        const createUrl = getContactsCreateUrl(audienceId);
        const res = await fetchWithTimeout(createUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, unsubscribed: false })
        }, 10000);

        if (res.ok && res.status === 200) {
            return NextResponse.json({ error: 'Subscriber already exists.' }, { status: 409 });
        }

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            const message = errorData?.message || 'Failed to add subscriber';
            return NextResponse.json({ error: message }, { status: res.status });
        }

        const created = await res.json().catch(() => null);
        return NextResponse.json({ subscriber: created }, { status: 201 });
    } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
            return NextResponse.json({ error: 'Request timed out' }, { status: 504 });
        }
        console.error('[subscribers] Failed to add:', error);
        return NextResponse.json({ error: 'Failed to add subscriber' }, { status: 500 });
    }
}


export async function PATCH(req: Request) {
    const authError = await requireAdmin(req);
    if (authError) return authError;

    const { apiKey } = getResendConfig();
    if (!apiKey) {
        return NextResponse.json({ error: 'Resend API key not configured.' }, { status: 400 });
    }

    try {
        const { id, email, status, subscribed } = await req.json();
        const target = id || email;
        if (!target) {
            return NextResponse.json({ error: 'Subscriber id or email is required.' }, { status: 400 });
        }

        const nextStatus: SubscriberStatus | null = status === 'subscribed' || status === 'unsubscribed'
            ? status
            : typeof subscribed === 'boolean'
                ? (subscribed ? 'subscribed' : 'unsubscribed')
                : null;

        if (!nextStatus) {
            return NextResponse.json({ error: 'Invalid status.' }, { status: 400 });
        }

        const res = await fetch(getContactUrl(target), {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ unsubscribed: nextStatus === 'unsubscribed' })
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            const message = errorData?.message || 'Failed to update subscriber';
            return NextResponse.json({ error: message }, { status: res.status });
        }

        const updated = await res.json().catch(() => null);
        return NextResponse.json({ subscriber: updated });
    } catch (error) {
        console.error('[subscribers] Failed to update:', error);
        return NextResponse.json({ error: 'Failed to update subscriber' }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    const authError = await requireAdmin(req);
    if (authError) return authError;

    const { apiKey } = getResendConfig();
    if (!apiKey) {
        return NextResponse.json({ error: 'Resend API key not configured.' }, { status: 400 });
    }

    try {
        const { id, email } = await req.json();
        const target = id || email;
        if (!target) {
            return NextResponse.json({ error: 'Subscriber id or email is required.' }, { status: 400 });
        }

        const res = await fetch(getContactUrl(target), {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${apiKey}`
            }
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            const message = errorData?.message || 'Failed to delete subscriber';
            return NextResponse.json({ error: message }, { status: res.status });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('[subscribers] Failed to delete:', error);
        return NextResponse.json({ error: 'Failed to delete subscriber' }, { status: 500 });
    }
}
