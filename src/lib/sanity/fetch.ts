import { draftMode } from 'next/headers';
import { client, previewClient } from './client';
import {
  featuredArticleQuery,
  recentArticlesQuery,
  articlesQuery,
  articleBySlugQuery,
  articlesByCategoryQuery,
  eventsQuery,
  categoryBySlugQuery,
  articleSlugsQuery,
  categorySlugsQuery,
} from './queries';
import {
  mapSanityArticle,
  mapSanityArticles,
  mapSanityEvents,
  type SanityArticle,
  type SanityEvent,
  type SanityCategory,
} from './mappers';
import {
  FEATURED_STORY,
  RECENT_STORIES,
  EVENTS,
  getAllStories,
  getStoryBySlug,
  getStoriesByCategory,
} from '@/lib/data';
import type { Story, Event } from '@/types';

// Get the appropriate client based on draft mode
async function getClientForFetch() {
  // If no client is configured, return null
  if (!client) return null;
  
  try {
    const draft = await draftMode();
    return draft.isEnabled ? previewClient : client;
  } catch {
    return client;
  }
}

// Fetch featured article
export async function fetchFeaturedStory(): Promise<Story> {
  const sanityClient = await getClientForFetch();
  
  if (sanityClient) {
    try {
      const article: SanityArticle | null = await sanityClient.fetch(featuredArticleQuery);
      if (article) {
        return mapSanityArticle(article);
      }
    } catch (error) {
      console.error('Error fetching featured article from Sanity:', error);
    }
  }
  
  // Fallback to static data
  return FEATURED_STORY;
}

// Fetch recent articles
export async function fetchRecentStories(): Promise<Story[]> {
  const sanityClient = await getClientForFetch();
  
  if (sanityClient) {
    try {
      const articles: SanityArticle[] = await sanityClient.fetch(recentArticlesQuery);
      if (articles && articles.length > 0) {
        return mapSanityArticles(articles);
      }
    } catch (error) {
      console.error('Error fetching recent articles from Sanity:', error);
    }
  }
  
  // Fallback to static data
  return RECENT_STORIES;
}

// Fetch all articles
export async function fetchAllStories(): Promise<Story[]> {
  const sanityClient = await getClientForFetch();
  
  if (sanityClient) {
    try {
      const articles: SanityArticle[] = await sanityClient.fetch(articlesQuery);
      if (articles && articles.length > 0) {
        return mapSanityArticles(articles);
      }
    } catch (error) {
      console.error('Error fetching all articles from Sanity:', error);
    }
  }
  
  // Fallback to static data
  return getAllStories();
}

// Fetch single article by slug
export async function fetchStoryBySlug(slug: string): Promise<{ story: Story; body?: unknown } | null> {
  const sanityClient = await getClientForFetch();
  
  if (sanityClient) {
    try {
      const article: SanityArticle | null = await sanityClient.fetch(
        articleBySlugQuery,
        { slug }
      );
      if (article) {
        return {
          story: mapSanityArticle(article),
          body: article.body, // Return raw body for Portable Text rendering
        };
      }
    } catch (error) {
      console.error('Error fetching article from Sanity:', error);
    }
  }
  
  // Fallback to static data
  const story = getStoryBySlug(slug);
  if (story) {
    return { story, body: undefined };
  }
  return null;
}

// Fetch articles by category
export async function fetchStoriesByCategory(category: string): Promise<Story[]> {
  const sanityClient = await getClientForFetch();
  
  if (sanityClient) {
    try {
      const articles: SanityArticle[] = await sanityClient.fetch(
        articlesByCategoryQuery,
        { category }
      );
      if (articles && articles.length > 0) {
        return mapSanityArticles(articles);
      }
    } catch (error) {
      console.error('Error fetching articles by category from Sanity:', error);
    }
  }
  
  // Fallback to static data
  return getStoriesByCategory(category);
}

// Fetch category info
export async function fetchCategoryBySlug(slug: string): Promise<SanityCategory | null> {
  const sanityClient = await getClientForFetch();
  
  if (sanityClient) {
    try {
      const category: SanityCategory | null = await sanityClient.fetch(
        categoryBySlugQuery,
        { slug }
      );
      return category;
    } catch (error) {
      console.error('Error fetching category from Sanity:', error);
    }
  }
  
  return null;
}

// Fetch events
export async function fetchEvents(): Promise<Event[]> {
  const sanityClient = await getClientForFetch();
  
  if (sanityClient) {
    try {
      const events: SanityEvent[] = await sanityClient.fetch(eventsQuery);
      if (events && events.length > 0) {
        return mapSanityEvents(events);
      }
    } catch (error) {
      console.error('Error fetching events from Sanity:', error);
    }
  }
  
  // Fallback to static data
  return EVENTS;
}

// Get all article slugs for static generation
export async function fetchArticleSlugs(): Promise<string[]> {
  const sanityClient = await getClientForFetch();
  
  if (sanityClient) {
    try {
      const slugs: string[] = await sanityClient.fetch(articleSlugsQuery);
      if (slugs && slugs.length > 0) {
        return slugs;
      }
    } catch (error) {
      console.error('Error fetching article slugs from Sanity:', error);
    }
  }
  
  // Fallback to static data
  return getAllStories().map(s => s.slug);
}

// Get all category slugs for static generation
export async function fetchCategorySlugs(): Promise<string[]> {
  const sanityClient = await getClientForFetch();
  
  if (sanityClient) {
    try {
      const slugs: string[] = await sanityClient.fetch(categorySlugsQuery);
      if (slugs && slugs.length > 0) {
        return slugs;
      }
    } catch (error) {
      console.error('Error fetching category slugs from Sanity:', error);
    }
  }
  
  // Fallback to static categories
  return ['community-voices', 'youth', 'business', 'multimedia'];
}
