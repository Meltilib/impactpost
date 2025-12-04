import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArticleCard } from '@/components/articles/article-card';
import { Button } from '@/components/ui/button';
import { getStoriesByCategory } from '@/lib/data';
import { SECTIONS } from '@/lib/constants';
import Link from 'next/link';

interface SectionPageProps {
  params: Promise<{ category: string }>;
}

export async function generateStaticParams() {
  return Object.keys(SECTIONS).map((category) => ({
    category,
  }));
}

export async function generateMetadata({ params }: SectionPageProps): Promise<Metadata> {
  const { category } = await params;
  const section = SECTIONS[category];

  if (!section) {
    return {
      title: 'Section Not Found',
    };
  }

  return {
    title: section.title,
    description: section.description,
    openGraph: {
      title: `${section.title} | IMPACT POST`,
      description: section.description,
    },
  };
}

export default async function SectionPage({ params }: SectionPageProps) {
  const { category } = await params;
  const section = SECTIONS[category];

  if (!section) {
    notFound();
  }

  const stories = getStoriesByCategory(category);

  return (
    <div className="animate-in">
      {/* Header */}
      <header className={`${section.color} text-white border-b-2 border-black py-16`}>
        <div className="container mx-auto px-4">
          <h1 className="font-heavy text-5xl md:text-7xl mb-4 uppercase">{section.title}</h1>
          <p className="text-xl md:text-2xl font-display opacity-90 max-w-2xl">
            {section.description}
          </p>
        </div>
      </header>

      {/* Content Grid */}
      <section className="container mx-auto px-4 py-16">
        {stories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {stories.map(story => (
              <ArticleCard key={story.id} story={story} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <h3 className="font-bold text-2xl mb-4">No stories found in this section yet.</h3>
            <p className="text-gray-600 mb-8">We are constantly working on new content.</p>
            <Link href="/">
              <Button>Back to Home</Button>
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
