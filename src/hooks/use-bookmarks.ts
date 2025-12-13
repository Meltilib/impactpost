import { useState } from 'react';

const STORAGE_KEY = 'impact_post_bookmarks';

function initializeBookmarks() {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        try {
            return JSON.parse(stored);
        } catch (e) {
            console.error('Failed to parse bookmarks', e);
        }
    }
    return [];
}

export function useBookmarks() {
    const [bookmarks, setBookmarks] = useState<string[]>(initializeBookmarks);
    const [isInitialized] = useState(true);

    const toggleBookmark = (slug: string) => {
        setBookmarks((prev) => {
            const newBookmarks = prev.includes(slug)
                ? prev.filter((s) => s !== slug)
                : [...prev, slug];

            localStorage.setItem(STORAGE_KEY, JSON.stringify(newBookmarks));
            return newBookmarks;
        });
    };

    const isBookmarked = (slug: string) => bookmarks.includes(slug);

    return {
        bookmarks,
        isBookmarked,
        toggleBookmark,
        isInitialized,
    };
}
