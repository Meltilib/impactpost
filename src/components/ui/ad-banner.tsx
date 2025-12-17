'use client';

import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { ArrowUpRight } from 'lucide-react';

type BannerFormat = 'leaderboard' | 'sidebar' | 'feed';

interface AdBannerProps {
  className?: string;
  format?: BannerFormat;
  label?: string;
  href?: string;
  ariaLabel?: string;
  newTab?: boolean;
}

const AD_CONTENT: Record<BannerFormat, {
  brand: string;
  title: string;
  subtitle: string;
  cta: string;
  bg: string;
  text: string;
  accent: string;
  border: string;
  pattern: React.ReactNode;
  image?: string;
}> = {
  leaderboard: {
    brand: 'HORIZON BANKING',
    title: 'Future-Proof Your Wealth',
    subtitle: 'Exclusive investment portfolios for the modern diaspora.',
    cta: 'Get Started',
    bg: 'bg-gradient-to-r from-[#0f172a] to-[#1e293b]',
    text: 'text-white',
    accent: 'text-amber-400',
    border: 'border-amber-500/30',
    pattern: (
      <>
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fbbf24_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-amber-500/10 to-transparent" />
      </>
    ),
    image: '/images/ads/horizon-banking.png',
  },
  sidebar: {
    brand: 'LUMINA GALLERY',
    title: 'Abstract Realities',
    subtitle: 'New Exhibition: Oct 15 - Nov 30',
    cta: 'View Tickets',
    bg: 'bg-white',
    text: 'text-black',
    accent: 'text-white',
    border: 'border-black',
    pattern: (
      <>
        <div className="absolute top-0 right-0 w-32 h-32 bg-black rounded-full blur-[60px] opacity-10" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gray-200 rounded-full blur-[40px] opacity-40" />
        <div className="absolute inset-0 border-4 border-black m-1 opacity-10" />
      </>
    ),
    image: '/images/ads/lumina-gallery.png',
  },
  feed: {
    brand: 'TechNova 2025',
    title: 'Innovate. Disrupt. Scale.',
    subtitle: 'The premier tech summit returns to Toronto.',
    cta: 'Reserve Seat',
    bg: 'bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900',
    text: 'text-white',
    accent: 'text-cyan-300',
    border: 'border-cyan-500/30',
    pattern: (
      <>
        <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] [background-size:24px_24px]" />
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl" />
      </>
    ),
    image: '/images/ads/technova-summit.png',
  },
};

export function AdBanner({
  className,
  format = 'leaderboard',
  label = 'Sponsored',
  href,
  ariaLabel,
  newTab,
}: AdBannerProps) {
  const content = AD_CONTENT[format];
  const isInteractive = Boolean(href);

  // Default mock link if none provided, to demonstrate hover states
  const targetHref = href || '#';
  const isDemoLink = !href;

  // Sizes based on format
  const sizeClasses = {
    leaderboard: 'w-full min-h-[120px]',
    sidebar: 'w-full h-[250px]',
    feed: 'w-full min-h-[300px]',
  };

  const wrapperClasses = cn(
    'relative flex flex-col items-center justify-center p-6 text-center overflow-hidden group transition-all border-2 shadow-hard',
    isInteractive || isDemoLink
      ? 'cursor-pointer hover:shadow-hard-lg hover:-translate-y-0.5'
      : 'cursor-default',
    content.bg,
    content.text,
    content.border,
    sizeClasses[format], // Apply size classes here
    className
  );

  const contentBody = (
    <>
      {/* Background Image */}
      {content.image && (
        <div className="absolute inset-0 z-0">
          <Image
            src={content.image}
            alt=""
            fill
            className="object-cover opacity-60 mix-blend-overlay"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
      )}

      {/* Background Pattern */}
      <div className="absolute inset-0 z-0">{content.pattern}</div>

      {/* Label */}
      <div className="absolute top-3 right-3 z-20 flex items-center gap-1 opacity-80">
        <span className="text-[10px] uppercase font-bold tracking-widest bg-black/50 backdrop-blur-sm px-1.5 py-0.5 rounded text-white border border-white/20">
          {label}
        </span>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-1 w-full drop-shadow-md">
        <span className={cn('text-xs font-bold tracking-[0.2em] uppercase mb-1 opacity-90', content.accent)}>
          {content.brand}
        </span>

        <h3 className={cn('font-heavy text-2xl md:text-3xl uppercase leading-none text-center mb-2', content.text)}>
          {content.title}
        </h3>

        <p className={cn('font-display font-medium text-sm md:text-base max-w-md mb-4 opacity-95', content.text)}>
          {content.subtitle}
        </p>

        <span
          className={cn(
            'inline-flex items-center gap-2 px-5 py-2 text-xs font-bold uppercase tracking-wider border-2 transition-all group-hover:gap-3',
            'bg-white/10 backdrop-blur-sm text-white border-white/50 hover:bg-white hover:text-black hover:border-white'
          )}
        >
          {content.cta}
          <ArrowUpRight size={14} />
        </span>
      </div>
    </>
  );

  const Component = isInteractive || isDemoLink ? Link : 'div';
  const linkProps = (isInteractive || isDemoLink) ? {
    href: targetHref,
    target: newTab ? '_blank' : undefined,
    rel: newTab ? 'noreferrer noopener' : undefined,
    'aria-label': ariaLabel ?? `${label} banner`,
    onClick: isDemoLink ? (e: React.MouseEvent) => e.preventDefault() : undefined,
  } : {
    role: 'region',
    'aria-label': ariaLabel ?? `${label} banner`,
  };

  return (
    // @ts-expect-error - dynamic component props
    <Component className={wrapperClasses} {...linkProps}>
      {contentBody}
    </Component>
  );
}
