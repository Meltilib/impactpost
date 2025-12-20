'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BackButtonProps {
    className?: string;
    variant?: 'circle' | 'label';
    label?: string;
    labelColor?: string;
}

export function BackButton({
    className,
    variant = 'circle',
    label = 'HOME',
    labelColor = 'bg-brand-blue'
}: BackButtonProps) {
    const router = useRouter();

    const handleBack = () => {
        // If it's the "HOME" label, always go to the landing page top
        if (variant === 'label' && label === 'HOME') {
            router.push('/');
            return;
        }

        // For the circular back button, if there's history, go back, otherwise go home
        if (typeof window !== 'undefined' && window.history.length > 1) {
            router.back();
        } else {
            router.push('/');
        }
    };

    if (variant === 'label') {
        return (
            <button
                onClick={handleBack}
                className={cn(
                    "px-4 py-1.5 font-bold text-sm uppercase border-2 border-black shadow-hard-sm transition-all hover:bg-brand-coral hover:text-white active:translate-y-0.5 active:shadow-none",
                    labelColor,
                    className
                )}
            >
                {label}
            </button>
        );
    }

    return (
        <button
            onClick={handleBack}
            className={cn(
                "group flex items-center justify-center w-10 h-10 rounded-full bg-white border-2 border-black transition-all shadow-hard-sm hover:bg-brand-coral active:translate-y-0.5 active:shadow-none hover:scale-110",
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
