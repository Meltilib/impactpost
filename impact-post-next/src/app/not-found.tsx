import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-2xl">
        <div className="font-heavy text-[150px] md:text-[200px] leading-none text-brand-purple/20">
          404
        </div>
        <h1 className="font-heavy text-4xl md:text-5xl mb-4 -mt-12">
          Page Not Found
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/">
            <Button size="lg">Go Home</Button>
          </Link>
          <Link href="/news">
            <Button variant="outline" size="lg">Browse News</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
