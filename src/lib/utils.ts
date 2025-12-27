import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getCategoryColor(category: string): string {
  const cat = category.toLowerCase();

  if (cat.includes('culture')) return 'bg-brand-green text-white';

  if (cat.includes('community') || cat.includes('voices') || cat.includes('purple')) {
    if (cat.includes('yellow')) return 'bg-brand-yellow text-black';
    return 'bg-brand-purple text-white';
  }
  if (cat.includes('youth') || cat.includes('teal')) return 'bg-brand-teal text-black';
  if (cat.includes('business') || cat.includes('blue') || cat.includes('news')) return 'bg-brand-blue text-white';
  if (cat.includes('coral') || cat.includes('multimedia')) return 'bg-brand-coral text-white';
  if (cat.includes('wellness') || cat.includes('yellow')) return 'bg-brand-yellow text-black';
  if (cat.includes('issues') || cat.includes('black')) return 'bg-black text-white';

  return 'bg-black text-white';
}

export function getCategorySlug(category: string): string {
  return category.toLowerCase().replace(/\s+/g, '-');
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-CA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function isValidEmail(email: string) {
  // Simple validation; also blocks obvious HTML/script injection vectors.
  return /^[^\s<>@]+@[^\s<>@]+\.[^\s<>@]+$/.test(email);
}

/**
 * Suggests a likely correction for common email typos (e.g., .comm -> .com, gamil.com -> gmail.com).
 * Returns the corrected email or null if no safe suggestion is found.
 */
export function suggestEmailCorrection(email: string): string | null {
  if (!email || typeof email !== 'string') return null;

  const lower = email.toLowerCase().trim();
  const atIndex = lower.indexOf('@');
  if (atIndex === -1) return null;

  const local = lower.slice(0, atIndex);
  const domain = lower.slice(atIndex + 1);

  const domainCorrections: Record<string, string> = {
    'gamil.com': 'gmail.com',
    'gmai.com': 'gmail.com',
    'gmail.con': 'gmail.com',
    'hotmail.co': 'hotmail.com',
    'hotnail.com': 'hotmail.com',
    'yaho.com': 'yahoo.com',
    'yaho.co': 'yahoo.com',
    'outlok.com': 'outlook.com',
    'icloud.co': 'icloud.com',
  };

  const tldCorrections: Record<string, string> = {
    '.comm': '.com',
    '.con': '.com',
    '.cmo': '.com',
    '.cim': '.com',
    '.coom': '.com',
  };

  // Exact domain corrections
  if (domainCorrections[domain]) {
    return `${local}@${domainCorrections[domain]}`;
  }

  // TLD typos
  for (const [bad, good] of Object.entries(tldCorrections)) {
    if (domain.endsWith(bad)) {
      return `${local}@${domain.replace(new RegExp(`${bad}$`), good)}`;
    }
  }

  return null;
}

/**
 * Fetch with timeout using AbortController
 */
export async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeoutMs: number = 10000
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Escape HTML entities to prevent XSS
 */
export function escapeHtml(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
