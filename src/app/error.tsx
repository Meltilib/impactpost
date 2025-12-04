'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-2xl">
        <div className="w-20 h-20 bg-brand-coral text-white flex items-center justify-center mx-auto mb-6 border-2 border-black shadow-hard text-4xl font-heavy">
          !
        </div>
        <h1 className="font-heavy text-4xl md:text-5xl mb-4">
          Something Went Wrong
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          We encountered an unexpected error. Please try again.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button size="lg" onClick={() => reset()}>
            Try Again
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            onClick={() => window.location.href = '/'}
          >
            Go Home
          </Button>
        </div>
      </div>
    </div>
  );
}
