import { draftMode } from 'next/headers';
import { client, previewClient, logSanityFallback } from './client';
import {
  featuredArticleQuery,
  recentArticlesQuery,
  sidebarArticlesQuery,
  articlesQuery,
  articleBySlugQuery,
  articlesByCategoryQuery,
  eventsQuery,
  categoryBySlugQuery,
  articleSlugsQuery,
  categorySlugsQuery,
  featuredMultimediaQuery,
  siteSettingsQuery,
  communitySectionQuery,
} from './queries';
import {
  mapSanityArticle,
  mapSanityArticles,
  mapSanityEvents,
  mapSanityMultimedia,
  type SanityArticle,
  type SanityEvent,
  type SanityCategory,
  type MultimediaStory,
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

const DEFAULT_TICKER_ITEMS = [
  'BREAKING: New Cultural Centre Approved in Etobicoke',
  'Youth Scholarship Applications Open until Nov 30',
  'Community Business Awards Nominations Now Open',
];

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
      logSanityFallback('featuredStory', error);
    }
  } else {
    logSanityFallback('featuredStory', 'client unavailable');
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
      logSanityFallback('recentStories', error);
    }
  } else {
    logSanityFallback('recentStories', 'client unavailable');
  }

  // Fallback to static data
  return RECENT_STORIES;
}

// Fetch sidebar articles (Community Pulse section)
export async function fetchSidebarStories(): Promise<Story[]> {
  const sanityClient = await getClientForFetch();

  if (sanityClient) {
    try {
      const articles: SanityArticle[] = await sanityClient.fetch(sidebarArticlesQuery);
      if (articles && articles.length > 0) {
        return mapSanityArticles(articles);
      }
    } catch (error) {
      console.error('Error fetching sidebar articles from Sanity:', error);
      logSanityFallback('sidebarStories', error);
    }
  } else {
    logSanityFallback('sidebarStories', 'client unavailable');
  }

  // Fallback to static data - use first 3 recent stories
  return RECENT_STORIES.slice(0, 3);
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
      logSanityFallback('allStories', error);
    }
  } else {
    logSanityFallback('allStories', 'client unavailable');
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
      logSanityFallback('storyBySlug', error);
    }
  } else {
    logSanityFallback('storyBySlug', `client unavailable for slug ${slug}`);
  }

  if (!sanityClient) {
    console.warn('[Sanity] Client not configured; falling back to static story data for slug:', slug);
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
      let articles: SanityArticle[] = [];

      if (category === 'community') {
        articles = await sanityClient.fetch(communitySectionQuery);
      } else {
        articles = await sanityClient.fetch(
          articlesByCategoryQuery,
          { category }
        );
      }

      if (articles && articles.length > 0) {
        return mapSanityArticles(articles);
      }
    } catch (error) {
      console.error('Error fetching articles by category from Sanity:', error);
      logSanityFallback('storiesByCategory', error);
    }
  } else {
    logSanityFallback('storiesByCategory', `client unavailable for ${category}`);
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
      logSanityFallback('categoryBySlug', error);
    }
  } else {
    logSanityFallback('categoryBySlug', `client unavailable for ${slug}`);
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
      logSanityFallback('events', error);
    }
  } else {
    logSanityFallback('events', 'client unavailable');
  }

  // Fallback to static data
  return EVENTS;
}

// Fetch featured multimedia for homepage multimedia section
export async function fetchFeaturedMultimedia(): Promise<MultimediaStory | null> {
  const sanityClient = await getClientForFetch();

  if (sanityClient) {
    try {
      const article: SanityArticle | null = await sanityClient.fetch(featuredMultimediaQuery);
      if (article) {
        return mapSanityMultimedia(article);
      }
    } catch (error) {
      console.error('Error fetching featured multimedia from Sanity:', error);
      logSanityFallback('featuredMultimedia', error);
    }
  } else {
    logSanityFallback('featuredMultimedia', 'client unavailable');
  }

  // No fallback - return null if no featured multimedia exists
  return null;
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
      logSanityFallback('articleSlugs', error);
    }
  } else {
    logSanityFallback('articleSlugs', 'client unavailable');
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
      logSanityFallback('categorySlugs', error);
    }
  } else {
    logSanityFallback('categorySlugs', 'client unavailable');
  }

  // Fallback to static categories
  return ['community-voices', 'youth', 'business', 'multimedia'];
}

// Fetch ticker items from site settings
export async function fetchTickerItems(): Promise<{ items: string[]; isActive: boolean }> {
  const sanityClient = await getClientForFetch();

  if (sanityClient) {
    try {
      const settings = await sanityClient.fetch(siteSettingsQuery);
      if (settings) {
        const items = Array.isArray(settings.tickerItems)
          ? settings.tickerItems
            .map((item: { text?: string }) => item?.text)
            .filter(Boolean)
          : [];

        return {
          items: items.length ? items : DEFAULT_TICKER_ITEMS,
          isActive: settings.isTickerActive ?? true,
        };
      }
    } catch (error) {
      console.error('Error fetching ticker items from Sanity:', error);
      logSanityFallback('tickerItems', error);
    }
  } else {
    logSanityFallback('tickerItems', 'client unavailable');
  }

  return { items: DEFAULT_TICKER_ITEMS, isActive: true };
}
