'use client';

import { Trash2 } from 'lucide-react';
import { useState } from 'react';

interface DeleteAdButtonProps {
    adId: string;
    formAction: (formData: FormData) => void;
}

export function DeleteAdButton({ adId, formAction }: DeleteAdButtonProps) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        if (!confirm('Are you sure you want to delete this advertisement?')) {
            e.preventDefault();
            return;
        }
        setIsDeleting(true);
    };

    return (
        <form action={formAction} onSubmit={handleSubmit}>
            <input type="hidden" name="adId" value={adId} />
            <button
                type="submit"
                className="p-2 hover:bg-red-100 text-red-600 rounded disabled:opacity-50"
                title="Delete"
                disabled={isDeleting}
            >
                <Trash2 size={18} />
            </button>
        </form>
    );
}
