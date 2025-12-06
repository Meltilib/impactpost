import { ArticleForm } from '@/components/admin/article-form';

export const dynamic = 'force-dynamic';

export default function NewArticlePage() {
  return <ArticleForm mode="create" />;
}
