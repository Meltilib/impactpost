import React from 'react';
import { useParams } from 'react-router-dom';
import { ArticleCard } from '../components/ArticleCard';
import { RECENT_STORIES, FEATURED_STORY } from '../data';
import { Button } from '../components/Button';

export const SectionPage: React.FC = () => {
  const { category } = useParams<{ category: string }>();

  // Helper to map route param to data categories
  const getFilteredStories = (cat?: string) => {
    const allStories = [FEATURED_STORY, ...RECENT_STORIES];
    if (!cat || cat === 'news') return allStories;
    
    // Custom mappings
    if (cat === 'voices') return allStories.filter(s => s.category === 'Community Voices' || s.category === 'Issues');
    if (cat === 'community') return allStories.filter(s => s.category === 'Culture' || s.category === 'Business' || s.category === 'Wellness');
    if (cat === 'youth') return allStories.filter(s => s.category === 'Youth');
    if (cat === 'multimedia') return allStories.filter(s => s.category === 'Multimedia');
    
    return allStories;
  };

  const stories = getFilteredStories(category);

  // Dynamic titles and colors
  const getSectionInfo = (cat?: string) => {
    switch(cat) {
      case 'voices': return { title: 'Community Voices', desc: 'Stories that amplify the diverse experiences of our people.', color: 'bg-brand-purple' };
      case 'youth': return { title: 'Youth Hub', desc: 'Spotlighting the next generation of leaders and creators.', color: 'bg-brand-teal' };
      case 'multimedia': return { title: 'Multimedia', desc: 'Visual storytelling, documentaries, and photo essays.', color: 'bg-brand-coral' };
      case 'community': return { title: 'Community & Culture', desc: 'Celebrating our heritage, businesses, and wellness.', color: 'bg-brand-yellow' };
      default: return { title: 'Latest News', desc: 'Breaking news and updates from across the diaspora.', color: 'bg-brand-blue' };
    }
  };

  const info = getSectionInfo(category);

  return (
    <div className="animate-in fade-in duration-500">
      {/* Header */}
      <div className={`${info.color} text-white border-b-2 border-black py-16`}>
        <div className="container mx-auto px-4">
           <h1 className="font-heavy text-5xl md:text-7xl mb-4 uppercase">{info.title}</h1>
           <p className="text-xl md:text-2xl font-display opacity-90 max-w-2xl">{info.desc}</p>
        </div>
      </div>

      {/* Content Grid */}
      <div className="container mx-auto px-4 py-16">
         {stories.length > 0 ? (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {stories.map(story => (
                <ArticleCard key={story.id} story={story} />
              ))}
           </div>
         ) : (
           <div className="text-center py-20">
             <h3 className="font-bold text-2xl mb-4">No stories found in this section yet.</h3>
             <p className="text-gray-600 mb-8">We are constantly working on new content.</p>
             <Button>Back to Home</Button>
           </div>
         )}
      </div>
    </div>
  );
};