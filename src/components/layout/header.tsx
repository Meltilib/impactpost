'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Search, Heart, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NAV_ITEMS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { useBookmarks } from '@/hooks/use-bookmarks';

function BookmarkHeaderAction() {
  const { bookmarks, isInitialized } = useBookmarks();

  if (!isInitialized) return null;

  return (
    <Link href="/saved" className="relative group p-2 hover:bg-gray-100 rounded-full transition-colors">
      <BookOpen size={20} className="group-hover:text-brand-purple transition-colors" />
      {bookmarks.length > 0 && (
        <span className="absolute -top-1 -right-1 bg-brand-coral text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-in zoom-in">
          {bookmarks.length}
        </span>
      )}
    </Link>
  );
}

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 bg-brand-light border-b-2 border-black">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 border-2 border-black shadow-hard-sm active:shadow-none active:translate-y-1 transition-all"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Logo */}
          <Link
            href="/"
            className="text-3xl md:text-4xl font-heavy italic tracking-tighter text-black hover:text-brand-purple transition-colors"
          >
            IMPACT<span className="text-brand-coral">POST</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6 font-bold text-sm uppercase tracking-wide">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  'hover:text-brand-purple hover:underline decoration-4 decoration-brand-yellow underline-offset-4 transition-all',
                  pathname === item.href && 'text-brand-purple underline decoration-brand-yellow'
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <BookmarkHeaderAction />
            <button
              className="p-2 hover:bg-gray-100 rounded-full transition-colors hidden sm:block"
              aria-label="Search"
            >
              <Search size={20} />
            </button>
            <Link href="/support">
              <Button size="sm" variant="accent" className="hidden sm:flex gap-2">
                <Heart size={16} fill="currentColor" /> Support
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-brand-light border-b-2 border-black shadow-hard-lg p-4 animate-in slide-in-from-top-2">
          <nav className="flex flex-col gap-4">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-xl font-bold uppercase border-b border-dashed border-gray-300 pb-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="grid grid-cols-2 gap-4 mt-4">
              <Button variant="secondary" fullWidth>Subscribe</Button>
              <Link href="/support" className="w-full">
                <Button variant="primary" fullWidth>Donate</Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
