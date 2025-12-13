'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { RichEditor } from './rich-editor';
import { ImageUpload } from './image-upload';
import { VideoUpload } from './video-upload';
import { createArticle, updateArticle } from '@/lib/admin/actions';
import { convertPortableTextToTiptapDoc, convertTiptapToPortableText } from '@/lib/admin/portable-text-converter';
import { generateSlug } from '@/lib/utils';
import { ArrowLeft, Save, Send } from 'lucide-react';
import Link from 'next/link';

interface Author {
  _id: string;
  name: string;
  role?: string;
}

interface Category {
  _id: string;
  title: string;
  slug: string;
}

interface ArticleFormProps {
  mode: 'create' | 'edit';
  authors: Author[];
  categories: Category[];
  initialData?: {
    _id?: string;
    title?: string;
    slug?: string;
    excerpt?: string;
    body?: unknown[];
    categoryId?: string;
    authorId?: string;
    imageAssetId?: string;
    imageUrl?: string;
    placement?: string;
    displayOrder?: number;
    tags?: string[];
    publishedAt?: string;
    photoCredit?: string;
    mediaType?: 'image' | 'video';
    videoUrl?: string; // External
    videoFileAssetId?: string; // Internal File
    videoFileUrl?: string; // Internal File URL
    videoThumbnailAssetId?: string;
    videoThumbnailUrl?: string;
  };
}

function hasPortableTextContent(blocks: unknown): blocks is unknown[] {
  if (!Array.isArray(blocks)) return false;
  return blocks.some((block) => {
    if (!block || typeof block !== 'object') return false;
    const typed = block as { _type?: string; children?: { text?: string }[] };

    if (typed._type && typed._type !== 'block') {
      return true;
    }

    if (Array.isArray(typed.children)) {
      return typed.children.some((child) => typeof child?.text === 'string' && child.text.trim().length > 0);
    }
    return false;
  });
}

