export interface Author {
  id: string;
  name: string;
  role: string;
  avatarUrl: string;
  bio?: string;
}

export interface Story {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content?: string;
  category: Category;
  imageUrl: string;
  author: Author;
  date: string;
  readTime: string;
  isFeatured?: boolean;
  tags?: string[];
}

export type Category = 
  | 'Community Voices' 
  | 'Youth' 
  | 'Business' 
  | 'Culture' 
  | 'Wellness' 
  | 'Issues' 
  | 'Multimedia';

export interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  type: string;
  description?: string;
}

export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

export interface SectionInfo {
  title: string;
  description: string;
  color: string;
  slug: string;
}
