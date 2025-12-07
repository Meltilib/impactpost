import { fetchAuthors, fetchArticlesForAdmin } from '@/lib/admin/actions';
import Link from 'next/link';
import { ArrowLeft, AlertCircle } from 'lucide-react';

interface Author {
  _id: string;
  name: string;
  role?: string;
}

interface Article {
  _id: string;
  title: string;
  author?: { _id: string; name: string };
  category?: { _id: string; title: string };
}

export const dynamic = 'force-dynamic';

export default async function AuthorsPage() {
  const [authors, articles] = await Promise.all([
    fetchAuthors(),
    fetchArticlesForAdmin(),
  ]);

  // Count articles per author
  const articleCounts = (articles as Article[]).reduce((acc: Record<string, number>, article: Article) => {
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

      {authors.length === 0 ? (
        <div className="bg-white border-2 border-black shadow-hard p-12 text-center">
          <p className="text-gray-600">No authors found</p>
        </div>
      ) : (
        <div className="bg-white border-2 border-black shadow-hard overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100 border-b-2 border-black">
              <tr>
                <th className="text-left p-4 font-bold">Name</th>
                <th className="text-left p-4 font-bold">Role</th>
                <th className="text-left p-4 font-bold">Articles</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {(authors as Author[]).map((author: Author) => (
                <tr key={author._id} className="hover:bg-gray-50">
                  <td className="p-4 font-medium">{author.name}</td>
                  <td className="p-4 text-gray-600">{author.role || '—'}</td>
                  <td className="p-4 text-center">{articleCounts[author._id] || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-8 bg-brand-light border-2 border-black shadow-hard p-6 flex gap-4">
        <AlertCircle size={24} className="text-brand-purple flex-shrink-0 mt-1" />
        <div>
          <h3 className="font-bold text-lg mb-2">Full CRUD Coming Soon</h3>
          <p className="text-gray-700">
            Author creation, editing, and deletion features will be available in a future update. 
            For now, you can view all authors and their article counts here.
          </p>
        </div>
      </div>
    </div>
  );
}