export function ArticleForm({ mode, authors, categories, initialData = {} }: ArticleFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [title, setTitle] = useState(initialData.title || '');
  const [slug, setSlug] = useState(initialData.slug || '');
  const [excerpt, setExcerpt] = useState(initialData.excerpt || '');
  const [categoryId, setCategoryId] = useState(initialData.categoryId || '');
  const [authorId, setAuthorId] = useState(initialData.authorId || '');
  const [imageAssetId, setImageAssetId] = useState(initialData.imageAssetId || '');
  const [imageUrl, setImageUrl] = useState(initialData.imageUrl || '');
  const initialDoc = initialData.body ? convertPortableTextToTiptapDoc(initialData.body) : { type: 'doc', content: [{ type: 'paragraph', content: [] }] };
  const [editorJson, setEditorJson] = useState<unknown>(initialDoc);
  const [placement, setPlacement] = useState(initialData.placement || 'grid');
  const [displayOrder, setDisplayOrder] = useState(initialData.displayOrder || 100);
  const [tags, setTags] = useState<string[]>(initialData.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [photoCredit, setPhotoCredit] = useState(initialData.photoCredit || 'Impact Post');
  const [mediaType, setMediaType] = useState<'image' | 'video'>(initialData.mediaType || 'image');
  const [videoUrl, setVideoUrl] = useState(initialData.videoUrl || '');
  const [videoFileAssetId, setVideoFileAssetId] = useState(initialData.videoFileAssetId || '');
  const [videoFileUrl, setVideoFileUrl] = useState(initialData.videoFileUrl || '');
  const [videoThumbnailAssetId, setVideoThumbnailAssetId] = useState(initialData.videoThumbnailAssetId || '');
  const [videoThumbnailUrl, setVideoThumbnailUrl] = useState(initialData.videoThumbnailUrl || '');
  const [publishedAt, setPublishedAt] = useState(() => {
    const value = initialData.publishedAt || new Date().toISOString();
    const date = new Date(value);
    const offset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - offset).toISOString().slice(0, 16);
  });

  // Auto-generate slug from title
  useEffect(() => {
    if (mode === 'create' && title && !initialData.slug) {
      setSlug(generateSlug(title));
    }
  }, [title, mode, initialData.slug]);

  // Authors and categories are provided by the server page to avoid client/server boundary errors

  const handleImageUpload = async (file: File): Promise<{ assetId: string; url: string } | null> => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();
      return { assetId: data.assetId, url: data.url };
    } catch (error) {
      console.error('Upload error:', error);
      return null;
    }
  };

  const handleEditorImageUpload = async (file: File): Promise<string | null> => {
    const result = await handleImageUpload(file);
    return result?.url || null;
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const handleSubmit = async (isDraft: boolean) => {
    if (!title || !excerpt || !categoryId || !authorId) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    // Convert Tiptap JSON to Portable Text format
    const portableTextBody = convertTiptapToPortableText(editorJson);
    if (!hasPortableTextContent(portableTextBody)) {
      setIsSubmitting(false);
      console.error('Portable Text conversion returned empty content. Aborting save to prevent data loss.', {
        editorJson,
      });
      alert('Article content looks empty or unsupported. Refresh the page before saving to avoid losing text.');
      return;
    }

    try {
      const formData = {
        title,
        slug,
        excerpt,
        categoryId,
        authorId,
        imageAssetId: imageAssetId || undefined,
        body: portableTextBody,
        placement,
        displayOrder,
        tags,
        isDraft,
        publishedAt: isDraft || !publishedAt ? undefined : new Date(publishedAt).toISOString(),
        photoCredit,
        mediaType,
        videoUrl: mediaType === 'video' ? videoUrl : undefined,
        videoFileAssetId: mediaType === 'video' ? (videoFileAssetId || undefined) : undefined,
        videoThumbnailAssetId: mediaType === 'video' ? (videoThumbnailAssetId || undefined) : undefined,
      };

      let result;
      if (mode === 'edit' && initialData._id) {
        result = await updateArticle(initialData._id, formData);
      } else {
        result = await createArticle(formData);
      }

      if (result.success) {
        router.push('/admin');
        router.refresh();
      } else {
        alert(result.error || 'Failed to save article');
      }
    } catch (error) {
      console.error('Submit error:', error);
      alert('Failed to save article');
    } finally {
      setIsSubmitting(false);
    }
  };

  const missingReferenceData = authors.length === 0 || categories.length === 0;

  return (
    <div className="p-8 max-w-4xl">
      {missingReferenceData && (
        <div className="mb-6 rounded border-2 border-yellow-400 bg-yellow-50 p-4 text-sm text-yellow-900">
          Unable to load authors or categories. Refresh the page after adding at least one author and category in Sanity.
        </div>
      )}
      <div className="flex justify-between items-center mb-8">
        <Link href="/admin" className="flex items-center gap-2 text-gray-600 hover:text-black">
          <ArrowLeft size={20} />
          Back to Articles
        </Link>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => handleSubmit(true)}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-4 py-2 border-2 border-black hover:bg-gray-100 disabled:opacity-50"
          >
            <Save size={18} />
            Save Draft
          </button>
          <button
            type="button"
            onClick={() => handleSubmit(false)}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-4 py-2 bg-brand-purple text-white font-bold border-2 border-black shadow-hard hover:shadow-none hover:translate-x-1 hover:translate-y-1 disabled:opacity-50"
          >
            <Send size={18} />
            Publish
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Title */}
        <div>
          <label className="block font-bold mb-2">Title *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border-2 border-black p-3 text-xl font-bold focus:outline-none focus:ring-2 focus:ring-brand-purple"
            placeholder="Enter article title..."
          />
        </div>

        {/* Slug */}
        <div>
          <label className="block font-bold mb-2">Slug</label>
          <div className="flex items-center border-2 border-black">
            <span className="bg-gray-100 px-3 py-3 border-r-2 border-black text-gray-500">/news/</span>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(generateSlug(e.target.value))}
              className="flex-1 p-3 focus:outline-none"
              placeholder="article-slug"
            />
          </div>
        </div>

        {/* Excerpt */}
        <div>
          <label className="block font-bold mb-2">Excerpt *</label>
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            className="w-full border-2 border-black p-3 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-brand-purple"
            placeholder="Brief summary of the article..."
            maxLength={300}
          />
          <p className="text-sm text-gray-500 mt-1">{excerpt.length}/300 characters</p>
        </div>

        {/* Category and Author */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-bold mb-2">Category *</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full border-2 border-black p-3 focus:outline-none focus:ring-2 focus:ring-brand-purple"
            >
              <option value="">Select category...</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>{cat.title}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-bold mb-2">Author *</label>
            <select
              value={authorId}
              onChange={(e) => setAuthorId(e.target.value)}
              className="w-full border-2 border-black p-3 focus:outline-none focus:ring-2 focus:ring-brand-purple"
            >
              <option value="">Select author...</option>
              {authors.map((author) => (
                <option key={author._id} value={author._id}>{author.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Media Type */}
        <div>
          <label className="block font-bold mb-2">Media Type</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="mediaType"
                value="image"
                checked={mediaType === 'image'}
                onChange={() => setMediaType('image')}
                className="w-5 h-5 accent-brand-purple"
              />
              <span className="font-bold">Image</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="mediaType"
                value="video"
                checked={mediaType === 'video'}
                onChange={() => setMediaType('video')}
                className="w-5 h-5 accent-brand-purple"
              />
              <span className="font-bold">Video</span>
            </label>
          </div>
        </div>

        {/* Hero Image (only if Image selected) */}
        {mediaType === 'image' && (
          <div>
            <label className="block font-bold mb-2">Hero Image</label>
            <ImageUpload
              value={imageUrl}
              onChange={(assetId, url) => {
                setImageAssetId(assetId || '');
                setImageUrl(url || '');
              }}
              onUpload={handleImageUpload}
            />
          </div>
        )}

        {/* Video Fields (only if Video selected) */}
        {mediaType === 'video' && (
          <div className="space-y-6 border-2 border-brand-purple p-6 bg-purple-50">
            <h3 className="font-bold text-lg text-brand-purple mb-4">Video Settings</h3>

            {/* Direct Video File Upload */}
            <div>
              <label className="block font-bold mb-2">Upload Video File</label>
              <VideoUpload
                value={videoFileUrl}
                onChange={(assetId, url) => {
                  setVideoFileAssetId(assetId || '');
                  setVideoFileUrl(url || '');
                  // Clear external URL if file is uploaded to avoid confusion, or keep both? 
                  // Let's keep it simple: file takes precedence in display logic, but let user manage inputs.
                }}
                onUpload={handleImageUpload} // Reuse the same upload handler as it wraps the API that now handles videos
              />
              <p className="text-sm text-gray-500 mt-1">Direct upload (Max 50MB). For larger videos, use external URL below.</p>
            </div>

            <div className="text-center font-bold text-gray-400">- OR -</div>

            {/* External Video URL */}
            <div>
              <label className="block font-bold mb-2">External Video URL</label>
              <input
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="w-full border-2 border-black p-3 focus:outline-none focus:ring-2 focus:ring-brand-purple"
                placeholder="https://www.youtube.com/watch?v=..."
              />
              <p className="text-sm text-gray-500 mt-1">YouTube or Vimeo URL.</p>
            </div>

            {/* Video Thumbnail (Required) */}
            <div>
              <label className="block font-bold mb-2">Video Thumbnail *</label>
              <ImageUpload
                value={videoThumbnailUrl}
                onChange={(assetId, url) => {
                  setVideoThumbnailAssetId(assetId || '');
                  setVideoThumbnailUrl(url || '');
                }}
                onUpload={handleImageUpload}
              />
              <p className="text-sm text-gray-500 mt-1">Image shown before video plays.</p>
            </div>
          </div>
        )}

        {/* Photo Credit */}
        <div>
          <label className="block font-bold mb-2">Photo Credit</label>
          <input
            type="text"
            value={photoCredit}
            onChange={(e) => setPhotoCredit(e.target.value)}
            className="w-full border-2 border-black p-3 focus:outline-none focus:ring-2 focus:ring-brand-purple"
            placeholder="e.g., Freelance Photographer / Impact Post"
            maxLength={120}
          />
          <p className="text-sm text-gray-500 mt-1">Shown under the hero image. Defaults to “Impact Post”.</p>
        </div>

        {/* Content Editor */}
        <div>
          <label className="block font-bold mb-2">Content</label>
          <RichEditor
            initialDoc={initialDoc}
            onChange={(html, json) => {
              setEditorJson(json);
            }}
            onImageUpload={handleEditorImageUpload}
          />
        </div>

        {/* Placement */}
        <div className="border-t-2 border-gray-200 pt-6">
          <h3 className="font-bold text-lg mb-4">Homepage Placement</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-bold mb-2">Placement</label>
              <select
                value={placement}
                onChange={(e) => setPlacement(e.target.value)}
                className="w-full border-2 border-black p-3 focus:outline-none focus:ring-2 focus:ring-brand-purple"
              >
                <option value="grid">Grid (Latest Stories)</option>
                <option value="featured-hero">Featured Hero</option>
                <option value="sidebar">Sidebar (Community Pulse)</option>
                <option value="featured-multimedia">Featured Multimedia</option>
                <option value="hidden">Hidden</option>
              </select>
            </div>
            <div>
              <label className="block font-bold mb-2">Display Order</label>
              <input
                type="number"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 100)}
                className="w-full border-2 border-black p-3 focus:outline-none focus:ring-2 focus:ring-brand-purple"
                min={1}
              />
              <p className="text-sm text-gray-500 mt-1">Lower number = higher priority (1 appears first). Default: 100</p>
            </div>
          </div>
        </div>

        {/* Publish date/time */}
        <div>
          <label className="block font-bold mb-2">Publish Date &amp; Time</label>
          <input
            type="datetime-local"
            value={publishedAt}
            onChange={(e) => setPublishedAt(e.target.value)}
            className="w-full border-2 border-black p-3 focus:outline-none focus:ring-2 focus:ring-brand-purple"
          />
          <p className="text-sm text-gray-500 mt-1">Set when the article should be considered published. Leave empty for draft.</p>
        </div>

        {/* Tags */}
        <div>
          <label className="block font-bold mb-2">Tags</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-gray-100 border border-black rounded-full text-sm flex items-center gap-1"
              >
                #{tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="hover:text-red-500"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
              className="flex-1 border-2 border-black p-2 focus:outline-none"
              placeholder="Add a tag..."
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="px-4 py-2 border-2 border-black hover:bg-gray-100"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
