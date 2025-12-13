'use server';

import { writeClient } from '@/lib/sanity/write-client';
import { revalidatePath } from 'next/cache';
import { requireAdmin, requireAdminOrEditor } from '@/lib/auth/permissions';

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
  photoCredit?: string;
  mediaType?: 'image' | 'video';
  videoUrl?: string; // External URL
  videoFileAssetId?: string; // Sanity File ID
  videoThumbnailAssetId?: string;
}

export async function createArticle(data: ArticleFormData) {
  await requireAdminOrEditor();
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
      photoCredit: data.photoCredit || 'Impact Post',
      body: data.body,
      placement: data.placement,
      displayOrder: data.displayOrder,
      tags: data.tags,
      publishedAt: data.isDraft ? undefined : (data.publishedAt || new Date().toISOString()),
      isFeatured: data.placement === 'featured-hero',
      mediaType: data.mediaType || 'image',
      videoUrl: data.videoUrl, // External
      videoFile: data.videoFileAssetId ? { // Internal
        asset: { _type: 'reference', _ref: data.videoFileAssetId },
      } : undefined,
      videoThumbnail: data.videoThumbnailAssetId ? {
        _type: 'image',
        asset: { _type: 'reference', _ref: data.videoThumbnailAssetId },
      } : undefined,
    };

    const result = await writeClient.create(doc);

    revalidatePath('/admin');
    revalidatePath('/');
    revalidatePath('/news');
    revalidatePath('/section');

    return { success: true, id: result._id };
  } catch (error) {
    console.error('Error creating article:', error);
    return { success: false, error: 'Failed to create article' };
  }
}

export async function updateArticle(id: string, data: Partial<ArticleFormData>) {
  await requireAdminOrEditor();
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
    if (data.photoCredit !== undefined) updates.photoCredit = data.photoCredit || 'Impact Post';
    if (data.body) updates.body = data.body;
    if (data.placement) {
      updates.placement = data.placement;
      updates.isFeatured = data.placement === 'featured-hero';
    }
    if (data.displayOrder !== undefined) updates.displayOrder = data.displayOrder;
    if (data.tags) updates.tags = data.tags;
    if (data.publishedAt) updates.publishedAt = data.publishedAt;
    if (data.mediaType) updates.mediaType = data.mediaType;
    if (data.videoUrl !== undefined) updates.videoUrl = data.videoUrl;
    if (data.videoFileAssetId) {
      updates.videoFile = {
        asset: { _type: 'reference', _ref: data.videoFileAssetId },
      };
    }
    if (data.videoThumbnailAssetId) {
      updates.videoThumbnail = {
        _type: 'image',
        asset: { _type: 'reference', _ref: data.videoThumbnailAssetId },
      };
    }

    await writeClient.patch(id).set(updates).commit();

    // Revalidate all relevant paths
    revalidatePath('/admin');
    revalidatePath('/');
    revalidatePath('/news');
    revalidatePath('/section');
    // Revalidate specific article page if slug is provided
    if (data.slug) {
      revalidatePath(`/news/${data.slug}`);
    }
    // Force revalidate category pages
    revalidatePath('/section/[category]', 'page');

    return { success: true };
  } catch (error) {
    console.error('Error updating article:', error);
    return { success: false, error: 'Failed to update article' };
  }
}

