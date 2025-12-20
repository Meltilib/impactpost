import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getCategoryColor(category: string): string {
  const cat = category.toLowerCase();
  if (cat.includes('community') || cat.includes('voices') || cat.includes('culture') || cat.includes('purple')) {
    if (cat.includes('yellow') || cat.includes('culture')) return 'bg-brand-yellow text-black';
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
