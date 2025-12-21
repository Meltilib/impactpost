import { NextResponse } from 'next/server';
import { getResendEnv } from '@/lib/resend/config';
import { isRateLimitingEnabled } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

export async function GET() {
    const { configured, missing } = getResendEnv();

    return NextResponse.json(
        {
            resendConfigured: configured,
            missingEnv: missing,
            rateLimiting: isRateLimitingEnabled(),
            env: process.env.NODE_ENV || 'development',
        },
        {
            headers: { 'Cache-Control': 'no-store' }
        }
    );
}
