import { fetchAuthors, fetchArticlesForAdmin } from '@/lib/admin/actions';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { AuthorsManager } from '@/components/admin/authors-manager';

interface AdminArticle {
  author?: { _id: string; name: string };
}

export const dynamic = 'force-dynamic';

export default async function AuthorsPage() {
  const [authors, articles] = await Promise.all([
    fetchAuthors(),
    fetchArticlesForAdmin(),
  ]);

  // Count articles per author
  const articleCounts = (articles as AdminArticle[]).reduce((acc: Record<string, number>, article: AdminArticle) => {
    const authorId = article.author?._id;
    if (authorId) {
      acc[authorId] = (acc[authorId] || 0) + 1;
    }
    return acc;
  }, {});

  return (
    <div className="p-8">
      <div className="flex items-center gap-2 mb-8">
        <Link href="/admin" className="text-gray-600 hover:text-black">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="font-heavy text-3xl">Authors</h1>
          <p className="text-gray-600">Manage article authors</p>
        </div>
      </div>

      <AuthorsManager authors={authors} articleCounts={articleCounts} />
    </div>
  );
}
