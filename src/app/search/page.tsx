import { fetchArticlesByQuery } from '@/lib/sanity/fetch';
import { ArticleCard } from '@/components/articles/article-card';

export default async function SearchPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string }>;
}) {
    const { q: query } = await searchParams;
    const articles = query ? await fetchArticlesByQuery(query) : [];

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto">
                <header className="mb-12 border-b-4 border-black pb-8">
                    <h1 className="text-5xl md:text-7xl font-heavy italic tracking-tighter text-black mb-4">
                        SEARCH <span className="text-brand-coral">RESULTS</span>
                    </h1>
                    {query ? (
                        <p className="text-xl font-bold text-gray-600">
                            Found {articles.length} {articles.length === 1 ? 'article' : 'articles'} for <span className="text-brand-purple">&quot;{query}&quot;</span>
                        </p>
                    ) : (
                        <p className="text-xl font-bold text-gray-600">Please enter a search term.</p>
                    )}
                </header>

                {articles.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {articles.map((article) => (
                            <ArticleCard key={article.id} story={article} />
                        ))}
                    </div>
                ) : query ? (
                    <div className="bg-gray-100 border-2 border-dashed border-gray-300 p-12 text-center rounded-lg">
                        <h2 className="text-2xl font-bold text-gray-400 mb-2">No results found</h2>
                        <p className="text-gray-500">Try searching for different keywords or check your spelling.</p>
                    </div>
                ) : null}
            </div>
        </div>
    );
}
