import { NextResponse } from 'next/server';

export async function GET() {
    const apiKey = process.env.RESEND_API_KEY;
    const audienceId = process.env.RESEND_AUDIENCE_ID;

    if (!apiKey) {
        // Return mock data for demonstration if no API key
        return NextResponse.json({
            subscribers: [
                { id: '1', email: 'demo@example.com', created_at: new Date().toISOString(), status: 'subscribed' },
                { id: '2', email: 'reader@test.com', created_at: new Date(Date.now() - 86400000).toISOString(), status: 'subscribed' },
                { id: '3', email: 'old@user.com', created_at: new Date(Date.now() - 100000000).toISOString(), status: 'unsubscribed' },
            ],
            mock: true
        });
    }

    try {
        // Fetch from Resend API (Audiences/Contacts)
        // Documentation: https://resend.com/docs/api-reference/contacts/list-contacts
        const res = await fetch('https://api.resend.com/audiences', {
            headers: {
                'Authorization': `Bearer ${apiKey}`
            }
        });

        // Note: To list contacts, you first need the Audience ID. 
        // If user hasn't set AUDIENCE_ID, we might just list Audiences or return empty.
        // For simplicity, let's assume if they have a key, they might just want to see a placeholder or we list audiences.
        // A better approach for a "List" page is to list Contacts of the specific Default Audience.

        // Standard Resend flow: Get Audience ID -> List Contacts.
        // Let's try to get the list of audiences first if no ID is provided.

        if (!res.ok) {
            throw new Error(`Resend API Error: ${res.statusText}`);
        }

        const data = await res.json();
        // Logic to extract contacts would go here. 
        // For now, let's return the data/mock.

        // If we want to actually list contacts, we need to correct the endpoint.
        // GET /audiences/{audience_id}/contacts

        if (audienceId) {
            const contactsRes = await fetch(`https://api.resend.com/audiences/${audienceId}/contacts`, {
                headers: { 'Authorization': `Bearer ${apiKey}` }
            });
            if (contactsRes.ok) {
                const contactsData = await contactsRes.json();
                return NextResponse.json({ subscribers: contactsData.data });
            }
        }

        return NextResponse.json({
            message: 'Resend Connected. Configure RESEND_AUDIENCE_ID to see specific contacts.',
            data
        });

    } catch {
        return NextResponse.json({ error: 'Failed to fetch subscribers' }, { status: 500 });
    }
}
