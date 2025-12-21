'use client';

import { useState } from 'react';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { cn, isValidEmail } from '@/lib/utils';
import { sendGAEvent } from '@next/third-parties/google';

interface NewsletterFormProps {
    title?: string;
    description?: string;
    className?: string;
}

export function NewsletterForm({
    title = 'Subscribe to the Newsletter',
    description = 'Stay connected with your community. Weekly updates on events, news, and opportunities.',
    className = "bg-brand-purple p-6 border-2 border-white shadow-[8px_8px_0px_white]"
}: NewsletterFormProps) {
    const [email, setEmail] = useState('');
    const [honeypot, setHoneypot] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'duplicate' | 'error'>('idle');
    const [message, setMessage] = useState('');
    const [suggestion, setSuggestion] = useState<string | null>(null);
    const [submittedEmail, setSubmittedEmail] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setSuggestion(null);

        if (!isValidEmail(email)) {
            setStatus('error');
            setMessage('Enter a valid email address.');
            return;
        }

        setStatus('loading');
        setMessage('');

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
                if (data?.suggestion) {
                    setSuggestion(data.suggestion);
                    setStatus('error');
                    setMessage('That email looks mistyped. Tap to accept the suggestion below.');
                    return;
                }
                throw new Error(data.error || 'Something went wrong');
            }

            const isDuplicate = Boolean(data?.isDuplicate);
            const apiMessage = typeof data?.message === 'string'
                ? data.message
                : isDuplicate
                    ? 'You are already subscribed!'
                    : 'Thank you for subscribing!';

            setStatus(isDuplicate ? 'duplicate' : 'success');
            setMessage(apiMessage);
            setSubmittedEmail(email);
            setEmail('');

            // Track successful signup (non-duplicate)
            if (!isDuplicate) {
                sendGAEvent({
                    event: 'newsletter_signup',
                    category: 'conversion',
                    label: 'homepage_sidebar' // Assuming default/location
                });
            }
        } catch (error: unknown) {
            setStatus('error');
            setMessage(error instanceof Error ? error.message : 'An error occurred');
        }
    };

    if (status === 'success' || status === 'duplicate') {
        return (
            <div className={cn(className, 'animate-in fade-in zoom-in-95 duration-300')}>
                <div className="flex flex-col items-center text-center gap-3 py-4">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-brand-purple mb-2">
                        <CheckCircle size={28} />
                    </div>
                    <div className="text-center">
                        <h4 className="text-2xl font-heavy italic text-white mb-2">
                            {status === 'duplicate' ? "YOU'RE ALREADY SUBSCRIBED" : "YOU'RE IN!"}
                        </h4>
                        <p className="text-white/90 font-medium">
                            {message || (status === 'duplicate'
                                ? "You're already on the list."
                                : "Thanks for subscribing. Welcome to the community.")}
                        </p>
                        {submittedEmail && (
                            <p className="text-white/70 text-sm mt-2">
                                Sent to <span className="font-bold">{submittedEmail}</span>
                            </p>
                        )}
                    </div>
                    <button
                        onClick={() => {
                            setStatus('idle');
                            setMessage('');
                            if (submittedEmail) setEmail(submittedEmail);
                        }}
                        className="text-xs text-white/60 hover:text-white mt-4 underline decoration-dashed"
                    >
                        Fix email / subscribe another
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={className}>
            <h4 className="font-heavy text-2xl mb-2 leading-tight">{title}</h4>
            <p className="text-white/80 mb-4 text-sm">
                {description}
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
                        <span>{message}</span>
                    </div>
                )}

                {suggestion && (
                    <button
                        type="button"
                        onClick={() => {
                            setEmail(suggestion);
                            setSuggestion(null);
                            setMessage('');
                            setStatus('idle');
                        }}
                        className="text-left text-sm font-bold text-white underline decoration-dashed"
                    >
                        Use suggested email: {suggestion}
                    </button>
                )}

                <p className="text-[10px] text-white/50 mt-2">
                    Protected by smart anti-spam measures.
                </p>
            </form>
        </div>
    );
}
