import { notFound } from 'next/navigation';
import { ArticleForm } from '@/components/admin/article-form';
import { fetchArticleById, fetchAuthors, fetchCategories, fetchAdvertisements } from '@/lib/admin/actions';
import { requireAdminOrEditor } from '@/lib/auth/permissions';

export const dynamic = 'force-dynamic';

interface EditArticlePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditArticlePage({ params }: EditArticlePageProps) {
  const { id } = await params;
  await requireAdminOrEditor();
  const [article, authors, categories, advertisements] = await Promise.all([
    fetchArticleById(id),
    fetchAuthors(),
    fetchCategories(),
    fetchAdvertisements(),
  ]);

  if (!article) {
    notFound();
  }

  const initialData = {
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
    videoThumbnailUrl: article.videoThumbnail?.asset?.url,
    isSponsored: article.isSponsored,
    sponsorId: article.sponsor?._id,
  };

  return (
    <div>
      <div className="bg-brand-dark text-white p-8">
        <h1 className="font-heavy text-3xl">Edit Article</h1>
        <p className="text-white/70">Update content</p>
      </div>
      <ArticleForm mode="edit" authors={authors} categories={categories} advertisements={advertisements} initialData={initialData} />
    </div>
  );
}
