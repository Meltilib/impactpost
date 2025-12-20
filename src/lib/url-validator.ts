/**
 * URL Validation Utilities
 * 
 * Security utilities for validating URLs to prevent XSS and open redirect attacks.
 */

const SAFE_PROTOCOLS = ['http:', 'https:', 'mailto:', 'tel:'];

/**
 * Check if a URL is safe for use in links and redirects.
 * Prevents javascript:, data:, and other potentially dangerous protocols.
 * 
 * @param url - The URL to validate
 * @returns true if the URL uses a safe protocol
 */
export function isSafeUrl(url: string): boolean {
    if (!url || typeof url !== 'string') return false;

    // Handle relative URLs (starting with / but not //)
    if (url.startsWith('/') && !url.startsWith('//')) {
        return true;
    }

    // Handle anchor links
    if (url.startsWith('#')) {
        return true;
    }

    try {
        const parsed = new URL(url);
        return SAFE_PROTOCOLS.includes(parsed.protocol);
    } catch {
        // If URL parsing fails, it might be a relative URL or malformed
        // Be conservative and reject it
        return false;
    }
}

/**
 * Check if a URL is an external link (for rel="noopener noreferrer" etc.)
 * 
 * @param url - The URL to check
 * @param currentOrigin - Optional current origin to compare against
 * @returns true if the URL points to an external domain
 */
export function isExternalUrl(url: string, currentOrigin?: string): boolean {
    if (!url || typeof url !== 'string') return false;

    // Relative URLs are internal
    if (url.startsWith('/') || url.startsWith('#')) {
        return false;
    }

    try {
        const parsed = new URL(url);
        if (currentOrigin) {
            const current = new URL(currentOrigin);
            return parsed.origin !== current.origin;
        }
        // If no origin provided, any absolute URL is considered external
        return true;
    } catch {
        return false;
    }
}

/**
 * Sanitize a URL for safe use, returning a fallback if unsafe.
 * 
 * @param url - The URL to sanitize
 * @param fallback - The fallback URL if the input is unsafe (default: '#')
 * @returns The original URL if safe, otherwise the fallback
 */
export function sanitizeUrl(url: string, fallback: string = '#'): string {
    return isSafeUrl(url) ? url : fallback;
}
