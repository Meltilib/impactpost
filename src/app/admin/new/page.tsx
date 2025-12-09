import { ArticleForm } from '@/components/admin/article-form';
import { requireAdminOrEditor } from '@/lib/auth/permissions';
import { fetchAuthors, fetchCategories } from '@/lib/admin/actions';

export const dynamic = 'force-dynamic';

export default async function NewArticlePage() {
  await requireAdminOrEditor();
  const [authors, categories] = await Promise.all([
    fetchAuthors(),
    fetchCategories(),
  ]);

  return (
    <ArticleForm
      mode="create"
      authors={authors}
      categories={categories}
    />
  );
}
