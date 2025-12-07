import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { fetchTickerSettings } from '@/lib/admin/actions';
import { TickerManager } from '@/components/admin/ticker-manager';

export const dynamic = 'force-dynamic';

const FALLBACK_ITEMS = [
  'BREAKING: New Cultural Centre Approved in Etobicoke',
  'Youth Scholarship Applications Open until Nov 30',
  'Community Business Awards Nominations Now Open',
];

export default async function SettingsPage() {
  const settings = await fetchTickerSettings();
  const items = settings?.tickerItems?.map((item: { text?: string }) => item?.text).filter(Boolean) || FALLBACK_ITEMS;
  const isActive = settings?.isTickerActive ?? true;

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center gap-2">
        <Link href="/admin" className="text-gray-600 hover:text-black">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="font-heavy text-3xl">Settings</h1>
          <p className="text-gray-600">Manage ticker and other site-wide controls</p>
        </div>
      </div>

      <TickerManager initialItems={items} isActive={isActive} />
    </div>
  );
}
