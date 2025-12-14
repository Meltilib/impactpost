'use server';

import { fetchArticlesBySlugs } from '@/lib/sanity/fetch';

export async function getBookmarkArticles(slugs: string[]) {
    if (!slugs || slugs.length === 0) {
        return [];
    }

    return await fetchArticlesBySlugs(slugs);
}
