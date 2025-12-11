import Link from 'next/link';
import Image from 'next/image';
import { Clock, ArrowUpRight } from 'lucide-react';
import { Story } from '@/types';
import { cn, getCategoryColor } from '@/lib/utils';

interface ArticleCardProps {
  story: Story;
  featured?: boolean;
  minimal?: boolean;
}

export function ArticleCard({ story, featured = false, minimal = false }: ArticleCardProps) {
  const articleUrl = `/news/${story.slug}`;

  if (minimal) {
    return (
      <Link 
        href={articleUrl} 
        className="group block border-b-2 border-black py-4 hover:bg-white transition-colors"
      >
        <div className="flex justify-between items-start gap-4">
          <div>
            <span className={cn(
              'inline-block px-2 py-0.5 text-xs font-bold uppercase mb-2',
              getCategoryColor(story.category)
            )}>
              {story.category}
            </span>
            <h3 className="text-lg font-bold leading-tight group-hover:text-brand-purple transition-colors">
              {story.title}
            </h3>
            <div className="flex items-center text-xs text-gray-500 mt-2 gap-2">
              <span>{story.date}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock size={12} /> {story.readTime}
              </span>
            </div>
          </div>
          {story.imageUrl && (
            <div className="relative w-24 h-24 flex-shrink-0 border-2 border-black shadow-hard-sm overflow-hidden">
              <Image
                src={story.imageUrl}
                alt={story.title}
                fill
                className="object-cover"
                sizes="96px"
              />
            </div>
          )}
        </div>
      </Link>
    );
  }

  return (
    <Link 
      href={articleUrl} 
      className={cn(
        'group block h-full flex flex-col',
        featured && 'md:grid md:grid-cols-2 md:gap-8'
      )}
    >
      <div className={cn(
        'relative overflow-hidden border-2 border-black shadow-hard group-hover:shadow-hard-lg transition-all mb-4',
        featured ? 'h-full min-h-[320px] md:min-h-[420px]' : 'h-64'
      )}>
        <Image
          src={story.imageUrl}
          alt={story.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes={featured ? '(max-width: 768px) 100vw, 66vw' : '(max-width: 768px) 100vw, 25vw'}
          priority={featured}
        />
        <div className="absolute top-4 left-4">
          <span className={cn(
            'px-3 py-1 font-bold text-sm border-2 border-black shadow-hard-sm',
            getCategoryColor(story.category)
          )}>
            {story.category}
          </span>
        </div>
      </div>
      
      <div className={cn('flex flex-col flex-grow', featured && 'justify-center')}>
        <div className="flex items-center gap-2 mb-2">
          <div className="relative w-8 h-8 rounded-full border border-black overflow-hidden">
            <Image
              src={story.author.avatarUrl}
              alt={story.author.name}
              fill
              className="object-cover"
              sizes="32px"
            />
          </div>
          <div className="text-sm font-medium">
            <span className="block font-bold">{story.author.name}</span>
          </div>
        </div>
        
        <h3 className={cn(
          'font-display font-bold leading-tight mb-3 group-hover:text-brand-purple transition-colors',
          featured ? 'text-4xl md:text-5xl' : 'text-xl'
        )}>
          {story.title}
        </h3>
        
        <p className={cn(
          'text-gray-700 mb-4 line-clamp-3',
          featured ? 'text-xl' : 'text-sm'
        )}>
          {story.excerpt}
        </p>

        <div className="mt-auto flex items-center justify-between border-t-2 border-dashed border-gray-300 pt-3">
          <div className="flex items-center text-sm text-gray-500 gap-4">
            <span>{story.date}</span>
            <span className="flex items-center gap-1">
              <Clock size={14} /> {story.readTime}
            </span>
          </div>
          <span className="p-2 bg-black text-white rounded-full group-hover:bg-brand-coral transition-colors">
            <ArrowUpRight size={16} />
          </span>
        </div>
      </div>
    </Link>
  );
}
