import { ArticleForm } from '@/components/admin/article-form';
import { requireAdminOrEditor } from '@/lib/auth/permissions';
import { fetchAuthors, fetchCategories, fetchAdvertisements } from '@/lib/admin/actions';

export const dynamic = 'force-dynamic';

interface NewArticlePageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function NewArticlePage({ searchParams }: NewArticlePageProps) {
  await requireAdminOrEditor();
  const [authors, categories, advertisements] = await Promise.all([
    fetchAuthors(),
    fetchCategories(),
    fetchAdvertisements(),
  ]);
  const sponsorId = typeof searchParams.sponsorId === 'string' ? searchParams.sponsorId : undefined;

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-heavy mb-8">Create New Article</h1>
      <ArticleForm
        mode="create"
        authors={authors}
        categories={categories}
        advertisements={advertisements}
        initialSponsorId={sponsorId}
      />
    </div>
  );
}

