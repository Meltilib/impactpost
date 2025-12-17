import { NavItem, SectionInfo } from '@/types';

export const SITE_CONFIG = {
  name: 'IMPACT POST',
  tagline: 'Canadian-Somali News & Perspectives',
  description: 'Leading voice of the Canadian-Somali diaspora. Independent news, youth stories, and community perspectives from Toronto to Vancouver. Stay informed.',
  url: 'https://impactpost.ca',
  twitterHandle: '@impactpost',
  locale: 'en_CA',
  keywords: [
    // Primary niche keywords (highest priority)
    'Canadian Somali news',
    'Somali diaspora Canada',
    'Canadian-Somali community',

    // Geographic keywords (city-specific)
    'Toronto Somali community',
    'Edmonton Somali news',
    'Ottawa Somali diaspora',
    'Vancouver Somali community',

    // Topic-specific keywords
    'Somali youth Canada',
    'Somali Canadian business',
    'diaspora journalism',

    // Broader keywords (secondary)
    'independent journalism Canada',
    'community news Canada',
    'multicultural news',
    'Canadian diversity news',

    // Brand
    'Impact Post',
    'ImpactPost.ca',
  ],
};

export const NAV_ITEMS: NavItem[] = [
  { label: 'News', href: '/news' },
  { label: 'Community', href: '/section/community' },
  { label: 'Youth Hub', href: '/section/youth' },
  { label: 'Wellness', href: '/section/wellness' },
  { label: 'Business', href: '/section/business' },
  { label: 'Issues', href: '/section/issues' },
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
