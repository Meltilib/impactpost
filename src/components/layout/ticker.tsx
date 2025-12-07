import { fetchTickerItems } from '@/lib/sanity/fetch';

export async function Ticker() {
  const { items, isActive } = await fetchTickerItems();

  if (!isActive || items.length === 0) {
    return null;
  }

  const text = items.join('  •  ');

  return (
    <div className="ticker-wrap border-b-2 border-black z-50 relative bg-black text-white">
      <div className="ticker font-mono font-bold text-sm tracking-widest uppercase py-2">
        {text}
      </div>
    </div>
  );
}
