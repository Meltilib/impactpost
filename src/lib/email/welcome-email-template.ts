function escapeHtml(value: string) {
    return value
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');
}

export const welcomeEmailTemplate = (email: string) => {
    const safeEmail = escapeHtml(email);
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
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            background-color: #f3f4f6;
            color: #000000;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border: 4px solid #000000;
            box-shadow: 12px 12px 0px #000000;
        }
        .header {
            background-color: #8A2BE2; /* brand-purple */
            padding: 40px 20px;
            border-bottom: 4px solid #000000;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 42px;
            font-weight: 900;
            letter-spacing: -2px;
            color: #ffffff;
            text-transform: uppercase;
            font-style: italic;
        }
        .header h1 span {
            color: #FF7F50; /* brand-coral */
        }
        .content {
            padding: 40px 30px;
        }
        .welcome-text {
            font-size: 24px;
            font-weight: 800;
            margin-bottom: 20px;
            line-height: 1.2;
            text-transform: uppercase;
        }
        .body-text {
            font-size: 16px;
            line-height: 1.6;
            margin-bottom: 30px;
            color: #333333;
        }
        .highlight-box {
            background-color: #FFD700; /* brand-yellow */
            border: 3px solid #000000;
            padding: 20px;
            margin-bottom: 30px;
            box-shadow: 6px 6px 0px #000000;
        }
        .highlight-box h3 {
            margin-top: 0;
            text-transform: uppercase;
            font-size: 18px;
            font-weight: 900;
        }
        .cta-button {
            display: inline-block;
            background-color: #000000;
            color: #ffffff !important;
            text-decoration: none;
            padding: 15px 30px;
            font-weight: 900;
            text-transform: uppercase;
            border: 2px solid #000000;
            transition: all 0.2s;
        }
        .footer {
            padding: 30px;
            background-color: #f9fafb;
            border-top: 2px solid #eeeeee;
            font-size: 12px;
            color: #666666;
            text-align: center;
        }
        .footer a {
            color: #000000;
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>IMPACT<span>POST</span></h1>
        </div>
        <div class="content">
            <div class="welcome-text">YOU'RE PART OF THE IMPACT NOW!</div>
            <p class="body-text">
                Thanks for subscribing to <strong>Impact Post</strong>. We're thrilled to have you in our community. 
                You'll now be the first to know about local stories, community events, and critical news that matters to you.
            </p>
            
            <div class="highlight-box">
                <h3>What to expect:</h3>
                <ul style="margin: 0; padding-left: 20px; font-weight: 500;">
                    <li>Weekly curated community news</li>
                    <li>Exclusive event invitations</li>
                    <li>Deep dives into local impact stories</li>
                    <li>Opportunities to get involved</li>
                </ul>
            </div>

            <p class="body-text">
                Stay tuned for our next update. In the meantime, feel free to explore our latest stories.
            </p>

            <div style="text-align: center;">
                <a href="https://impactpost.ca" class="cta-button">Visit Website</a>
            </div>
        </div>
        <div class="footer">
            <p>Sent to ${safeEmail}</p>
            <p>&copy; ${year} Impact Post. All rights reserved.</p>
            <p>
                Interested in supporting our work? <a href="mailto:info@impactpost.ca">Contact us</a><br>
                Changed your mind? <a href="#">Unsubscribe</a>
            </p>
        </div>
    </div>
</body>
</html>
`;
};
