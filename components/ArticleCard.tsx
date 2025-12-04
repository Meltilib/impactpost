import React from 'react';
import { Story } from '../types';
import { Clock, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ArticleCardProps {
  story: Story;
  featured?: boolean;
  minimal?: boolean;
}

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'Community Voices': return 'bg-brand-purple text-white';
    case 'Youth': return 'bg-brand-teal text-black';
    case 'Business': return 'bg-brand-blue text-white';
    case 'Culture': return 'bg-brand-coral text-white';
    case 'Wellness': return 'bg-brand-yellow text-black';
    default: return 'bg-black text-white';
  }
};

export const ArticleCard: React.FC<ArticleCardProps> = ({ story, featured = false, minimal = false }) => {
  if (minimal) {
    return (
      <Link to={`/article/${story.id}`} className="group block border-b-2 border-black py-4 hover:bg-white transition-colors">
        <div className="flex justify-between items-start gap-4">
          <div>
            <span className={`inline-block px-2 py-0.5 text-xs font-bold uppercase mb-2 ${getCategoryColor(story.category)}`}>
              {story.category}
            </span>
            <h3 className="text-lg font-bold leading-tight group-hover:text-brand-purple transition-colors">
              {story.title}
            </h3>
            <div className="flex items-center text-xs text-gray-500 mt-2 gap-2">
              <span>{story.date}</span>
              <span>•</span>
              <span className="flex items-center gap-1"><Clock size={12} /> {story.readTime}</span>
            </div>
          </div>
          {story.imageUrl && (
            <img 
              src={story.imageUrl} 
              alt={story.title} 
              className="w-24 h-24 object-cover border-2 border-black shadow-hard-sm flex-shrink-0"
            />
          )}
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/article/${story.id}`} className={`group block h-full flex flex-col ${featured ? 'md:grid md:grid-cols-2 md:gap-8' : ''}`}>
      <div className={`relative overflow-hidden border-2 border-black shadow-hard group-hover:shadow-hard-lg transition-all ${featured ? 'h-full min-h-[400px]' : 'h-64'} mb-4`}>
        <img 
          src={story.imageUrl} 
          alt={story.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1 font-bold text-sm border-2 border-black shadow-hard-sm ${getCategoryColor(story.category)}`}>
            {story.category}
          </span>
        </div>
      </div>
      
      <div className={`flex flex-col flex-grow ${featured ? 'justify-center' : ''}`}>
        <div className="flex items-center gap-2 mb-2">
          <img src={story.author.avatarUrl} alt={story.author.name} className="w-8 h-8 rounded-full border border-black" />
          <div className="text-sm font-medium">
            <span className="block font-bold">{story.author.name}</span>
          </div>
        </div>
        
        <h3 className={`font-display font-bold leading-tight mb-3 group-hover:text-brand-purple transition-colors ${featured ? 'text-4xl md:text-5xl' : 'text-xl'}`}>
          {story.title}
        </h3>
        
        <p className={`text-gray-700 mb-4 line-clamp-3 ${featured ? 'text-xl' : 'text-sm'}`}>
          {story.excerpt}
        </p>

        <div className="mt-auto flex items-center justify-between border-t-2 border-dashed border-gray-300 pt-3">
          <div className="flex items-center text-sm text-gray-500 gap-4">
            <span>{story.date}</span>
            <span className="flex items-center gap-1"><Clock size={14} /> {story.readTime}</span>
          </div>
          <span className="p-2 bg-black text-white rounded-full group-hover:bg-brand-coral transition-colors">
            <ArrowUpRight size={16} />
          </span>
        </div>
      </div>
    </Link>
  );
};