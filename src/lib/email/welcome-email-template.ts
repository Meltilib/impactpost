const mailingAddress = process.env.NEXT_PUBLIC_POSTAL_ADDRESS || 'Impact Post, Canada';
const subscriptionReason = 'You received this email because you subscribed at impactpost.ca.';

export const welcomeEmailPlaintext = (email: string) => {
    const year = new Date().getFullYear();
    return `Welcome to Impact Post

You're part of the Impact now!

Thanks for subscribing to Impact Post. We're thrilled to have you in our community. You'll now be the first to know about local stories, community events, and critical news that matters to you.

What to expect:
- Weekly curated community news
- Exclusive event invitations
- Deep dives into local impact stories
- Opportunities to get involved

Stay tuned for our next update. In the meantime, feel free to explore our latest stories.

Visit our website: https://impactpost.ca

---

© ${year} Impact Post. All rights reserved.
Manage your subscription: https://impactpost.ca/unsubscribe?email=${encodeURIComponent(email)}

Questions? Contact us at support@impactpost.ca
${subscriptionReason}
Mailing address: ${mailingAddress}
`;
};

export const welcomeEmailTemplate = (email: string) => {
    const year = new Date().getFullYear();
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Impact Post</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background-color: #f3f4f6;
            color: #1f2937;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border: 2px solid #000000;
        }
        .header {
            background-color: #8A2BE2;
            padding: 30px 20px;
            border-bottom: 2px solid #000000;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 32px;
            font-weight: bold;
            letter-spacing: -1px;
            color: #ffffff;
        }
        .header h1 span {
            color: #FF7F50;
        }
        .content {
            padding: 30px 20px;
        }
        .welcome-text {
            font-size: 20px;
            font-weight: bold;
            margin-bottom: 15px;
            line-height: 1.3;
            color: #000000;
        }
        .body-text {
            font-size: 15px;
            line-height: 1.6;
            margin-bottom: 20px;
            color: #374151;
        }
        .highlight-box {
            background-color: #FEF3C7;
            border: 1px solid #FCD34D;
            padding: 15px;
            margin-bottom: 20px;
        }
        .highlight-box h3 {
            margin: 0 0 10px 0;
            font-size: 14px;
            font-weight: bold;
            color: #000000;
        }
        .highlight-box ul {
            margin: 0;
            padding-left: 18px;
            font-size: 14px;
            color: #374151;
        }
        .highlight-box li {
            margin-bottom: 5px;
        }
        .cta-button {
            display: inline-block;
            background-color: #000000;
            color: #ffffff;
            text-decoration: none;
            padding: 12px 24px;
            font-weight: bold;
            font-size: 14px;
            border: 1px solid #000000;
        }
        .cta-button:hover {
            background-color: #1f2937;
        }
        .footer {
            padding: 20px;
            background-color: #f9fafb;
            border-top: 1px solid #e5e7eb;
            font-size: 12px;
            color: #6b7280;
            text-align: center;
        }
        .footer p {
            margin: 8px 0;
        }
        .footer a {
            color: #000000;
            text-decoration: underline;
        }
        a {
            color: #000000;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>IMPACT<span>POST</span></h1>
        </div>
        <div class="content">
            <div class="welcome-text">You're part of the Impact now!</div>
            
            <p class="body-text">
                Thanks for subscribing to Impact Post. We're thrilled to have you in our community. 
                You'll now be the first to know about local stories, community events, and critical news that matters to you.
            </p>
            
            <div class="highlight-box">
                <h3>What to expect:</h3>
                <ul>
                    <li>Weekly curated community news</li>
                    <li>Exclusive event invitations</li>
                    <li>Deep dives into local impact stories</li>
                    <li>Opportunities to get involved</li>
                </ul>
            </div>

            <p class="body-text">
                Stay tuned for our next update. In the meantime, feel free to explore our latest stories.
            </p>

            <div style="text-align: center; margin-top: 30px;">
                <a href="https://impactpost.ca" class="cta-button">Visit Website</a>
            </div>
        </div>
        <div class="footer">
            <p>&copy; ${year} Impact Post. All rights reserved.</p>
            <p>
                <a href="https://impactpost.ca/unsubscribe?email=${encodeURIComponent(email)}">Manage subscription</a>
            </p>
            <p>${subscriptionReason}</p>
            <p>Mailing address: ${mailingAddress}</p>
        </div>
    </div>
</body>
</html>
`;
};
