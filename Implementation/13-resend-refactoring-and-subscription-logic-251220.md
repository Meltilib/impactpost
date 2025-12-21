# #13 | 2025-12-20 | Resend API Refactoring & Subscription Logic

## Overview
Refactored the Resend integration to centralize configuration and hardened the newsletter subscription logic. Introduced a "pre-flight" check to avoid duplicate welcome emails and added a health endpoint for diagnostic visibility.

## Technical Changes

### 🔧 1. Centralized Resend Configuration
- **Unified Config**: Created `src/lib/resend/config.ts` to manage environment variables (`RESEND_API_KEY`, `RESEND_AUDIENCE_ID`).
- **Standardized Headers**: Added `buildResendHeaders` to ensure consistent `Authorization` and `Content-Type` across all routes.
- **Improved Error Messaging**: Centralized `resendConfigMessage` for consistent 503/400 error reporting when credentials are missing.

### 🛡️ 2. Subscription Logic Hardening
- **Pre-flight Status Check**: Refactored `/api/newsletter/subscribe` to check for existing contacts *before* attempting creation.
- **Auto-Resubscription**: If an existing contact is found with `unsubscribed: true`, the system now automatically patches them back to `unsubscribed: false`.
- **Duplicate Prevention**: Returns distinct success messages for "already subscribed" vs "re-subscribed" cases, while strictly avoiding redundant welcome emails.

### 🩺 3. Monitoring & Health
- **Diagnostics**: Added `/api/health/newsletter` to verify Resend configuration status and rate-limiting connectivity without exposing secrets.
- **Defensive Mocking**: Improved mock fallbacks in development when API keys are missing.

## Files Touched
- `src/lib/resend/config.ts` [NEW]
- `src/app/api/health/newsletter/route.ts` [NEW]
- `src/app/api/newsletter/subscribe/route.ts`
- `src/app/api/admin/subscribers/route.ts`
- `src/app/admin/subscribers/page.tsx`

## Verification
- Verified `/api/health/newsletter` returns correct configuration status.
- Tested "Re-subscription" flow: patching an unsubscribed contact via the UI now correctly reactivates them.
- Verified pre-flight check prevents duplicate welcome emails.
- Passed `npm run lint` and `npx tsc --noEmit`.
