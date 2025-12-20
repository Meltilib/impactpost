'use client';

import { useEffect, useState, useCallback } from 'react';
import { useBookmarks } from '@/hooks/use-bookmarks';
import { getBookmarkArticles } from '@/app/actions';
import { ArticleCard } from '@/components/articles/article-card';
import { Story } from '@/types';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Bookmark, Loader2, ArrowRight } from 'lucide-react';
import { BackButton } from '@/components/navigation/back-button';

export default function SavedPage() {
    const { bookmarks, isInitialized } = useBookmarks();
    const [articles, setArticles] = useState<Story[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchArticles = useCallback(async () => {
        if (!isInitialized || bookmarks.length === 0) {
            return;
        }

        setLoading(true);
        try {
            const data = await getBookmarkArticles(bookmarks);
            setArticles(data);
        } catch (err) {
            console.error('Failed to fetch saved articles', err);
        } finally {
            setLoading(false);
        }
    }, [bookmarks, isInitialized]);

    useEffect(() => {
        fetchArticles();
    }, [fetchArticles]);

    if (!isInitialized) {
        return (
            <div className="min-h-[50vh] flex items-center justify-center">
                <Loader2 className="animate-spin text-brand-purple" size={40} />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12 md:py-20">
            <div className="max-w-5xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <div className="flex items-center gap-4">
                        <span className="px-4 py-1.5 font-bold text-sm uppercase border-2 border-black bg-brand-yellow text-black shadow-hard-sm">
                            HOME
                        </span>
                        <BackButton />
                    </div>
                    <div>
                        <h1 className="text-4xl font-heavy italic">SAVED STORIES</h1>
                        <p className="text-gray-600 font-medium">Your personal reading list from Impact Post.</p>
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center h-64 gap-4">
                        <Loader2 className="animate-spin text-brand-teal" size={48} />
                        <p className="font-bold text-gray-500 animate-pulse">Loading your list...</p>
                    </div>
                ) : articles.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {articles.map((article) => (
                            <ArticleCard key={article.id} story={article} />
                        ))}
                    </div>
                ) : (
                    <div className="bg-gray-50 border-2 border-black p-12 text-center shadow-hard-md rounded-lg">
                        <div className="mx-auto w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-6">
                            <Bookmark size={32} className="text-gray-400" />
                        </div>
                        <h2 className="text-2xl font-bold mb-4">No stories saved yet</h2>
                        <p className="text-gray-600 max-w-md mx-auto mb-8">
                            Bookmark articles while you browse to read them later. Look for the bookmark icon on any story.
                        </p>
                        <Link href="/news">
                            <Button size="lg" className="gap-2">
                                Browse News <ArrowRight size={16} />
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
