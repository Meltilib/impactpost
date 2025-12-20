import { welcomeEmailTemplate } from './welcome-email-template';

/**
 * Sends a welcome email to a new subscriber using the Resend API.
 * 
 * @param email The recipient's email address
 * @returns Object indicating success or failure
 */
export async function sendWelcomeEmail(email: string) {
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
        console.warn('[Welcome Email] RESEND_API_KEY not configured. Skipping email send.');
        return { success: false, error: 'API key not configured' };
    }

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

        if (!response.ok) {
            console.error('[Welcome Email] Resend API Error:', data);
            return { success: false, error: data.message || 'Failed to send email' };
        }

        console.log(`[Welcome Email] Successfully sent to ${email}. ID: ${data.id}`);
        return { success: true, id: data.id };
    } catch (error) {
        console.error('[Welcome Email] Network Error:', error);
        return { success: false, error: 'Network error occurred' };
    }
}
