'use client';

import { Bookmark } from 'lucide-react';
import { useBookmarks } from '@/hooks/use-bookmarks';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

interface BookmarkButtonProps {
    slug: string;
    className?: string;
    size?: number;
}

export function BookmarkButton({ slug, className, size = 18 }: BookmarkButtonProps) {
    const { isBookmarked, toggleBookmark, isInitialized } = useBookmarks();
    const [active, setActive] = useState(false);

    useEffect(() => {
        setActive(isBookmarked(slug));
    }, [isBookmarked, slug]);

    if (!isInitialized) {
        return (
            <button
                className={cn(
                    "w-10 h-10 rounded-full bg-white border-2 border-black flex items-center justify-center shadow-hard-sm transition-all opacity-50 cursor-not-allowed",
                    className
                )}
                disabled
                aria-label="Loading bookmark status"
            >
                <Bookmark size={size} />
            </button>
        );
    }

    return (
        <button
            onClick={() => toggleBookmark(slug)}
            className={cn(
                "w-10 h-10 rounded-full bg-white border-2 border-black flex items-center justify-center shadow-hard-sm hover:translate-x-1 hover:shadow-none transition-all",
                active ? "bg-brand-yellow text-black" : "text-gray-700",
                className
            )}
            aria-label={active ? "Remove bookmark" : "Bookmark article"}
            title={active ? "Remove bookmark" : "Bookmark article"}
        >
            <Bookmark size={size} fill={active ? "currentColor" : "none"} />
        </button>
    );
}
