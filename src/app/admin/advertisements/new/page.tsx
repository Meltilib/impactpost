import { AdvertisementForm } from '@/components/admin/advertisement-form';
import { requireAdmin } from '@/lib/auth/permissions';

export const dynamic = 'force-dynamic';

export default async function NewAdvertisementPage() {
    await requireAdmin();

    return (
        <div>
            <div className="bg-brand-dark text-white p-8">
                <h1 className="font-heavy text-3xl">New Advertisement</h1>
                <p className="text-white/70">Create a new ad campaign</p>
            </div>
            <AdvertisementForm mode="create" />
        </div>
    );
}