export async function deleteArticle(id: string) {
  await requireAdminOrEditor();
  try {
    await writeClient.delete(id);

    revalidatePath('/admin');
    revalidatePath('/');
    revalidatePath('/news');
    revalidatePath('/section');

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
        role,
        bio,
        "slug": slug.current,
        image {
          asset->{
            _id,
            url
          }
        }
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
        "slug": slug.current,
        description,
        color,
        textColor
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
        photoCredit,
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

// ------- Authors -------
export interface AuthorPayload {
  name: string;
  role?: string;
  slug: string;
  bio?: string;
  imageAssetId?: string | null;
}

export async function fetchAuthorById(id: string) {
  try {
    const author = await writeClient.fetch(`
      *[_type == "author" && _id == $id][0]{
        _id,
        name,
        role,
        bio,
        "slug": slug.current,
        image {
          asset->{
            _id,
            url
          }
        }
      }
    `, { id });
    return author;
  } catch (error) {
    console.error('Error fetching author:', error);
    return null;
  }
}

export async function createAuthor(payload: AuthorPayload) {
  await requireAdmin();
  try {
    const existing = await writeClient.fetch(
      'count(*[_type == "author" && slug.current == $slug])',
      { slug: payload.slug }
    );
    if (existing > 0) {
      return { success: false, error: 'Slug already in use' };
    }

    const doc: Record<string, unknown> & { _type: string } = {
      _type: 'author',
      name: payload.name,
      slug: { _type: 'slug', current: payload.slug },
      role: payload.role,
      bio: payload.bio,
    };

    if (payload.imageAssetId) {
      doc.image = {
        _type: 'image',
        asset: { _type: 'reference', _ref: payload.imageAssetId },
      };
    }

    await writeClient.create(doc);

    revalidatePath('/admin/authors');
    revalidatePath('/admin');
    revalidatePath('/admin/new');
    revalidatePath('/admin/edit');
    revalidatePath('/');
    revalidatePath('/news');

    return { success: true };
  } catch (error) {
    console.error('Error creating author:', error);
    return { success: false, error: 'Failed to create author' };
  }
}

export async function updateAuthor(id: string, payload: Partial<AuthorPayload>) {
  await requireAdmin();
  try {
    if (payload.slug) {
      const existing = await writeClient.fetch(
        'count(*[_type == "author" && slug.current == $slug && _id != $id])',
        { slug: payload.slug, id }
      );
      if (existing > 0) {
        return { success: false, error: 'Slug already in use' };
      }
    }

    const updates: Record<string, unknown> = {};
    if (payload.name !== undefined) updates.name = payload.name;
    if (payload.role !== undefined) updates.role = payload.role;
    if (payload.bio !== undefined) updates.bio = payload.bio;
    if (payload.slug !== undefined) updates.slug = { _type: 'slug', current: payload.slug };
    if (payload.imageAssetId !== undefined) {
      updates.image = payload.imageAssetId
        ? {
          _type: 'image',
          asset: { _type: 'reference', _ref: payload.imageAssetId },
        }
        : null;
    }

    await writeClient.patch(id).set(updates).commit();

    revalidatePath('/admin/authors');
    revalidatePath('/admin');
    revalidatePath('/admin/new');
    revalidatePath('/admin/edit');
    revalidatePath('/');
    revalidatePath('/news');

    return { success: true };
  } catch (error) {
    console.error('Error updating author:', error);
    return { success: false, error: 'Failed to update author' };
  }
}

export async function deleteAuthor(id: string) {
  await requireAdmin();
  try {
    const references = await writeClient.fetch(
      'count(*[_type == "article" && references($id)])',
      { id }
    );
    if (references > 0) {
      return { success: false, error: 'Cannot delete: author is used by articles' };
    }

    await writeClient.delete(id);

    revalidatePath('/admin/authors');
    revalidatePath('/admin');
    revalidatePath('/admin/new');
    revalidatePath('/admin/edit');
    revalidatePath('/');
    revalidatePath('/news');

    return { success: true };
  } catch (error) {
    console.error('Error deleting author:', error);
    return { success: false, error: 'Failed to delete author' };
  }
}

export async function reassignAndDeleteAuthor(sourceId: string, targetId: string) {
  await requireAdmin();
  if (sourceId === targetId) {
    return { success: false, error: 'Select different authors to reassign.' };
  }

  try {
    const articles = await writeClient.fetch<{ _id: string }[]>(
      '*[_type == "article" && references($sourceId)]{_id}',
      { sourceId }
    );

    const transaction = writeClient.transaction();
    articles.forEach((article) => {
      transaction.patch(article._id, {
        set: {
          author: {
            _type: 'reference',
            _ref: targetId,
          },
        },
      });
    });

    transaction.delete(sourceId);
    await transaction.commit();

    revalidatePath('/admin/authors');
    revalidatePath('/admin');
    revalidatePath('/admin/new');
    revalidatePath('/admin/edit');
    revalidatePath('/');
    revalidatePath('/news');

    return { success: true, reassigned: articles.length };
  } catch (error) {
    console.error('Error reassigning and deleting author:', error);
    return { success: false, error: 'Failed to reassign author' };
  }
}

// ------- Categories -------
export interface CategoryPayload {
  title: string;
  slug: string;
  description?: string;
  color?: string;
  textColor?: string;
}

export async function fetchCategoryById(id: string) {
  try {
    const category = await writeClient.fetch(`
      *[_type == "category" && _id == $id][0]{
        _id,
        title,
        description,
        color,
        textColor,
        "slug": slug.current
      }
    `, { id });
    return category;
  } catch (error) {
    console.error('Error fetching category:', error);
    return null;
  }
}

export async function createCategory(payload: CategoryPayload) {
  await requireAdmin();
  try {
    const existing = await writeClient.fetch(
      'count(*[_type == "category" && slug.current == $slug])',
      { slug: payload.slug }
    );
    if (existing > 0) {
      return { success: false, error: 'Slug already in use' };
    }

    await writeClient.create({
      _type: 'category',
      title: payload.title,
      slug: { _type: 'slug', current: payload.slug },
      description: payload.description,
      color: payload.color,
      textColor: payload.textColor,
    });

    revalidatePath('/admin/categories');
    revalidatePath('/admin');
    revalidatePath('/admin/new');
    revalidatePath('/admin/edit');
    revalidatePath('/');
    revalidatePath('/news');
    revalidatePath('/section');

    return { success: true };
  } catch (error) {
    console.error('Error creating category:', error);
    return { success: false, error: 'Failed to create category' };
  }
}

export async function updateCategory(id: string, payload: Partial<CategoryPayload>) {
  await requireAdmin();
  try {
    if (payload.slug) {
      const existing = await writeClient.fetch(
        'count(*[_type == "category" && slug.current == $slug && _id != $id])',
        { slug: payload.slug, id }
      );
      if (existing > 0) {
        return { success: false, error: 'Slug already in use' };
      }
    }

    const updates: Record<string, unknown> = {};
    if (payload.title !== undefined) updates.title = payload.title;
    if (payload.slug !== undefined) updates.slug = { _type: 'slug', current: payload.slug };
    if (payload.description !== undefined) updates.description = payload.description;
    if (payload.color !== undefined) updates.color = payload.color;
    if (payload.textColor !== undefined) updates.textColor = payload.textColor;

    await writeClient.patch(id).set(updates).commit();

    revalidatePath('/admin/categories');
    revalidatePath('/admin');
    revalidatePath('/admin/new');
    revalidatePath('/admin/edit');
    revalidatePath('/');
    revalidatePath('/news');
    revalidatePath('/section');

    return { success: true };
  } catch (error) {
    console.error('Error updating category:', error);
    return { success: false, error: 'Failed to update category' };
  }
}

export async function deleteCategory(id: string) {
  await requireAdmin();
  try {
    const references = await writeClient.fetch(
      'count(*[_type == "article" && references($id)])',
      { id }
    );
    if (references > 0) {
      return { success: false, error: 'Cannot delete: category is used by articles' };
    }

    await writeClient.delete(id);

    revalidatePath('/admin/categories');
    revalidatePath('/admin');
    revalidatePath('/admin/new');
    revalidatePath('/admin/edit');
    revalidatePath('/');
    revalidatePath('/news');
    revalidatePath('/section');

    return { success: true };
  } catch (error) {
    console.error('Error deleting category:', error);
    return { success: false, error: 'Failed to delete category' };
  }
}

// ------- Ticker -------
export interface TickerPayload {
  items: string[];
  isActive: boolean;
}

export async function fetchTickerSettings() {
  try {
    const settings = await writeClient.fetch(`
      *[_type == "siteSettings"][0]{
        _id,
        isTickerActive,
        tickerItems
      }
    `);
    return settings;
  } catch (error) {
    console.error('Error fetching site settings:', error);
    return null;
  }
}

export async function updateTickerSettings(payload: TickerPayload) {
  await requireAdmin();
  try {
    await writeClient.createOrReplace({
      _id: 'siteSettings',
      _type: 'siteSettings',
      isTickerActive: payload.isActive,
      tickerItems: payload.items.map((text) => ({ text })),
    });

    revalidatePath('/');
    revalidatePath('/news');
    revalidatePath('/admin');

    return { success: true };
  } catch (error) {
    console.error('Error updating ticker:', error);
    return { success: false, error: 'Failed to update ticker' };
  }
}
