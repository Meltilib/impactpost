export interface Author {
  id: string;
  name: string;
  role: string;
  avatarUrl: string;
}

export interface Story {
  id: string;
  title: string;
  excerpt: string;
  category: 'Community Voices' | 'Youth' | 'Business' | 'Culture' | 'Wellness' | 'Issues' | 'Multimedia';
  imageUrl: string;
  author: Author;
  date: string;
  readTime: string;
  isFeatured?: boolean;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  type: string;
}

export type NavItem = {
  label: string;
  href: string;
  children?: NavItem[];
};