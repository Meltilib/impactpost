'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { createCategory, updateCategory, deleteCategory } from '@/lib/admin/actions';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';

type Category = {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  color?: string;
  textColor?: string;
};

interface Props {
  categories: Category[];
  articleCounts: Record<string, number>;
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export function CategoriesManager({ categories, articleCounts }: Props) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('');
  const [textColor, setTextColor] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, startDelete] = useTransition();

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setSlug('');
    setDescription('');
    setColor('');
    setTextColor('');
    setError(null);
    setSuccess(null);
  };

  const handleEdit = (category: Category) => {
    setEditingId(category._id);
    setTitle(category.title);
    setSlug(category.slug);
    setDescription(category.description || '');
    setColor(category.color || '');
    setTextColor(category.textColor || '');
    setError(null);
    setSuccess(null);
  };

  const handleSave = async () => {
    if (!title.trim()) {
      setError('Title is required.');
      return;
    }
    const finalSlug = slug ? slugify(slug) : slugify(title);

    setIsSaving(true);
    setError(null);
    setSuccess(null);

    const payload = {
      title: title.trim(),
      slug: finalSlug,
      description: description.trim() || undefined,
      color: color.trim() || undefined,
      textColor: textColor.trim() || undefined,
    };

    const result = editingId
      ? await updateCategory(editingId, payload)
      : await createCategory(payload);

    setIsSaving(false);

    if (!result.success) {
      setError(result.error || 'Unable to save category.');
      return;
    }

    setSuccess('Saved successfully.');
    resetForm();
    router.refresh();
  };

  const handleDelete = (id: string) => {
    startDelete(async () => {
      setError(null);
      setSuccess(null);
      const result = await deleteCategory(id);
      if (!result.success) {
        setError(result.error || 'Unable to delete category.');
        return;
      }
      router.refresh();
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-heavy text-2xl">Categories</h2>
        <button
          type="button"
          onClick={resetForm}
          className="flex items-center gap-2 bg-brand-purple text-white px-4 py-2 font-bold border-2 border-black shadow-hard hover:shadow-none hover:translate-x-1 hover:translate-y-1"
        >
          <Plus size={18} />
          New Category
        </button>
      </div>

      <div className="bg-white border-2 border-black shadow-hard overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 border-b-2 border-black">
            <tr>
              <th className="text-left p-4 font-bold">Title</th>
              <th className="text-left p-4 font-bold">Slug</th>
              <th className="text-left p-4 font-bold">Articles</th>
              <th className="text-right p-4 font-bold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {categories.map((category) => (
              <tr key={category._id} className="hover:bg-gray-50">
                <td className="p-4 font-medium">{category.title}</td>
                <td className="p-4 text-gray-600 font-mono text-sm">{category.slug}</td>
                <td className="p-4 text-center">{articleCounts[category._id] || 0}</td>
                <td className="p-4">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => handleEdit(category)}
                      className="p-2 hover:bg-gray-100 rounded border border-black/10"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(category._id)}
                      className="p-2 hover:bg-gray-100 rounded border border-black/10 text-red-600 disabled:opacity-50"
                      disabled={isDeleting}
                    >
                      {isDeleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-white border-2 border-black shadow-hard p-6 space-y-4">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-xl">{editingId ? 'Edit Category' : 'Add Category'}</h3>
          {editingId && <span className="text-sm text-gray-500">Editing existing category</span>}
        </div>

        {error && <p className="text-red-600 font-medium">{error}</p>}
        {success && <p className="text-green-600 font-medium">{success}</p>}

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div>
              <label className="block font-bold mb-2">Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (!editingId) setSlug(slugify(e.target.value));
                }}
                className="w-full border-2 border-black p-3 focus:outline-none focus:ring-2 focus:ring-brand-purple"
                placeholder="Category title"
              />
            </div>
            <div>
              <label className="block font-bold mb-2">Slug</label>
              <div className="flex items-center border-2 border-black">
                <span className="bg-gray-100 px-3 py-3 border-r-2 border-black text-gray-500">/section/</span>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(slugify(e.target.value))}
                  className="flex-1 p-3 focus:outline-none"
                  placeholder="category-slug"
                />
              </div>
              <p className="text-sm text-gray-500 mt-1">Used for section URLs and article references.</p>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <label className="block font-bold mb-2">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border-2 border-black p-3 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-brand-purple"
                placeholder="Optional description"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold mb-2">Color class</label>
                <input
                  type="text"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-full border-2 border-black p-3 focus:outline-none focus:ring-2 focus:ring-brand-purple"
                  placeholder="e.g., bg-brand-purple"
                />
              </div>
              <div>
                <label className="block font-bold mb-2">Text color class</label>
                <input
                  type="text"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="w-full border-2 border-black p-3 focus:outline-none focus:ring-2 focus:ring-brand-purple"
                  placeholder="e.g., text-white"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 bg-brand-purple text-white font-bold border-2 border-black shadow-hard hover:shadow-none hover:translate-x-1 hover:translate-y-1 disabled:opacity-60"
          >
            {isSaving ? 'Saving…' : 'Save'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 border-2 border-black hover:bg-gray-100"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
