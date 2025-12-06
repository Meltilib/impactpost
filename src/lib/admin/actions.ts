'use server';

import { writeClient } from '@/lib/sanity/write-client';
import { revalidatePath } from 'next/cache';

export interface ArticleFormData {
  title: string;
  slug: string;
  excerpt: string;
  categoryId: string;
  authorId: string;
  imageAssetId?: string;
  body: unknown[];
  placement: string;
  displayOrder: number;
  tags: string[];
  publishedAt?: string;
  isDraft?: boolean;
}

export async function createArticle(data: ArticleFormData) {
  try {
    const doc = {
      _type: 'article',
      title: data.title,
      slug: { _type: 'slug', current: data.slug },
      excerpt: data.excerpt,
      category: { _type: 'reference', _ref: data.categoryId },
      author: { _type: 'reference', _ref: data.authorId },
      mainImage: data.imageAssetId ? {
        _type: 'image',
        asset: { _type: 'reference', _ref: data.imageAssetId },
      } : undefined,
      body: data.body,
      placement: data.placement,
      displayOrder: data.displayOrder,
      tags: data.tags,
      publishedAt: data.isDraft ? undefined : (data.publishedAt || new Date().toISOString()),
      isFeatured: data.placement === 'featured-hero',
    };

    const result = await writeClient.create(doc);
    
    revalidatePath('/admin');
    revalidatePath('/');
    revalidatePath('/news');
    
    return { success: true, id: result._id };
  } catch (error) {
    console.error('Error creating article:', error);
    return { success: false, error: 'Failed to create article' };
  }
}

export async function updateArticle(id: string, data: Partial<ArticleFormData>) {
  try {
    const updates: Record<string, unknown> = {};
    
    if (data.title) updates.title = data.title;
    if (data.slug) updates.slug = { _type: 'slug', current: data.slug };
    if (data.excerpt) updates.excerpt = data.excerpt;
    if (data.categoryId) updates.category = { _type: 'reference', _ref: data.categoryId };
    if (data.authorId) updates.author = { _type: 'reference', _ref: data.authorId };
    if (data.imageAssetId) {
      updates.mainImage = {
        _type: 'image',
        asset: { _type: 'reference', _ref: data.imageAssetId },
      };
    }
    if (data.body) updates.body = data.body;
    if (data.placement) {
      updates.placement = data.placement;
      updates.isFeatured = data.placement === 'featured-hero';
    }
    if (data.displayOrder !== undefined) updates.displayOrder = data.displayOrder;
    if (data.tags) updates.tags = data.tags;
    if (data.publishedAt) updates.publishedAt = data.publishedAt;

    await writeClient.patch(id).set(updates).commit();
    
    revalidatePath('/admin');
    revalidatePath('/');
    revalidatePath('/news');
    
    return { success: true };
  } catch (error) {
    console.error('Error updating article:', error);
    return { success: false, error: 'Failed to update article' };
  }
}

export async function deleteArticle(id: string) {
  try {
    await writeClient.delete(id);
    
    revalidatePath('/admin');
    revalidatePath('/');
    revalidatePath('/news');
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting article:', error);
    return { success: false, error: 'Failed to delete article' };
  }
}

export async function fetchAuthors() {
  try {
    const authors = await writeClient.fetch(`
      *[_type == "author"] | order(name asc) {
        _id,
        name,
        role
      }
    `);
    return authors;
  } catch (error) {
    console.error('Error fetching authors:', error);
    return [];
  }
}

export async function fetchCategories() {
  try {
    const categories = await writeClient.fetch(`
      *[_type == "category"] | order(title asc) {
        _id,
        title,
        "slug": slug.current
      }
    `);
    return categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export async function fetchArticlesForAdmin() {
  try {
    const articles = await writeClient.fetch(`
      *[_type == "article"] | order(publishedAt desc) {
        _id,
        title,
        "slug": slug.current,
        excerpt,
        publishedAt,
        placement,
        author->{
          _id,
          name
        },
        category->{
          _id,
          title
        }
      }
    `);
    return articles;
  } catch (error) {
    console.error('Error fetching articles:', error);
    return [];
  }
}

export async function fetchArticleById(id: string) {
  try {
    const article = await writeClient.fetch(`
      *[_type == "article" && _id == $id][0] {
        _id,
        title,
        "slug": slug.current,
        excerpt,
        body,
        publishedAt,
        placement,
        displayOrder,
        tags,
        mainImage {
          asset->{
            _id,
            url
          }
        },
        author->{
          _id,
          name
        },
        category->{
          _id,
          title
        }
      }
    `, { id });
    return article;
  } catch (error) {
    console.error('Error fetching article:', error);
    return null;
  }
}
