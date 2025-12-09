import { fetchCategories, fetchArticlesForAdmin } from '@/lib/admin/actions';
import { requireAdmin } from '@/lib/auth/permissions';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { CategoriesManager } from '@/components/admin/categories-manager';

interface AdminArticle {
  category?: { _id: string; title: string };
}

export const dynamic = 'force-dynamic';

export default async function CategoriesPage() {
  await requireAdmin();

  const [categories, articles] = await Promise.all([
    fetchCategories(),
    fetchArticlesForAdmin(),
  ]);

  // Count articles per category
  const articleCounts = (articles as AdminArticle[]).reduce((acc: Record<string, number>, article: AdminArticle) => {
    const categoryId = article.category?._id;
    if (categoryId) {
      acc[categoryId] = (acc[categoryId] || 0) + 1;
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
          <h1 className="font-heavy text-3xl">Categories</h1>
          <p className="text-gray-600">Manage article categories</p>
        </div>
      </div>

      <CategoriesManager categories={categories} articleCounts={articleCounts} />
    </div>
  );
}
