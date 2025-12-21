/**
 * Centralized Resend configuration helpers.
 * Ensures all routes share the same credential checks and safe fallbacks.
 */

export type ResendEnvState = {
  apiKey?: string;
  audienceId?: string;
  missing: string[];
  configured: boolean;
};

const isDev = process.env.NODE_ENV !== 'production';

export function getResendEnv(): ResendEnvState {
  const apiKey = process.env.RESEND_API_KEY;
  const audienceId = process.env.RESEND_AUDIENCE_ID;
  const missing: string[] = [];

  if (!apiKey) missing.push('RESEND_API_KEY');
  if (!audienceId) missing.push('RESEND_AUDIENCE_ID');

  return {
    apiKey,
    audienceId,
    missing,
    configured: missing.length === 0,
  };
}

export function buildResendHeaders(apiKey: string, extra?: Record<string, string>) {
  return {
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
    ...(extra ?? {}),
  };
}

export function getContactUrl(contactIdOrEmail: string) {
  return `https://api.resend.com/contacts/${encodeURIComponent(contactIdOrEmail)}`;
}

/**
 * Decide whether we should return mock data instead of contacting Resend.
 * In production we prefer to surface a 503 so operators notice misconfiguration.
 */
export function shouldUseResendMock(configured: boolean) {
  return !configured && isDev;
}

export function resendConfigMessage(missing: string[]) {
  const fields = missing.join(', ') || 'RESEND_* env vars';
  return `Resend is not configured. Missing: ${fields}`;
}
