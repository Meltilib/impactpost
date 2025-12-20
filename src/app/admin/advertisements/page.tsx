import Link from 'next/link';
import Image from 'next/image';
import { Plus, Edit } from 'lucide-react';
import { fetchAdvertisements, deleteAdvertisement } from '@/lib/admin/actions';
import { requireAdmin } from '@/lib/auth/permissions';
import { revalidatePath } from 'next/cache';
import { DeleteAdButton } from '@/components/admin/delete-ad-button';

interface Advertisement {
    _id: string;
    image?: {
        asset?: {
            url?: string;
        };
    };
    title: string;
    autoRenewal: boolean;
    clientName: string;
    startDate: string;
    endDate: string;
    revenue?: number;
    status: 'active' | 'expired' | 'canceled' | 'pending';
}

export const dynamic = 'force-dynamic';

export default async function AdvertisementsPage() {
    await requireAdmin();
    const advertisements = await fetchAdvertisements();

    async function handleDeleteAction(formData: FormData) {
        'use server';
        const id = formData.get('adId') as string;
        await deleteAdvertisement(id);
        revalidatePath('/admin/advertisements');
    }

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="font-heavy text-3xl">Advertisements</h1>
                    <p className="text-gray-600">Manage calls to action and sponsored content</p>
                </div>
                <Link
                    href="/admin/advertisements/new"
                    className="flex items-center gap-2 bg-brand-purple text-white px-4 py-2 font-bold hover:bg-brand-purple/90 transition-colors border-2 border-black shadow-hard"
                >
                    <Plus size={20} />
                    New Advertisement
                </Link>
            </div>

            {advertisements.length === 0 ? (
                <div className="bg-white border-2 border-black shadow-hard p-12 text-center">
                    <p className="text-gray-600 mb-4">No advertisements yet</p>
                    <Link
                        href="/admin/advertisements/new"
                        className="inline-flex items-center gap-2 bg-brand-coral text-white px-6 py-3 font-bold hover:bg-brand-coral/90 transition-colors"
                    >
                        <Plus size={20} />
                        Create your first ad
                    </Link>
                </div>
            ) : (
                <div className="bg-white border-2 border-black shadow-hard overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-100 border-b-2 border-black">
                            <tr>
                                <th className="text-left p-4 font-bold">Ad Title</th>
                                <th className="text-left p-4 font-bold">Client</th>
                                <th className="text-left p-4 font-bold">Dates</th>
                                <th className="text-left p-4 font-bold">Revenue</th>
                                <th className="text-left p-4 font-bold">Status</th>
                                <th className="text-right p-4 font-bold">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {advertisements.map((ad: Advertisement) => (
                                <tr key={ad._id} className="hover:bg-gray-50">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            {ad.image?.asset?.url && (
                                                <Image
                                                    src={ad.image.asset.url}
                                                    alt={ad.title}
                                                    width={40}
                                                    height={40}
                                                    className="w-10 h-10 object-cover border border-black"
                                                />
                                            )}
                                            <div>
                                                <p className="font-bold">{ad.title}</p>
                                                <p className="text-sm text-gray-500">{ad.autoRenewal ? 'Auto-renewing' : 'One-time'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">{ad.clientName}</td>
                                    <td className="p-4 text-sm text-gray-600">
                                        <div>{new Date(ad.startDate).toLocaleDateString()}</div>
                                        <div className="text-gray-400">to {new Date(ad.endDate).toLocaleDateString()}</div>
                                    </td>
                                    <td className="p-4 font-mono">
                                        {ad.revenue ? `$${ad.revenue.toLocaleString()}` : '—'}
                                    </td>
                                    <td className="p-4">
                                        <span
                                            className={`px-2 py-1 text-sm font-medium rounded ${ad.status === 'active'
                                                ? 'bg-green-100 text-green-800'
                                                : ad.status === 'expired'
                                                    ? 'bg-red-100 text-red-800'
                                                    : ad.status === 'canceled'
                                                        ? 'bg-gray-100 text-gray-800'
                                                        : 'bg-yellow-100 text-yellow-800'
                                                }`}
                                        >
                                            {ad.status?.charAt(0).toUpperCase() + ad.status?.slice(1)}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex justify-end gap-2">
                                            <Link
                                                href={`/admin/advertisements/edit/${ad._id}`}
                                                className="p-2 hover:bg-gray-100 rounded"
                                                title="Edit"
                                            >
                                                <Edit size={18} />
                                            </Link>
                                            <DeleteAdButton adId={ad._id} formAction={handleDeleteAction} />
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
