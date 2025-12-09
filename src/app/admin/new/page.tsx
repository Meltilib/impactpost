import { ArticleForm } from '@/components/admin/article-form';
import { requireAdminOrEditor } from '@/lib/auth/permissions';

export const dynamic = 'force-dynamic';

export default async function NewArticlePage() {
  await requireAdminOrEditor();
  return <ArticleForm mode="create" />;
}
