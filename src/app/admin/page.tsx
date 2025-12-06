import Link from 'next/link';
import { Plus, Edit, Eye } from 'lucide-react';
import { fetchArticlesForAdmin } from '@/lib/admin/actions';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const articles = await fetchArticlesForAdmin();

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="font-heavy text-3xl">Articles</h1>
          <p className="text-gray-600">Manage your content</p>
        </div>
        <Link
          href="/admin/new"
          className="flex items-center gap-2 bg-brand-purple text-white px-4 py-2 font-bold hover:bg-brand-purple/90 transition-colors border-2 border-black shadow-hard"
        >
          <Plus size={20} />
          New Article
        </Link>
      </div>

      {articles.length === 0 ? (
        <div className="bg-white border-2 border-black shadow-hard p-12 text-center">
          <p className="text-gray-600 mb-4">No articles yet</p>
          <Link
            href="/admin/new"
            className="inline-flex items-center gap-2 bg-brand-coral text-white px-6 py-3 font-bold hover:bg-brand-coral/90 transition-colors"
          >
            <Plus size={20} />
            Create your first article
          </Link>
        </div>
      ) : (
        <div className="bg-white border-2 border-black shadow-hard overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100 border-b-2 border-black">
              <tr>
                <th className="text-left p-4 font-bold">Title</th>
                <th className="text-left p-4 font-bold">Category</th>
                <th className="text-left p-4 font-bold">Author</th>
                <th className="text-left p-4 font-bold">Placement</th>
                <th className="text-left p-4 font-bold">Date</th>
                <th className="text-right p-4 font-bold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {articles.map((article: {
                _id: string;
                title: string;
                slug: string;
                category?: { title: string };
                author?: { name: string };
                placement?: string;
                publishedAt?: string;
              }) => (
                <tr key={article._id} className="hover:bg-gray-50">
                  <td className="p-4">
                    <div>
                      <p className="font-bold">{article.title}</p>
                      <p className="text-sm text-gray-500">/{article.slug}</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-1 bg-brand-light text-sm font-medium rounded">
                      {article.category?.title || 'None'}
                    </span>
                  </td>
                  <td className="p-4 text-gray-600">
                    {article.author?.name || 'Unknown'}
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-sm font-medium rounded ${
                      article.placement === 'featured-hero' 
                        ? 'bg-brand-coral text-white' 
                        : article.placement === 'sidebar'
                        ? 'bg-brand-yellow'
                        : 'bg-gray-200'
                    }`}>
                      {article.placement || 'grid'}
                    </span>
                  </td>
                  <td className="p-4 text-gray-600">
                    {article.publishedAt 
                      ? new Date(article.publishedAt).toLocaleDateString()
                      : 'Draft'
                    }
                  </td>
                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/news/${article.slug}`}
                        target="_blank"
                        className="p-2 hover:bg-gray-100 rounded"
                        title="Preview"
                      >
                        <Eye size={18} />
                      </Link>
                      <Link
                        href={`/admin/edit/${article._id}`}
                        className="p-2 hover:bg-gray-100 rounded"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
