'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { updateTickerSettings } from '@/lib/admin/actions';
import { Plus, GripVertical, Trash2, Loader2 } from 'lucide-react';

interface Props {
  initialItems: string[];
  isActive: boolean;
}

export function TickerManager({ initialItems, isActive }: Props) {
  const router = useRouter();
  const [items, setItems] = useState(initialItems.length ? initialItems : ['']);
  const [active, setActive] = useState(isActive);
  const [newItem, setNewItem] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSaving, startSaving] = useTransition();

  const moveItem = (index: number, direction: -1 | 1) => {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= items.length) return;
    const updated = [...items];
    const temp = updated[index];
    updated[index] = updated[nextIndex];
    updated[nextIndex] = temp;
    setItems(updated);
  };

  const removeItem = (index: number) => {
    const updated = items.filter((_, i) => i !== index);
    setItems(updated.length ? updated : ['']);
  };

  const addItem = () => {
    if (!newItem.trim()) return;
    setItems([...items, newItem.trim()]);
    setNewItem('');
  };

  const save = () => {
    startSaving(async () => {
      const cleaned = items.map((i) => i.trim()).filter(Boolean);
      if (!cleaned.length) {
        setError('Add at least one ticker item.');
        return;
      }
      setError(null);
      setSuccess(null);

      const result = await updateTickerSettings({ items: cleaned, isActive: active });
      if (!result.success) {
        setError(result.error || 'Unable to save ticker.');
        return;
      }

      setSuccess('Ticker updated.');
      router.refresh();
    });
  };

  return (
    <div className="bg-white border-2 border-black shadow-hard p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heavy text-2xl">Ticker</h2>
          <p className="text-gray-600">Manual list with reorder. Shows on every page.</p>
        </div>
        <label className="flex items-center gap-2 font-bold">
          <input
            type="checkbox"
            checked={active}
            onChange={(e) => setActive(e.target.checked)}
            className="w-4 h-4 border-2 border-black"
          />
          Enable ticker
        </label>
      </div>

      {error && <p className="text-red-600 font-medium">{error}</p>}
      {success && <p className="text-green-600 font-medium">{success}</p>}

      <div className="space-y-2">
        {items.map((text, index) => (
          <div
            key={`${index}-${text.slice(0, 10)}`}
            className="flex items-center gap-2 border border-black/20 rounded px-3 py-2 bg-gray-50"
          >
            <GripVertical size={16} className="text-gray-500" />
            <input
              type="text"
              value={text}
              onChange={(e) => {
                const updated = [...items];
                updated[index] = e.target.value;
                setItems(updated);
              }}
              className="flex-1 bg-transparent focus:outline-none"
              maxLength={160}
            />
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => moveItem(index, -1)}
                className="px-2 py-1 border border-black/10 text-sm"
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => moveItem(index, 1)}
                className="px-2 py-1 border border-black/10 text-sm"
              >
                ↓
              </button>
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="p-1 text-red-600 hover:bg-red-50 rounded"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addItem()}
          className="flex-1 border-2 border-black p-2 focus:outline-none"
          placeholder="Add new ticker item"
          maxLength={160}
        />
        <button
          type="button"
          onClick={addItem}
          className="flex items-center gap-2 px-3 py-2 border-2 border-black bg-gray-100 hover:bg-gray-200"
        >
          <Plus size={16} />
          Add
        </button>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={save}
          disabled={isSaving}
          className="px-4 py-2 bg-brand-purple text-white font-bold border-2 border-black shadow-hard hover:shadow-none hover:translate-x-1 hover:translate-y-1 disabled:opacity-60"
        >
          {isSaving ? <Loader2 size={18} className="animate-spin" /> : 'Save Ticker'}
        </button>
      </div>
    </div>
  );
}
