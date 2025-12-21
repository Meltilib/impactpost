import { welcomeEmailTemplate } from './welcome-email-template';

/**
 * Delay utility for rate limiting
 */
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Calculate exponential backoff delay with jitter
 * @param attempt Current retry attempt (0-indexed)
 * @param baseDelay Base delay in ms
 * @returns Delay in ms with jitter
 */
function getBackoffDelay(attempt: number, baseDelay = 1000): number {
    const exponentialDelay = baseDelay * Math.pow(2, attempt);
    const jitter = Math.random() * 200; // Add 0-200ms random jitter
    return Math.min(exponentialDelay + jitter, 10000); // Cap at 10 seconds
}

/**
 * Sends a welcome email to a new subscriber using the Resend API.
 * Implements rate limit handling with intelligent delays and exponential backoff.
 * 
 * @param email The recipient's email address
 * @returns Object indicating success or failure
 */
export async function sendWelcomeEmail(email: string) {
    const apiKey = process.env.RESEND_API_KEY;
    const MAX_RETRIES = 3;

    if (!apiKey) {
        console.warn('[Welcome Email] RESEND_API_KEY not configured. Skipping email send.');
        return { success: false, error: 'API key not configured' };
    }

    // Add initial delay to prevent rate limit when called right after contact creation
    // Resend has a 2 RPS limit, so we wait 600ms to be safe
    await delay(600);

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
        try {
            const response = await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    from: 'Impact Post <newsletter@impactpost.ca>', // Ensure this domain is verified in Resend
                    to: email,
                    subject: 'Welcome to Impact Post! 🎉',
                    html: welcomeEmailTemplate(email),
                    tags: [
                        {
                            name: 'category',
                            value: 'welcome_email',
                        },
                    ],
                }),
            });

            const data = await response.json();

            // Handle rate limit (429) with retry
            if (response.status === 429) {
                if (attempt < MAX_RETRIES) {
                    // Check for retry-after header
                    const retryAfter = response.headers.get('retry-after');
                    const waitTime = retryAfter
                        ? parseInt(retryAfter, 10) * 1000
                        : getBackoffDelay(attempt);

                    console.warn(`[Welcome Email] Rate limited (attempt ${attempt + 1}/${MAX_RETRIES + 1}). Retrying in ${waitTime}ms...`);
                    await delay(waitTime);
                    continue;
                }
                console.error('[Welcome Email] Rate limit exceeded after max retries');
                return { success: false, error: 'Rate limit exceeded' };
            }

            if (!response.ok) {
                console.error('[Welcome Email] Resend API Error:', data);
                return { success: false, error: data.message || 'Failed to send email' };
            }

            console.log(`[Welcome Email] Successfully sent to ${email}. ID: ${data.id}`);
            return { success: true, id: data.id };
        } catch (error) {
            // Network errors - retry with backoff
            if (attempt < MAX_RETRIES) {
                const waitTime = getBackoffDelay(attempt);
                console.warn(`[Welcome Email] Network error (attempt ${attempt + 1}/${MAX_RETRIES + 1}). Retrying in ${waitTime}ms...`);
                await delay(waitTime);
                continue;
            }
            console.error('[Welcome Email] Network Error after max retries:', error);
            return { success: false, error: 'Network error occurred' };
        }
    }

    return { success: false, error: 'Failed after max retries' };
}
