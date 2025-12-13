import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Clock, Twitter, Facebook, Linkedin } from 'lucide-react';
import { fetchStoryBySlug, fetchRecentStories, fetchArticleSlugs } from '@/lib/sanity/fetch';
import { ArticleCard } from '@/components/articles/article-card';
import { BookmarkButton } from '@/components/articles/bookmark-button';
import { ArticleBody } from '@/components/portable-text';
import { Button } from '@/components/ui/button';
import { SITE_CONFIG } from '@/lib/constants';
import { getCategoryColor } from '@/lib/utils';
import {
  KEY_TAKEAWAYS_CARD,
  KEY_TAKEAWAYS_ITEM,
  KEY_TAKEAWAYS_TITLE,
  STYLED_QUOTE_TEXT,
  getStyledQuoteContainerClasses,
} from '@/lib/article-block-styles';
import type { PortableTextBlock } from '@portabletext/types';
import type { Story } from '@/types';

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

// Enable ISR
export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await fetchArticleSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const result = await fetchStoryBySlug(slug);
  const story = result?.story;

  if (!story) {
    return {
      title: 'Article Not Found',
    };
  }

  return {
    title: story.title,
    description: story.excerpt,
    authors: [{ name: story.author.name }],
    openGraph: {
      title: story.title,
      description: story.excerpt,
      type: 'article',
      publishedTime: story.date,
      authors: [story.author.name],
      images: [
        {
          url: story.imageUrl,
          width: 1200,
          height: 630,
          alt: story.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: story.title,
      description: story.excerpt,
      images: [story.imageUrl],
    },
  };
}

function ArticleJsonLd({ story }: { story: Story }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: story.title,
    description: story.excerpt,
    image: story.imageUrl,
    datePublished: story.date,
    dateModified: story.date,
    author: {
      '@type': 'Person',
      name: story.author.name,
      jobTitle: story.author.role,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_CONFIG.url}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_CONFIG.url}/news/${story.slug}`,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const [result, recentStories] = await Promise.all([
    fetchStoryBySlug(slug),
    fetchRecentStories(),
  ]);

  if (!result) {
    notFound();
  }

  const { story, body } = result;
  const relatedStories = recentStories.filter(s => s.id !== story.id).slice(0, 3);
  const hasPortableTextBody = body && Array.isArray(body) && body.length > 0;

  return (
    <>
      <ArticleJsonLd story={story} />

      <article className="animate-in">
        {/* Article Header */}
        <header className="bg-brand-light border-b-2 border-black pt-12 pb-8">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <span className={`px-3 py-1 font-bold text-sm uppercase tracking-widest shadow-hard-sm mb-6 inline-block ${getCategoryColor(story.category)}`}>
              {story.category}
            </span>
            <h1 className="font-heavy text-4xl md:text-6xl leading-tight mb-6 text-brand-dark">
              {story.title}
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 font-display font-medium leading-relaxed mb-8">
              {story.excerpt}
            </p>

            <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-sm text-gray-500 border-t border-b border-gray-300 py-4 max-w-2xl mx-auto">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-full border border-black overflow-hidden">
                  <Image
                    src={story.author.avatarUrl}
                    alt={story.author.name}
                    fill
                    className="object-cover"
                    sizes="40px"
                  />
                </div>
                <div className="text-left">
                  <span className="block font-bold text-black">{story.author.name}</span>
                  <span className="block text-xs uppercase tracking-wide">{story.author.role}</span>
                </div>
              </div>
              <div className="hidden md:block w-px h-8 bg-gray-300" />
              <div className="flex items-center gap-6">
                <time dateTime={story.date}>{story.date}</time>
                <span className="flex items-center gap-1">
                  <Clock size={16} /> {story.readTime}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <div className="container mx-auto px-4 py-12 max-w-6xl flex flex-col lg:flex-row gap-12">

          {/* Social Sidebar (Sticky) */}
          <aside className="lg:w-24 flex-shrink-0">
            <div className="sticky top-24 flex lg:flex-col gap-4 justify-center lg:justify-start">
              <a
                href={`https://twitter.com/intent/tweet?url=${SITE_CONFIG.url}/news/${story.slug}&text=${encodeURIComponent(story.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white border-2 border-black flex items-center justify-center shadow-hard-sm hover:translate-x-1 hover:shadow-none transition-all text-blue-400"
                aria-label="Share on Twitter"
              >
                <Twitter size={18} />
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${SITE_CONFIG.url}/news/${story.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white border-2 border-black flex items-center justify-center shadow-hard-sm hover:translate-x-1 hover:shadow-none transition-all text-blue-700"
                aria-label="Share on Facebook"
              >
                <Facebook size={18} />
              </a>
              <a
                href={`https://www.linkedin.com/shareArticle?mini=true&url=${SITE_CONFIG.url}/news/${story.slug}&title=${encodeURIComponent(story.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white border-2 border-black flex items-center justify-center shadow-hard-sm hover:translate-x-1 hover:shadow-none transition-all text-blue-600"
                aria-label="Share on LinkedIn"
              >
                <Linkedin size={18} />
              </a>
              <div className="w-full h-px bg-gray-300 my-2 hidden lg:block" />
              <BookmarkButton slug={story.slug} />
            </div>
          </aside>

          {/* Article Body */}
          <div className="flex-grow max-w-3xl">
            <figure className="mb-12 relative">
              <div className="relative w-full aspect-video border-2 border-black shadow-hard-lg overflow-hidden">
                <Image
                  src={story.imageUrl}
                  alt={story.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 800px"
                />
              </div>
              <figcaption className="text-sm text-gray-500 mt-3 italic text-right border-r-4 border-brand-yellow pr-3">
                Photo by {story.photoCredit || 'Impact Post'}
              </figcaption>
            </figure>

            {/* Article Content - Sanity Portable Text or Static Fallback */}
            {hasPortableTextBody ? (
              <ArticleBody content={body as PortableTextBlock[]} />
            ) : (
              <div className="prose prose-lg md:prose-xl">
                <p className="lead font-bold text-gray-800 text-xl first-letter:text-5xl first-letter:font-heavy first-letter:text-brand-purple first-letter:mr-2 first-letter:float-left">
                  Community resilience is not just a buzzword here; it&apos;s the foundation upon which this neighborhood was rebuilt. Walking down 4th street, you can feel the energy shift.
                </p>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                </p>
                <h3>A New Approach to Local Leadership</h3>
                <p>
                  Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam.
                </p>
                <div className={getStyledQuoteContainerClasses('coral')}>
                  <blockquote className={STYLED_QUOTE_TEXT}>
                    &ldquo;We aren&apos;t waiting for permission to change our reality. We are building the future we deserve, brick by brick.&rdquo;
                  </blockquote>
                </div>
                <p>
                  Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet.
                </p>
                <div className={KEY_TAKEAWAYS_CARD}>
                  <h4 className={KEY_TAKEAWAYS_TITLE}>Key Takeaways</h4>
                  <ul className="space-y-2">
                    <li className={KEY_TAKEAWAYS_ITEM}>
                      <span className="text-brand-teal">•</span> Local funding has increased by 40% since the initiative started.
                    </li>
                    <li className={KEY_TAKEAWAYS_ITEM}>
                      <span className="text-brand-teal">•</span> Youth engagement programs are now mandatory in 3 district schools.
                    </li>
                    <li className={KEY_TAKEAWAYS_ITEM}>
                      <span className="text-brand-teal">•</span> The community garden provides 500lbs of produce monthly.
                    </li>
                  </ul>
                </div>
                <p>
                  Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur.
                </p>
              </div>
            )}

            {/* Tags */}
            {story.tags && story.tags.length > 0 && (
              <div className="mt-12 pt-8 border-t-2 border-black flex flex-wrap gap-2">
                <span className="font-bold mr-2 my-auto">Tags:</span>
                {story.tags.map(tag => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-gray-100 border border-black rounded-full text-sm hover:bg-brand-yellow cursor-pointer transition-colors"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Author Box */}
            <div className="mt-12 p-8 bg-brand-light border-2 border-black shadow-hard flex flex-col md:flex-row gap-6 items-center md:items-start">
              <div className="relative w-20 h-20 rounded-full border-2 border-black overflow-hidden flex-shrink-0">
                <Image
                  src={story.author.avatarUrl}
                  alt={story.author.name}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </div>
              <div className="text-center md:text-left">
                <h3 className="font-bold text-xl mb-2">About {story.author.name}</h3>
                <p className="text-gray-600 mb-4">
                  {story.author.bio || `${story.author.role}. Contributing writer for Impact Post.`}
                </p>
                <Button size="sm" variant="outline">View all articles</Button>
              </div>
            </div>
          </div>
        </div>


        {/* Read Next Section */}
        <section className="bg-gray-100 py-16 border-t-2 border-black">
          <div className="container mx-auto px-4">
            <h2 className="font-heavy text-3xl mb-8">Read Next</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedStories.map(related => (
                <ArticleCard key={related.id} story={related} />
              ))}
            </div>
          </div>
        </section>
      </article >
    </>
  );
}
