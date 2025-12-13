'use client';

import { useState } from 'react';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';

export function NewsletterForm() {
    const [email, setEmail] = useState('');
    const [honeypot, setHoneypot] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        setErrorMessage('');

        try {
            const res = await fetch('/api/newsletter/subscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, honeypot }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Something went wrong');
            }

            setStatus('success');
            setEmail('');
        } catch (error: unknown) {
            setStatus('error');
            setErrorMessage(error instanceof Error ? error.message : 'An error occurred');
        }
    };

    if (status === 'success') {
        return (
            <div className="bg-white/10 p-6 border-2 border-brand-teal rounded-lg animate-in fade-in">
                <div className="flex items-center gap-3 text-brand-yellow mb-2">
                    <CheckCircle size={24} />
                    <h4 className="text-xl font-heavy italic">YOU&apos;RE IN!</h4>
                </div>
                <p className="text-white/90">
                    Thanks for subscribing. Welcome to the community.
                </p>
                <button
                    onClick={() => setStatus('idle')}
                    className="text-sm text-gray-400 hover:text-white mt-4 underline decoration-dashed"
                >
                    Add another email
                </button>
            </div>
        );
    }

    return (
        <div className="bg-brand-purple p-6 border-2 border-white shadow-[8px_8px_0px_white]">
            <h4 className="font-heavy text-2xl mb-2">Subscribe to the Newsletter</h4>
            <p className="text-white/80 mb-4">
                Stay connected with your community. Weekly updates on events, news, and opportunities.
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                {/* Honeypot Field - Hidden from humans */}
                <div className="absolute opacity-0 -z-10 w-0 h-0 overflow-hidden">
                    <input
                        type="text"
                        name="phone_check"
                        value={honeypot}
                        onChange={(e) => setHoneypot(e.target.value)}
                        tabIndex={-1}
                        autoComplete="off"
                    />
                </div>

                <div className="flex gap-2">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Your email"
                        required
                        disabled={status === 'loading'}
                        className="flex-grow px-4 py-2 bg-white text-black font-bold outline-none border-2 border-transparent focus:border-brand-yellow disabled:opacity-50"
                    />
                    <button
                        type="submit"
                        disabled={status === 'loading'}
                        className="bg-black text-white px-4 font-bold border-2 border-black hover:bg-brand-yellow hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[60px] flex items-center justify-center"
                    >
                        {status === 'loading' ? <Loader2 className="animate-spin" size={20} /> : 'GO'}
                    </button>
                </div>

                {status === 'error' && (
                    <div className="flex items-center gap-2 text-brand-coral bg-black/20 p-2 rounded text-sm font-bold mt-2 animate-in slide-in-from-top-1">
                        <AlertCircle size={16} />
                        <span>{errorMessage}</span>
                    </div>
                )}

                <p className="text-[10px] text-white/50 mt-2">
                    Protected by smart anti-spam measures.
                </p>
            </form>
        </div>
    );
}
