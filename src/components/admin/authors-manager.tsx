'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { createAuthor, updateAuthor, deleteAuthor } from '@/lib/admin/actions';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import Image from 'next/image';

type Author = {
  _id: string;
  name: string;
  role?: string;
  slug?: string;
  bio?: string;
  image?: { asset?: { _id: string; url: string } };
};

interface Props {
  authors: Author[];
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

export function AuthorsManager({ authors, articleCounts }: Props) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, startDelete] = useTransition();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [bio, setBio] = useState('');
  const [slug, setSlug] = useState('');
  const [imageAssetId, setImageAssetId] = useState<string | undefined>();
  const [imageUrl, setImageUrl] = useState<string | undefined>();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const resetForm = () => {
    setEditingId(null);
    setName('');
    setRole('');
    setBio('');
    setSlug('');
    setImageAssetId(undefined);
    setImageUrl(undefined);
    setError(null);
    setSuccess(null);
  };

  const handleFileChange = async (file?: File) => {
    if (!file) return;
    setError(null);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      setImageAssetId(data.assetId);
      setImageUrl(data.url);
    } catch (err) {
      console.error(err);
      setError('Image upload failed. Please try again.');
    }
  };

  const handleEdit = (author: Author) => {
    setEditingId(author._id);
    setName(author.name);
    setRole(author.role || '');
    setBio(author.bio || '');
    setSlug(author.slug || slugify(author.name));
    setImageAssetId(author.image?.asset?._id);
    setImageUrl(author.image?.asset?.url);
    setError(null);
    setSuccess(null);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      setError('Name is required.');
      return;
    }
    const finalSlug = slug ? slugify(slug) : slugify(name);
    setIsSaving(true);
    setError(null);
    setSuccess(null);
    const payload = {
      name: name.trim(),
      role: role.trim() || undefined,
      bio: bio.trim() || undefined,
      slug: finalSlug,
      imageAssetId,
    };
    const result = editingId
      ? await updateAuthor(editingId, payload)
      : await createAuthor(payload);
    setIsSaving(false);

    if (!result.success) {
      setError(result.error || 'Unable to save author.');
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
      const result = await deleteAuthor(id);
      if (!result.success) {
        setError(result.error || 'Unable to delete author.');
        return;
      }
      router.refresh();
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-heavy text-2xl">Authors</h2>
        <button
          type="button"
          onClick={resetForm}
          className="flex items-center gap-2 bg-brand-purple text-white px-4 py-2 font-bold border-2 border-black shadow-hard hover:shadow-none hover:translate-x-1 hover:translate-y-1"
        >
          <Plus size={18} />
          New Author
        </button>
      </div>

      <div className="bg-white border-2 border-black shadow-hard overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 border-b-2 border-black">
            <tr>
              <th className="text-left p-4 font-bold">Name</th>
              <th className="text-left p-4 font-bold">Role</th>
              <th className="text-left p-4 font-bold">Articles</th>
              <th className="text-right p-4 font-bold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {authors.map((author) => (
              <tr key={author._id} className="hover:bg-gray-50">
                <td className="p-4 font-medium">{author.name}</td>
                <td className="p-4 text-gray-600">{author.role || '—'}</td>
                <td className="p-4 text-center">{articleCounts[author._id] || 0}</td>
                <td className="p-4">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => handleEdit(author)}
                      className="p-2 hover:bg-gray-100 rounded border border-black/10"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(author._id)}
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
          <h3 className="font-bold text-xl">{editingId ? 'Edit Author' : 'Add Author'}</h3>
          {editingId && <span className="text-sm text-gray-500">Editing existing author</span>}
        </div>

        {error && <p className="text-red-600 font-medium">{error}</p>}
        {success && <p className="text-green-600 font-medium">{success}</p>}

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div>
              <label className="block font-bold mb-2">Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (!editingId) setSlug(slugify(e.target.value));
                }}
                className="w-full border-2 border-black p-3 focus:outline-none focus:ring-2 focus:ring-brand-purple"
                placeholder="Full name"
              />
            </div>
            <div>
              <label className="block font-bold mb-2">Role / Title</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full border-2 border-black p-3 focus:outline-none focus:ring-2 focus:ring-brand-purple"
                placeholder="e.g., Senior Correspondent"
              />
            </div>
            <div>
              <label className="block font-bold mb-2">Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full border-2 border-black p-3 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-brand-purple"
                placeholder="Short bio"
              />
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <label className="block font-bold mb-2">Slug</label>
              <div className="flex items-center border-2 border-black">
                <span className="bg-gray-100 px-3 py-3 border-r-2 border-black text-gray-500">/author/</span>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(slugify(e.target.value))}
                  className="flex-1 p-3 focus:outline-none"
                  placeholder="author-slug"
                />
              </div>
              <p className="text-sm text-gray-500 mt-1">Used for references and URLs.</p>
            </div>
            <div>
              <label className="block font-bold mb-2">Headshot</label>
              <div className="flex items-center gap-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e.target.files?.[0])}
                  className="block w-full text-sm text-gray-700"
                />
                {imageUrl && (
                  <Image
                    src={imageUrl}
                    alt="Preview"
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-full border-2 border-black object-cover"
                  />
                )}
              </div>
              <p className="text-sm text-gray-500 mt-1">Optional. 1:1 crop looks best.</p>
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
