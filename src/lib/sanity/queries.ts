import { groq } from 'next-sanity';

// Fetch all articles with author and category
export const articlesQuery = groq`
  *[_type == "article" && defined(slug.current)] | order(publishedAt desc) {
    _id,
    title,
    subtitle,
    "slug": slug.current,
    excerpt,
    publishedAt,
    isFeatured,
    tags,
    mainImage {
      asset->{
        _id,
        url
      },
      alt
    },
    photoCredit,
    author->{
      _id,
      name,
      role,
      image {
        asset->{
          _id,
          url
        }
      }
    },
    category->{
      _id,
      title,
      "slug": slug.current,
      color,
      textColor
    }
  }
`;

// Fetch featured article (placement-based with fallback to isFeatured)
export const featuredArticleQuery = groq`
  *[_type == "article" && (placement == "featured-hero" || isFeatured == true) && defined(slug.current)] | order(displayOrder asc, publishedAt desc)[0] {
    _id,
    title,
    subtitle,
    "slug": slug.current,
    excerpt,
    publishedAt,
    isFeatured,
    placement,
    tags,
    mainImage {
      asset->{
        _id,
        url
      },
      alt
    },
    photoCredit,
    author->{
      _id,
      name,
      role,
      image {
        asset->{
          _id,
          url
        }
      }
    },
    category->{
      _id,
      title,
      "slug": slug.current,
      color,
      textColor
    }
  }
`;

// Fetch sidebar articles (Community Pulse section)
export const sidebarArticlesQuery = groq`
  *[_type == "article" && placement == "sidebar" && defined(slug.current)] | order(displayOrder asc, publishedAt desc)[0...3] {
    _id,
    title,
    subtitle,
    "slug": slug.current,
    excerpt,
    publishedAt,
    placement,
    tags,
    mainImage {
      asset->{
        _id,
        url
      },
      alt
    },
    photoCredit,
    author->{
      _id,
      name,
      role,
      image {
        asset->{
          _id,
          url
        }
      }
    },
    category->{
      _id,
      title,
      "slug": slug.current,
      color,
      textColor
    }
  }
`;

// Fetch recent articles (grid placement or no placement, excluding featured/sidebar/hidden)
export const recentArticlesQuery = groq`
  *[_type == "article" && (placement == "grid" || !defined(placement) || placement == null) && placement != "hidden" && isFeatured != true && defined(slug.current)] | order(publishedAt desc)[0...8] {
    _id,
    title,
    subtitle,
    "slug": slug.current,
    excerpt,
    publishedAt,
    isFeatured,
    placement,
    tags,
    mainImage {
      asset->{
        _id,
        url
      },
      alt
    },
    photoCredit,
    author->{
      _id,
      name,
      role,
      image {
        asset->{
          _id,
          url
        }
      }
    },
    category->{
      _id,
      title,
      "slug": slug.current,
      color,
      textColor
    }
  }
`;

// Fetch single article by slug
export const articleBySlugQuery = groq`
  *[_type == "article" && slug.current == $slug][0] {
    _id,
    title,
    subtitle,
    "slug": slug.current,
    body,
    excerpt,
    publishedAt,
    isFeatured,
    tags,
    mainImage {
      asset->{
        _id,
        url
      },
      alt
    },
    photoCredit,
    author->{
      _id,
      name,
      role,
      bio,
      image {
        asset->{
          _id,
          url
        }
      }
    },
    category->{
      _id,
      title,
      "slug": slug.current,
      color,
      textColor
    },
    seo {
      metaTitle,
      metaDescription,
      socialImage {
        asset->{
          url
        }
      }
    }
  }
`;

// Fetch articles by category slug
export const articlesByCategoryQuery = groq`
  *[_type == "article" && category->slug.current == $category && defined(slug.current)] | order(publishedAt desc) {
    _id,
    title,
    subtitle,
    "slug": slug.current,
    excerpt,
    publishedAt,
    isFeatured,
    tags,
    mainImage {
      asset->{
        _id,
        url
      },
      alt
    },
    photoCredit,
    author->{
      _id,
      name,
      role,
      image {
        asset->{
          _id,
          url
        }
      }
    },
    category->{
      _id,
      title,
      "slug": slug.current,
      color,
      textColor
    }
  }
`;

// Fetch articles for Community section (aggregating Culture/Community Voices)
export const communitySectionQuery = groq`
  *[_type == "article" && category->slug.current in ["community", "community-voices", "voices"] && defined(slug.current)] | order(publishedAt desc) {
    _id,
    title,
    subtitle,
    "slug": slug.current,
    excerpt,
    publishedAt,
    isFeatured,
    tags,
    mainImage {
      asset->{
        _id,
        url
      },
      alt
    },
    photoCredit,
    author->{
      _id,
      name,
      role,
      image {
        asset->{
          _id,
          url
        }
      }
    },
    category->{
      _id,
      title,
      "slug": slug.current,
      color,
      textColor
    }
  }
`;

// Fetch all categories
export const categoriesQuery = groq`
  *[_type == "category"] | order(title asc) {
    _id,
    title,
    "slug": slug.current,
    description,
    color,
    textColor
  }
`;

// Fetch category by slug
export const categoryBySlugQuery = groq`
  *[_type == "category" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    description,
    color,
    textColor
  }
`;

// Fetch upcoming events
export const eventsQuery = groq`
  *[_type == "event" && eventDate > now()] | order(eventDate asc) {
    _id,
    title,
    "slug": slug.current,
    eventDate,
    location,
    type,
    description,
    registrationUrl,
    image {
      asset->{
        _id,
        url
      }
    }
  }
`;

// Fetch all events (including past)
export const allEventsQuery = groq`
  *[_type == "event"] | order(eventDate desc) {
    _id,
    title,
    "slug": slug.current,
    eventDate,
    location,
    type,
    description,
    registrationUrl,
    image {
      asset->{
        _id,
        url
      }
    }
  }
`;

// Fetch single event by slug
export const eventBySlugQuery = groq`
  *[_type == "event" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    eventDate,
    location,
    type,
    description,
    registrationUrl,
    image {
      asset->{
        _id,
        url
      }
    }
  }
`;

// Fetch all article slugs (for generateStaticParams)
export const articleSlugsQuery = groq`
  *[_type == "article" && defined(slug.current)][].slug.current
`;

// Fetch all category slugs (for generateStaticParams)
export const categorySlugsQuery = groq`
  *[_type == "category" && defined(slug.current)][].slug.current
`;

// Fetch featured multimedia article
export const featuredMultimediaQuery = groq`
  *[_type == "article" && placement == "featured-multimedia" && defined(slug.current)] | order(displayOrder asc, publishedAt desc)[0] {
    _id,
    title,
    "slug": slug.current,
    mediaType,
    mainImage {
      asset->{
        _id,
        url
      },
      alt
    },
    videoFile {
      asset->{
        _id,
        url
      }
    },
    videoUrl,
    videoThumbnail {
      asset->{
        _id,
        url
      },
      alt
    },
    category->{
      _id,
      title,
      "slug": slug.current
    }
  }
`;

// Fetch site settings (ticker)
export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0]{
    _id,
    isTickerActive,
    tickerItems
  }
`;
