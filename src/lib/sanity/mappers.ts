import type { Story, Event, Category } from '@/types';
import { urlFor } from './image';
import type { PortableTextBlock } from '@portabletext/types';

// Sanity document types
export interface SanityArticle {
  _id: string;
  title: string;
  subtitle?: string;
  slug: string;
  excerpt?: string;
  body?: PortableTextBlock[];
  publishedAt?: string;
  isFeatured?: boolean;
  tags?: string[];
  photoCredit?: string;
  mediaType?: 'image' | 'video';
  mainImage?: {
    asset?: {
      _id: string;
      url: string;
    };
    alt?: string;
  };
  videoFile?: {
    asset?: {
      _id: string;
      url: string;
    };
  };
  videoUrl?: string;
  videoThumbnail?: {
    asset?: {
      _id: string;
      url: string;
    };
    alt?: string;
  };
  author?: {
    _id: string;
    name: string;
    role?: string;
    bio?: string;
    image?: {
      asset?: {
        _id: string;
        url: string;
      };
    };
  };
  category?: {
    _id: string;
    title: string;
    slug: string;
    color?: string;
    textColor?: string;
  };
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    socialImage?: {
      asset?: {
        url: string;
      };
    };
  };
}

// Multimedia story type for homepage featured multimedia section
export interface MultimediaStory {
  id: string;
  slug: string;
  title: string;
  mediaType: 'image' | 'video';
  imageUrl: string;
  videoUrl?: string;
  thumbnailUrl: string;
  categoryTitle: string;
  categorySlug: string;
}

export interface SanityEvent {
  _id: string;
  title: string;
  slug: string;
  eventDate: string;
  location?: string;
  type?: string;
  description?: string;
  registrationUrl?: string;
  image?: {
    asset?: {
      _id: string;
      url: string;
    };
  };
}

export interface SanityCategory {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  color?: string;
  textColor?: string;
}

// Calculate read time from portable text blocks
function calculateReadTime(body?: PortableTextBlock[]): string {
  if (!body) return '3 min read';

  const text = body
    .filter((block): block is PortableTextBlock & { children: { text: string }[] } =>
      block._type === 'block' && Array.isArray(block.children)
    )
    .map((block) => block.children.map((child) => child.text || '').join(''))
    .join(' ');

  const wordCount = text.split(/\s+/).filter(Boolean).length;
  const minutes = Math.ceil(wordCount / 200); // Average reading speed
  return `${minutes} min read`;
}

// Format date for display
function formatDate(dateString?: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

// Format event date
function formatEventDate(dateString: string): string {
  const date = new Date(dateString);
  const month = date.toLocaleDateString('en-CA', { month: 'short' });
  const day = date.getDate().toString().padStart(2, '0');
  const time = date.toLocaleTimeString('en-CA', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
  return `${month} ${day}, ${time}`;
}

// Map Sanity article to Story type
export function mapSanityArticle(doc: SanityArticle): Story {
  return {
    id: doc._id,
    slug: doc.slug,
    title: doc.title,
    excerpt: doc.excerpt || '',
    content: '', // Rich text is handled separately via Portable Text
    category: (doc.category?.title || 'Community Voices') as Category,
    imageUrl: doc.mainImage?.asset?.url
      ? urlFor(doc.mainImage).width(800).height(600).url()
      : '/images/placeholder.jpg',
    photoCredit: doc.photoCredit || 'Impact Post',
    author: {
      id: doc.author?._id || 'unknown',
      name: doc.author?.name || 'IMPACT POST',
      role: doc.author?.role || 'Staff',
      avatarUrl: doc.author?.image?.asset?.url
        ? urlFor(doc.author.image).width(100).height(100).url()
        : '/images/avatar-placeholder.jpg',
      bio: doc.author?.bio,
    },
    date: formatDate(doc.publishedAt),
    readTime: calculateReadTime(doc.body),
    isFeatured: doc.isFeatured || false,
    tags: doc.tags || [],
  };
}

// Map array of Sanity articles to Story array
export function mapSanityArticles(docs: SanityArticle[]): Story[] {
  return docs.map(mapSanityArticle);
}

// Map Sanity event to Event type
export function mapSanityEvent(doc: SanityEvent): Event {
  return {
    id: doc._id,
    title: doc.title,
    date: formatEventDate(doc.eventDate),
    location: doc.location || 'TBA',
    type: doc.type || 'Community',
    description: doc.description,
  };
}

// Map array of Sanity events to Event array
export function mapSanityEvents(docs: SanityEvent[]): Event[] {
  return docs.map(mapSanityEvent);
}

// Map Sanity article to MultimediaStory for homepage multimedia section
export function mapSanityMultimedia(doc: SanityArticle): MultimediaStory {
  const isVideo = doc.mediaType === 'video';

  // Determine video URL (file upload takes precedence over external URL)
  const videoUrl = doc.videoFile?.asset?.url || doc.videoUrl || undefined;

  // Thumbnail: use videoThumbnail for videos, mainImage for images
  const thumbnailUrl = isVideo
    ? (doc.videoThumbnail?.asset?.url || doc.mainImage?.asset?.url || '/images/multimedia-cover.jpg')
    : (doc.mainImage?.asset?.url || '/images/multimedia-cover.jpg');

  return {
    id: doc._id,
    slug: doc.slug,
    title: doc.title,
    mediaType: isVideo ? 'video' : 'image',
    imageUrl: doc.mainImage?.asset?.url || '/images/multimedia-cover.jpg',
    videoUrl,
    thumbnailUrl,
    categoryTitle: doc.category?.title || 'Documentary',
    categorySlug: doc.category?.slug || 'multimedia',
  };
}
