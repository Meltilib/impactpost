import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'impact_post_bookmarks';
const EVENT_KEY = 'impact_post_bookmarks_updated';

function getStoredBookmarks(): string[] {
    if (typeof window === 'undefined') return [];
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (e) {
        console.error('Failed to parse bookmarks', e);
        return [];
    }
}

export function useBookmarks() {
    const [bookmarks, setBookmarks] = useState<string[]>(() => getStoredBookmarks());
    const isInitialized = true;

    // Listen for changes from other components/tabs
    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === STORAGE_KEY) {
                setBookmarks(getStoredBookmarks());
            }
        };

        const handleCustomEvent = () => {
            setBookmarks(getStoredBookmarks());
        };

        window?.addEventListener('storage', handleStorageChange);
        window?.addEventListener(EVENT_KEY, handleCustomEvent);

        return () => {
            window?.removeEventListener('storage', handleStorageChange);
            window?.removeEventListener(EVENT_KEY, handleCustomEvent);
        };
    }, []);

    const toggleBookmark = useCallback((slug: string) => {
        const current = getStoredBookmarks();
        const newBookmarks = current.includes(slug)
            ? current.filter((s) => s !== slug)
            : [...current, slug];

        localStorage.setItem(STORAGE_KEY, JSON.stringify(newBookmarks));

        // Dispatch event for other components in same window
        window.dispatchEvent(new Event(EVENT_KEY));

        setBookmarks(newBookmarks);
    }, []);

    const isBookmarked = useCallback((slug: string) => bookmarks.includes(slug), [bookmarks]);

    return {
        bookmarks,
        isBookmarked,
        toggleBookmark,
        isInitialized,
    };
}
