'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ImageUpload } from './image-upload';
import { createAdvertisement, updateAdvertisement, searchArticles, linkArticleToAdvertisement, unlinkArticleFromAdvertisement } from '@/lib/admin/actions';
import { ArrowLeft, Save, Plus, Search, Trash, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface AdvertisementFormProps {
    mode: 'create' | 'edit';
    initialData?: {
        _id?: string;
        title?: string;
        clientName?: string;
        revenue?: number;
        startDate?: string;
        endDate?: string;
        autoRenewal?: boolean;
        status?: string;
        imageAssetId?: string;
        imageUrl?: string;
        destinationUrl?: string;

        disclosureText?: string;
        placement?: string;
        linkedArticles?: {
            _id: string;
            title: string;
            slug: string;
            publishedAt?: string;
            isSponsored: boolean;
        }[];
    };
}

export function AdvertisementForm({ mode, initialData = {} }: AdvertisementFormProps) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form state
    const [title, setTitle] = useState(initialData.title || '');
    const [clientName, setClientName] = useState(initialData.clientName || '');
    const [revenue, setRevenue] = useState(initialData.revenue?.toString() || '');
    const [startDate, setStartDate] = useState(initialData.startDate || new Date().toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(initialData.endDate || '');
    const [autoRenewal, setAutoRenewal] = useState(initialData.autoRenewal || false);
    const [status, setStatus] = useState(initialData.status || 'scheduled');
    const [imageAssetId, setImageAssetId] = useState(initialData.imageAssetId || '');
    const [imageUrl, setImageUrl] = useState(initialData.imageUrl || '');
    const [destinationUrl, setDestinationUrl] = useState(initialData.destinationUrl || '');

    const [disclosureText, setDisclosureText] = useState(initialData.disclosureText || 'Sponsored');
    const [placement, setPlacement] = useState(initialData.placement || '');

    // Sponsored Content State
    const [linkedArticles, setLinkedArticles] = useState(initialData.linkedArticles || []);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<{ _id: string; title: string; slug?: string; publishedAt?: string }[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    const handleSearch = async () => {
        if (searchQuery.length < 2) return;
        setIsSearching(true);
        const results = await searchArticles(searchQuery);
        setSearchResults(results);
        setIsSearching(false);
    };

    const handleLinkArticle = async (articleId: string) => {
        if (!initialData._id) return;
        const result = await linkArticleToAdvertisement(articleId, initialData._id);
        if (result.success) {
            // Ideally re-fetch or optimistically update. For now, refresh page.
            router.refresh();
            // Optimistic update
            const article = searchResults.find(a => a._id === articleId);
            if (article) {
                setLinkedArticles([...linkedArticles, { ...article, slug: article.slug || '', isSponsored: true }]);
                setSearchResults(searchResults.filter(a => a._id !== articleId)); // Remove from search results
            }
        } else {
            alert('Failed to link article');
        }
    };

    const handleUnlinkArticle = async (articleId: string) => {
        if (!confirm('Are you sure you want to unlink this article?')) return;
        const result = await unlinkArticleFromAdvertisement(articleId);
        if (result.success) {
            router.refresh();
            setLinkedArticles(linkedArticles.filter(a => a._id !== articleId));
        } else {
            alert('Failed to unlink article');
        }
    };

    const handleImageUpload = async (file: File): Promise<{ assetId: string, url: string } | null> => {
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

    const handleSubmit = async () => {
        if (!title || !clientName || !startDate || !endDate) {
            alert('Please fill in all required fields');
            return;
        }

        setIsSubmitting(true);

        try {
            const formData = {
                title,
                clientName,
                revenue: revenue ? parseFloat(revenue) : undefined,
                startDate,
                endDate,
                autoRenewal,
                status,
                imageAssetId: imageAssetId || undefined,
                destinationUrl: destinationUrl || undefined,

                disclosureText: disclosureText || undefined,
                placement: placement || undefined,
            };

            let result;
            if (mode === 'edit' && initialData._id) {
                result = await updateAdvertisement(initialData._id, formData);
            } else {
                result = await createAdvertisement(formData);
            }

            if (result.success) {
                router.push('/admin/advertisements');
                router.refresh();
            } else {
                alert(result.error || 'Failed to save advertisement');
            }
        } catch (error) {
            console.error('Submit error:', error);
            alert('Failed to save advertisement');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="p-8 max-w-4xl">
            <div className="flex justify-between items-center mb-8">
                <Link href="/admin/advertisements" className="flex items-center gap-2 text-gray-600 hover:text-black">
                    <ArrowLeft size={20} />
                    Back to Advertisements
                </Link>
                <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-4 py-2 bg-brand-purple text-white font-bold border-2 border-black shadow-hard hover:shadow-none hover:translate-x-1 hover:translate-y-1 disabled:opacity-50"
                >
                    <Save size={18} />
                    Save Advertisement
                </button>
            </div>

            <div className="space-y-6">
                {/* Campaign Info */}
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block font-bold mb-2">Advertisement Title *</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full border-2 border-black p-3 focus:outline-none focus:ring-2 focus:ring-brand-purple"
                            placeholder="e.g. Summer Sale 2025"
                        />
                    </div>
                    <div>
                        <label className="block font-bold mb-2">Client Name *</label>
                        <input
                            type="text"
                            value={clientName}
                            onChange={(e) => setClientName(e.target.value)}
                            className="w-full border-2 border-black p-3 focus:outline-none focus:ring-2 focus:ring-brand-purple"
                            placeholder="e.g. Acme Corp"
                        />
                    </div>
                </div>

                {/* Financials & Dates */}
                <div className="grid grid-cols-3 gap-6">
                    <div>
                        <label className="block font-bold mb-2">Revenue ($)</label>
                        <input
                            type="number"
                            value={revenue}
                            onChange={(e) => setRevenue(e.target.value)}
                            className="w-full border-2 border-black p-3 focus:outline-none focus:ring-2 focus:ring-brand-purple"
                            placeholder="0.00"
                        />
                    </div>
                    <div>
                        <label className="block font-bold mb-2">Start Date *</label>
                        <input
                            type="date"
                            value={startDate.split('T')[0]}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full border-2 border-black p-3 focus:outline-none focus:ring-2 focus:ring-brand-purple"
                        />
                    </div>
                    <div>
                        <label className="block font-bold mb-2">End Date *</label>
                        <input
                            type="date"
                            value={endDate.split('T')[0]}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full border-2 border-black p-3 focus:outline-none focus:ring-2 focus:ring-brand-purple"
                        />
                    </div>
                </div>

            </div>

            {/* Placement */}
            <div className="bg-gray-50 p-6 border-2 border-black">
                <label className="block font-bold mb-2">Ad Placement</label>
                <select
                    value={placement}
                    onChange={(e) => setPlacement(e.target.value)}
                    className="w-full border-2 border-black p-3 focus:outline-none focus:ring-2 focus:ring-brand-purple"
                >
                    <option value="">-- No Specific Placement --</option>
                    <option value="homepage_leaderboard">Homepage Leaderboard (Width: Full, Min-Height: 120px)</option>
                    <option value="homepage_sidebar">Homepage Sidebar (Width: 300px, Height: 250px)</option>
                    <option value="homepage_feed">Homepage Feed / Latest Stories (Width: Full, Min-Height: 300px)</option>
                    <option value="article_footer">Article Footer (Width: Full, Min-Height: 120px)</option>
                </select>
                <p className="text-sm text-gray-500 mt-2">Where should this ad appear automatically?</p>
            </div>

            {/* Status & Renewal */}
            <div className="grid grid-cols-2 gap-6 bg-gray-50 p-6 border-2 border-black">
                <div>
                    <label className="block font-bold mb-2">Status</label>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="w-full border-2 border-black p-3 focus:outline-none focus:ring-2 focus:ring-brand-purple"
                    >
                        <option value="active">Active</option>
                        <option value="scheduled">Scheduled</option>
                        <option value="expired">Expired</option>
                        <option value="canceled">Canceled</option>
                    </select>
                </div>
                <div className="flex items-center">
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={autoRenewal}
                            onChange={(e) => setAutoRenewal(e.target.checked)}
                            className="w-6 h-6 border-2 border-black accent-brand-purple"
                        />
                        <span className="font-bold">Auto-Renewal</span>
                    </label>
                </div>
            </div>

            {/* Sponsored Content (Only visible in Edit mode) */}
            {mode === 'edit' && initialData._id && (
                <div className="bg-white p-6 border-2 border-dashed border-gray-300">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="font-heavy text-xl">Sponsored Articles</h3>
                            <p className="text-gray-500 text-sm">Articles linked to this advertisement for tracking.</p>
                        </div>
                        <Link href={`/admin/new?sponsorId=${initialData._id}`}>
                            <button className="flex items-center gap-2 px-3 py-1.5 bg-brand-teal text-white font-bold border-2 border-black shadow-hard-sm hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none text-sm">
                                <Plus size={16} /> Create Article
                            </button>
                        </Link>
                    </div>

                    {/* Linked Articles List */}
                    {linkedArticles.length > 0 ? (
                        <ul className="space-y-2 mb-6">
                            {linkedArticles.map(article => (
                                <li key={article._id} className="flex justify-between items-center bg-gray-50 p-3 border border-gray-200">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-2 h-2 rounded-full ${article.isSponsored ? 'bg-green-500' : 'bg-gray-300'}`} />
                                        <span className="font-medium">{article.title}</span>
                                        {article.slug && (
                                            <Link href={`/news/${article.slug}`} target="_blank" className="text-gray-400 hover:text-brand-purple">
                                                <ExternalLink size={14} />
                                            </Link>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Link href={`/admin/edit/${article._id}`}>
                                            <button className="text-xs font-bold uppercase tracking-wide px-2 py-1 bg-white border border-black hover:bg-gray-100">
                                                Edit
                                            </button>
                                        </Link>
                                        <button
                                            onClick={() => handleUnlinkArticle(article._id)}
                                            className="text-red-500 hover:text-red-700 p-1"
                                            title="Unlink"
                                        >
                                            <Trash size={16} />
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500 italic mb-6">No articles linked yet.</p>
                    )}

                    {/* Link Existing Article */}
                    <div className="border-t border-gray-200 pt-4">
                        <label className="block text-sm font-bold mb-2">Link Existing Article</label>
                        <div className="flex gap-2 mb-2">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                className="flex-grow border border-gray-300 p-2 text-sm"
                                placeholder="Search by title..."
                            />
                            <button
                                type="button"
                                onClick={handleSearch}
                                disabled={isSearching}
                                className="px-3 py-2 bg-gray-100 border border-black hover:bg-gray-200"
                            >
                                <Search size={16} />
                            </button>
                        </div>

                        {/* Search Results */}
                        {searchResults.length > 0 && (
                            <ul className="max-h-40 overflow-y-auto border border-gray-200 bg-white">
                                {searchResults.map(result => (
                                    <li key={result._id} className="flex justify-between items-center p-2 hover:bg-gray-50 border-b border-gray-100 last:border-0">
                                        <span className="text-sm truncate">{result.title}</span>
                                        <button
                                            type="button"
                                            onClick={() => handleLinkArticle(result._id)}
                                            className="text-xs text-brand-purple font-bold hover:underline whitespace-nowrap ml-2"
                                        >
                                            + Link
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            )}

            {/* Creative Assets */}
            <h3 className="font-heavy text-xl pt-4 border-t-2 border-black">Creative Assets</h3>

            <div>
                <label className="block font-bold mb-2">Ad Image</label>
                <ImageUpload
                    value={imageUrl}
                    onChange={(assetId, url) => {
                        setImageAssetId(assetId || '');
                        setImageUrl(url || '');
                    }}
                    onUpload={handleImageUpload}
                />
            </div>

            <div>
                <label className="block font-bold mb-2">Destination URL</label>
                <input
                    type="url"
                    value={destinationUrl}
                    onChange={(e) => setDestinationUrl(e.target.value)}
                    className="w-full border-2 border-black p-3 focus:outline-none focus:ring-2 focus:ring-brand-purple"
                    placeholder="https://example.com/landing-page"
                />
            </div>

            <div>
                <label className="block font-bold mb-2">Disclosure Text</label>
                <input
                    type="text"
                    value={disclosureText}
                    onChange={(e) => setDisclosureText(e.target.value)}
                    className="w-full border-2 border-black p-3 focus:outline-none focus:ring-2 focus:ring-brand-purple"
                    placeholder="e.g. Sponsored by Acme Corp"
                />
            </div>

        </div>

    );
}
