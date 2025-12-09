import { createClient, type SanityClient } from 'next-sanity';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const useSanity = process.env.NEXT_PUBLIC_USE_SANITY === 'true' && projectId;
export const isSanityEnabled = Boolean(useSanity);

// Only create clients if Sanity is configured
export const client: SanityClient | null = useSanity
  ? createClient({
      projectId: projectId!,
      dataset,
      apiVersion: '2024-01-01',
      useCdn: process.env.NODE_ENV === 'production',
    })
  : null;

export const previewClient: SanityClient | null = useSanity
  ? createClient({
      projectId: projectId!,
      dataset,
      apiVersion: '2024-01-01',
      useCdn: false,
      token: process.env.SANITY_API_TOKEN,
    })
  : null;

export function getClient(preview = false): SanityClient | null {
  if (!useSanity) return null;
  return preview ? previewClient : client;
}

export function logSanityFallback(source: string, error?: unknown) {
  console.warn(
    `[Sanity:${source}] Falling back to static data${error ? ` (${error instanceof Error ? error.message : String(error)})` : ''}.`
  );
}
