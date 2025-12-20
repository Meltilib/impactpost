'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BackButtonProps {
    className?: string;
}

export function BackButton({ className }: BackButtonProps) {
    const router = useRouter();

    return (
        <button
            onClick={() => router.push('/')}
            className={cn(
                "group flex items-center justify-center w-10 h-10 rounded-full bg-white border-2 border-black transition-all shadow-hard-sm hover:bg-brand-coral active:translate-y-0.5 active:shadow-none",
                className
            )}
            aria-label="Go back"
        >
            <ArrowLeft
                size={20}
                className="text-black transition-colors group-hover:text-white"
            />
        </button>
    );
}
