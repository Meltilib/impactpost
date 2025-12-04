import { NavItem, SectionInfo } from '@/types';

export const SITE_CONFIG = {
  name: 'IMPACT POST',
  tagline: 'Voices of Strength. Stories of Impact.',
  description: 'Amplifying the voices, stories, and achievements of equity-deserving communities through independent journalism.',
  url: 'https://impactpost.ca',
  twitterHandle: '@impactpost',
  locale: 'en_CA',
};

export const NAV_ITEMS: NavItem[] = [
  { label: 'News', href: '/news' },
  { label: 'Voices', href: '/section/community-voices' },
  { label: 'Youth Hub', href: '/section/youth' },
  { label: 'Multimedia', href: '/section/multimedia' },
  { label: 'Community', href: '/section/community' },
  { label: 'About Us', href: '/about' },
];

export const SECTIONS: Record<string, SectionInfo> = {
  news: {
    title: 'Latest News',
    description: 'Breaking news and updates from across the diaspora.',
    color: 'bg-brand-blue',
    slug: 'news',
  },
  'community-voices': {
    title: 'Community Voices',
    description: 'Stories that amplify the diverse experiences of our people.',
    color: 'bg-brand-purple',
    slug: 'community-voices',
  },
  youth: {
    title: 'Youth Hub',
    description: 'Spotlighting the next generation of leaders and creators.',
    color: 'bg-brand-teal',
    slug: 'youth',
  },
  multimedia: {
    title: 'Multimedia',
    description: 'Visual storytelling, documentaries, and photo essays.',
    color: 'bg-brand-coral',
    slug: 'multimedia',
  },
  community: {
    title: 'Community & Culture',
    description: 'Celebrating our heritage, businesses, and wellness.',
    color: 'bg-brand-yellow',
    slug: 'community',
  },
  business: {
    title: 'Business & Entrepreneurship',
    description: 'Spotlighting community entrepreneurs and economic growth.',
    color: 'bg-brand-blue',
    slug: 'business',
  },
  wellness: {
    title: 'Family & Wellness',
    description: 'Resources for mental health, education, and family life.',
    color: 'bg-brand-yellow',
    slug: 'wellness',
  },
  issues: {
    title: 'Issues & Solutions',
    description: 'Examining systemic challenges with actionable solutions.',
    color: 'bg-black',
    slug: 'issues',
  },
};

export const CONTENT_PILLARS = [
  { name: 'Community Voices', slug: 'community-voices', color: 'bg-brand-purple', textColor: 'text-white' },
  { name: 'Youth & Leadership', slug: 'youth', color: 'bg-brand-teal', textColor: 'text-black' },
  { name: 'Business', slug: 'business', color: 'bg-brand-blue', textColor: 'text-white' },
  { name: 'Culture', slug: 'community', color: 'bg-brand-yellow', textColor: 'text-black' },
];
