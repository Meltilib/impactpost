/**
 * Rate Limiting Utility
 * 
 * Uses Upstash Redis for serverless-compatible rate limiting.
 * Falls back gracefully if Redis is not configured.
 */

import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Check if Upstash Redis is configured
const isRedisConfigured = Boolean(
    process.env.UPSTASH_REDIS_REST_URL &&
    process.env.UPSTASH_REDIS_REST_TOKEN
);

// Create Redis client only if configured
const redis = isRedisConfigured
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL!,
        token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    })
    : null;

/**
 * Rate limiter for newsletter subscriptions
 * Allows 5 requests per minute per IP
 */
export const newsletterRateLimiter = redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(5, '1 m'),
        analytics: true,
        prefix: 'ratelimit:newsletter',
    })
    : null;

/**
 * Rate limiter for admin API endpoints
 * More generous: 30 requests per minute
 */
export const adminRateLimiter = redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(30, '1 m'),
        analytics: true,
        prefix: 'ratelimit:admin',
    })
    : null;

/**
 * Get client IP from request headers
 */
export function getClientIp(request: Request): string {
    const forwardedFor = request.headers.get('x-forwarded-for');
    if (forwardedFor) {
        // x-forwarded-for can contain multiple IPs, use the first one
        return forwardedFor.split(',')[0].trim();
    }

    const realIp = request.headers.get('x-real-ip');
    if (realIp) {
        return realIp;
    }

    // Fallback for local development
    return '127.0.0.1';
}

/**
 * Check rate limit and return result
 */
export async function checkRateLimit(
    limiter: Ratelimit | null,
    identifier: string
): Promise<{ success: boolean; remaining?: number; reset?: number }> {
    if (!limiter) {
        // If rate limiting is not configured, allow all requests
        return { success: true };
    }

    try {
        const result = await limiter.limit(identifier);
        return {
            success: result.success,
            remaining: result.remaining,
            reset: result.reset,
        };
    } catch (error) {
        console.error('[RateLimit] Error checking rate limit:', error);
        // On error, fail open (allow the request)
        return { success: true };
    }
}

/**
 * Log rate limit status (useful for debugging)
 */
export function isRateLimitingEnabled(): boolean {
    return isRedisConfigured;
}
