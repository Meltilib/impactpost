# Lesson Learned: Gmail Spam Placement & One‑Click Unsubscribe (2025-12-21)

## Issue
- Gmail moved welcome emails to spam after refactor c77c660a despite SPF/DKIM/DMARC passing.
- Root cause: Gmail treated the unsubscribe experience as broken/slow. One‑click POST could be delayed by the Resend PATCH call, and footer links previously 404’d.

## Fix Implemented
- Made `/api/email/unsubscribe` return success immediately and perform the Resend PATCH asynchronously (fire-and-forget) to keep Gmail’s one‑click under sub‑second latency.
- Added compliance copy to email footers: “why you got this email” + mailing address (configurable via `NEXT_PUBLIC_POSTAL_ADDRESS`).
- Ensured footer and headers both point to working unsubscribe paths (`/unsubscribe` page + `/api/email/unsubscribe`).

## Takeaways
- Gmail heavily weights one‑click unsubscribe reliability and speed—even with perfect auth. Always return 200/204 instantly; move downstream work off the request path.
- Keep footer links and headers aligned and live; a single 404 can tank reputation.
- Include postal address and “why you got this email” to satisfy Google/Yahoo bulk rules and reduce complaints.

## Checklist for Future Email Changes
- [ ] One‑click endpoint responds immediately (no external calls on the critical path).
- [ ] Accept `application/x-www-form-urlencoded` and JSON bodies; treat missing email as success.
- [ ] DKIM signs `List-Unsubscribe` headers; links resolve (no redirects to 404).
- [ ] Footer contains postal address + subscription reason; links match headers.
- [ ] Smoke test with fresh Gmail inbox, click “Not spam” + unsubscribe links, verify headers in “Show original”.
