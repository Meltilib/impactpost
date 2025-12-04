import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getCategoryColor(category: string): string {
  switch (category) {
    case 'Community Voices':
      return 'bg-brand-purple text-white';
    case 'Youth':
      return 'bg-brand-teal text-black';
    case 'Business':
      return 'bg-brand-blue text-white';
    case 'Culture':
      return 'bg-brand-coral text-white';
    case 'Wellness':
      return 'bg-brand-yellow text-black';
    case 'Issues':
      return 'bg-black text-white';
    case 'Multimedia':
      return 'bg-brand-coral text-white';
    default:
      return 'bg-black text-white';
  }
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
