'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { X, ArrowRight } from 'lucide-react';

interface SearchOverlayProps {
    isOpen: boolean;
    onClose: () => void;
}

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
    const [query, setQuery] = useState('');
    const router = useRouter();
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            // Focus input when overlay opens
            setTimeout(() => inputRef.current?.focus(), 100);
            // Prevent scrolling when overlay is open
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/search?q=${encodeURIComponent(query.trim())}`);
            onClose();
            setQuery('');
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 bg-brand-light/95 backdrop-blur-sm animate-in fade-in duration-300 flex flex-col items-center justify-start pt-[15vh] px-4"
            onKeyDown={(e) => e.key === 'Escape' && onClose()}
        >
            <button
                onClick={onClose}
                className="absolute top-8 right-8 p-3 hover:bg-gray-100 rounded-full transition-colors border-2 border-black shadow-hard active:translate-y-1 active:shadow-none"
                aria-label="Close search"
            >
                <X size={24} />
            </button>

            <div className="w-full max-w-3xl animate-in slide-in-from-bottom-8 duration-500">
                <h2 className="text-4xl md:text-6xl font-heavy italic mb-8 tracking-tighter text-black">
                    SEARCH <span className="text-brand-coral">POST</span>
                </h2>

                <form onSubmit={handleSearch} className="relative group">
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Type your search here..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="w-full bg-white border-4 border-black p-6 md:p-8 text-2xl md:text-4xl font-bold shadow-hard focus:shadow-hard-lg focus:-translate-y-1 focus:outline-none transition-all placeholder:text-gray-300"
                    />
                    <button
                        type="submit"
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-brand-yellow hover:bg-brand-coral border-2 border-black transition-colors"
                    >
                        <ArrowRight size={32} />
                    </button>
                </form>

                <div className="mt-12 flex flex-wrap gap-4 items-center">
                    <span className="text-sm font-black uppercase tracking-widest text-gray-500">Quick Links:</span>
                    {['News', 'Community', 'Youth Hub', 'Wellness'].map((tag) => (
                        <button
                            key={tag}
                            onClick={() => {
                                router.push(`/section/${tag.toLowerCase().replace(' ', '-')}`);
                                onClose();
                            }}
                            className="px-4 py-2 border-2 border-black font-bold uppercase text-xs hover:bg-brand-purple hover:text-white transition-colors shadow-hard-sm hover:shadow-none hover:translate-y-1"
                        >
                            {tag}
                        </button>
                    ))}
                </div>

                <p className="mt-12 text-sm font-medium text-gray-500 italic">
                    Press <kbd className="font-bold border-2 border-black px-2 py-0.5 rounded shadow-hard-sm bg-white not-italic">ESC</kbd> to close or <kbd className="font-bold border-2 border-black px-2 py-0.5 rounded shadow-hard-sm bg-white not-italic">ENTER</kbd> to search.
                </p>
            </div>
        </div>
    );
}
