import { Metadata } from 'next';
import { ArticleCard } from '@/components/articles/article-card';
import { fetchAllStories } from '@/lib/sanity/fetch';

export const metadata: Metadata = {
  title: 'Latest News',
  description: 'Breaking news and updates from across the diaspora. Community-focused journalism covering equity, culture, and leadership.',
  openGraph: {
    title: 'Latest News | IMPACT POST',
    description: 'Breaking news and updates from across the diaspora.',
  },
};

// Enable ISR - revalidate every 60 seconds
export const revalidate = 60;

export default async function NewsPage() {
  const stories = await fetchAllStories();

  return (
    <div className="animate-in">
      {/* Header */}
      <header className="bg-brand-blue text-white border-b-2 border-black py-16">
        <div className="container mx-auto px-4">
          <h1 className="font-heavy text-5xl md:text-7xl mb-4 uppercase">Latest News</h1>
          <p className="text-xl md:text-2xl font-display opacity-90 max-w-2xl">
            Breaking news and updates from across the diaspora.
          </p>
        </div>
      </header>

      {/* Content Grid */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stories.map(story => (
            <ArticleCard key={story.id} story={story} />
          ))}
        </div>
      </section>
    </div>
  );
}
