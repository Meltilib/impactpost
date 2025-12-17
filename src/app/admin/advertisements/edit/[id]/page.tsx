import { AdvertisementForm } from '@/components/admin/advertisement-form';
import { fetchAdvertisementById } from '@/lib/admin/actions';
import { requireAdmin } from '@/lib/auth/permissions';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function EditAdvertisementPage({ params }: PageProps) {
    await requireAdmin();
    const { id } = await params;
    const advertisement = await fetchAdvertisementById(id);

    if (!advertisement) {
        notFound();
    }

    // Map Sanity response to form initialData
    const initialData = {
        _id: advertisement._id,
        title: advertisement.title,
        clientName: advertisement.clientName,
        revenue: advertisement.revenue,
        startDate: advertisement.startDate,
        endDate: advertisement.endDate,
        autoRenewal: advertisement.autoRenewal,
        status: advertisement.status,
        imageAssetId: advertisement.image?.asset?._id,
        imageUrl: advertisement.image?.asset?.url,
        destinationUrl: advertisement.destinationUrl,
        disclosureText: advertisement.disclosureText,
        linkedArticles: advertisement.linkedArticles,
    };

    return (
        <div>
            <div className="bg-brand-dark text-white p-8">
                <h1 className="font-heavy text-3xl">Edit Advertisement</h1>
                <p className="text-white/70">Update advertisement details</p>
            </div>
            <AdvertisementForm mode="edit" initialData={initialData} />
        </div>
    );
}
