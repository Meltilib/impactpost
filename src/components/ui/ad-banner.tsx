import { cn } from '@/lib/utils';

interface AdBannerProps {
  className?: string;
  format?: 'leaderboard' | 'sidebar' | 'feed';
  label?: string;
}

export function AdBanner({ className, format = 'leaderboard', label = 'Advertisement' }: AdBannerProps) {
  // Mock data for different ad slots to make them look realistic
  const adContent = {
    leaderboard: {
      title: "Global Diaspora Summit 2025",
      subtitle: "Connecting Communities • Toronto Convention Centre",
      cta: "Register Now",
      bg: "bg-[#1a1a1a]",
      text: "text-white",
      accent: "text-brand-yellow",
      border: "border-brand-yellow"
    },
    sidebar: {
      title: "Taste of East Africa",
      subtitle: "Authentic Spices & Goods Delivered",
      cta: "Shop Local",
      bg: "bg-brand-teal",
      text: "text-white",
      accent: "text-brand-yellow",
      border: "border-black"
    },
    feed: {
      title: "Support Independent Journalism",
      subtitle: "Join our Patreon community today",
      cta: "Support Us",
      bg: "bg-brand-coral",
      text: "text-white",
      accent: "text-white",
      border: "border-black"
    }
  };

  const content = adContent[format];

  return (
    <div className={cn(
      'relative flex flex-col items-center justify-center p-6 text-center overflow-hidden group cursor-pointer transition-all hover:shadow-hard-lg',
      'border-2 border-black shadow-hard',
      content.bg,
      content.text,
      className
    )}>
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      <div className={`absolute -right-8 -top-8 w-24 h-24 rounded-full border-4 ${content.border} opacity-20`} />
      <div className={`absolute -left-8 -bottom-8 w-32 h-32 rounded-full border-8 ${content.border} opacity-10`} />

      {/* Advertisement Label */}
      <span className="absolute top-2 right-2 text-[10px] uppercase font-bold tracking-widest opacity-60">
        {label}
      </span>

      {/* Ad Content */}
      <div className="relative z-10 flex flex-col items-center gap-2">
        <h3 className={cn("font-heavy text-2xl md:text-3xl uppercase leading-none", content.accent)}>
          {content.title}
        </h3>
        <p className="font-medium opacity-90 text-sm md:text-base max-w-md">
          {content.subtitle}
        </p>
        <span className={cn(
          "mt-3 px-4 py-2 text-xs font-bold uppercase tracking-wider border-2 transition-transform group-hover:scale-105",
          format === 'leaderboard' ? "bg-brand-yellow text-black border-black" : "bg-white text-black border-black"
        )}>
          {content.cta}
        </span>
      </div>
    </div>
  );
}
