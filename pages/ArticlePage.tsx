import React from 'react';
import { useParams } from 'react-router-dom';
import { FEATURED_STORY, RECENT_STORIES } from '../data';
import { Clock, Share2, Bookmark, MessageCircle, Twitter, Facebook, Linkedin } from 'lucide-react';
import { Button } from '../components/Button';
import { ArticleCard } from '../components/ArticleCard';

export const ArticlePage: React.FC = () => {
  const { id } = useParams();
  
  // In a real app, fetch by ID. Using mock for now.
  const story = id === '1' ? FEATURED_STORY : RECENT_STORIES.find(s => s.id === id) || RECENT_STORIES[0];

  return (
    <div className="animate-in fade-in duration-500">
      
      {/* Article Header */}
      <div className="bg-brand-light border-b-2 border-black pt-12 pb-8">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <span className="bg-brand-purple text-white px-3 py-1 font-bold text-sm uppercase tracking-widest shadow-hard-sm mb-6 inline-block">
            {story.category}
          </span>
          <h1 className="font-heavy text-4xl md:text-6xl leading-tight mb-6 text-brand-dark">
            {story.title}
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 font-display font-medium leading-relaxed mb-8">
            {story.excerpt}
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-sm text-gray-500 border-t border-b border-gray-300 py-4 max-w-2xl mx-auto">
             <div className="flex items-center gap-3">
               <img src={story.author.avatarUrl} alt={story.author.name} className="w-10 h-10 rounded-full border border-black" />
               <div className="text-left">
                 <span className="block font-bold text-black">{story.author.name}</span>
                 <span className="block text-xs uppercase tracking-wide">{story.author.role}</span>
               </div>
             </div>
             <div className="hidden md:block w-px h-8 bg-gray-300"></div>
             <div className="flex items-center gap-6">
                <span>{story.date}</span>
                <span className="flex items-center gap-1"><Clock size={16} /> {story.readTime}</span>
             </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container mx-auto px-4 py-12 max-w-6xl flex flex-col lg:flex-row gap-12">
        
        {/* Social Sidebar (Sticky) */}
        <div className="lg:w-24 flex-shrink-0">
           <div className="sticky top-24 flex lg:flex-col gap-4 justify-center lg:justify-start">
             <button className="w-10 h-10 rounded-full bg-white border-2 border-black flex items-center justify-center shadow-hard-sm hover:translate-x-1 hover:shadow-none transition-all text-blue-400"><Twitter size={18} /></button>
             <button className="w-10 h-10 rounded-full bg-white border-2 border-black flex items-center justify-center shadow-hard-sm hover:translate-x-1 hover:shadow-none transition-all text-blue-700"><Facebook size={18} /></button>
             <button className="w-10 h-10 rounded-full bg-white border-2 border-black flex items-center justify-center shadow-hard-sm hover:translate-x-1 hover:shadow-none transition-all text-blue-600"><Linkedin size={18} /></button>
             <div className="w-full h-px bg-gray-300 my-2 hidden lg:block"></div>
             <button className="w-10 h-10 rounded-full bg-white border-2 border-black flex items-center justify-center shadow-hard-sm hover:translate-x-1 hover:shadow-none transition-all"><Bookmark size={18} /></button>
           </div>
        </div>

        {/* Article Body */}
        <div className="flex-grow max-w-3xl">
          <figure className="mb-12 relative">
             <img src={story.imageUrl} className="w-full h-auto border-2 border-black shadow-hard-lg" alt="Main article" />
             <figcaption className="text-sm text-gray-500 mt-3 italic text-right border-r-4 border-brand-yellow pr-3">
               Photo by Freelance Photographer / Impact Post
             </figcaption>
          </figure>

          <article className="prose prose-lg md:prose-xl prose-headings:font-display prose-headings:font-bold prose-p:font-sans prose-img:rounded-xl prose-img:shadow-hard first-letter:text-5xl first-letter:font-heavy first-letter:text-brand-purple first-letter:mr-2 first-letter:float-left">
            <p className="lead font-bold text-gray-800">
              Community resilience is not just a buzzword here; it's the foundation upon which this neighborhood was rebuilt. Walking down 4th street, you can feel the energy shift.
            </p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            </p>
            <h3>A New Approach to Local Leadership</h3>
            <p>
              Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam.
            </p>
            <blockquote className="border-l-4 border-brand-coral pl-6 italic text-2xl font-display my-8 bg-gray-50 p-4 rounded-r-xl">
              "We aren't waiting for permission to change our reality. We are building the future we deserve, brick by brick."
            </blockquote>
            <p>
              Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet.
            </p>
            <div className="bg-brand-teal/10 p-6 border-l-4 border-brand-teal my-8">
               <h4 className="font-bold text-brand-teal uppercase tracking-widest text-sm mb-2">Key Takeaways</h4>
               <ul className="list-disc list-inside space-y-2">
                 <li>Local funding has increased by 40% since the initiative started.</li>
                 <li>Youth engagement programs are now mandatory in 3 district schools.</li>
                 <li>The community garden provides 500lbs of produce monthly.</li>
               </ul>
            </div>
            <p>
              Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur.
            </p>
          </article>

          {/* Tags */}
          <div className="mt-12 pt-8 border-t-2 border-black flex flex-wrap gap-2">
            <span className="font-bold mr-2 my-auto">Tags:</span>
            {['Community', 'Leadership', 'Food Justice', 'Urban Farming'].map(tag => (
              <span key={tag} className="px-3 py-1 bg-gray-100 border border-black rounded-full text-sm hover:bg-brand-yellow cursor-pointer transition-colors">#{tag}</span>
            ))}
          </div>

          {/* Author Box */}
          <div className="mt-12 p-8 bg-brand-light border-2 border-black shadow-hard flex flex-col md:flex-row gap-6 items-center md:items-start">
             <img src={story.author.avatarUrl} className="w-20 h-20 rounded-full border-2 border-black" alt={story.author.name} />
             <div className="text-center md:text-left">
               <h3 className="font-bold text-xl mb-2">About {story.author.name}</h3>
               <p className="text-gray-600 mb-4">
                 Senior Reporter covering equity, housing, and food justice. Previously wrote for The City Chronicle.
               </p>
               <Button size="sm" variant="outline">View all articles</Button>
             </div>
          </div>

        </div>
      </div>

      {/* Read Next Section */}
      <section className="bg-gray-100 py-16 border-t-2 border-black">
        <div className="container mx-auto px-4">
          <h3 className="font-heavy text-3xl mb-8">Read Next</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {RECENT_STORIES.slice(1, 4).map(related => (
              <ArticleCard key={related.id} story={related} />
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};