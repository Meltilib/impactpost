import { notFound } from 'next/navigation';
import { ArticleForm } from '@/components/admin/article-form';
import { fetchArticleById, fetchAuthors, fetchCategories } from '@/lib/admin/actions';
import { requireAdminOrEditor } from '@/lib/auth/permissions';

export const dynamic = 'force-dynamic';

interface EditArticlePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditArticlePage({ params }: EditArticlePageProps) {
  const { id } = await params;
  await requireAdminOrEditor();
  const [article, authors, categories] = await Promise.all([
    fetchArticleById(id),
    fetchAuthors(),
    fetchCategories(),
  ]);

  if (!article) {
    notFound();
  }

  return (
    <ArticleForm
      mode="edit"
      authors={authors}
      categories={categories}
      initialData={{
        _id: article._id,
        title: article.title,
        slug: article.slug,
        excerpt: article.excerpt,
        body: article.body,
        categoryId: article.category?._id,
        authorId: article.author?._id,
        imageAssetId: article.mainImage?.asset?._id,
        imageUrl: article.mainImage?.asset?.url,
        placement: article.placement,
        displayOrder: article.displayOrder,
        tags: article.tags,
        publishedAt: article.publishedAt,
        photoCredit: article.photoCredit,
      }}
    />
  );
}
