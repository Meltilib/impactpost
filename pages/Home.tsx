import React from 'react';
import { ArticleCard } from '../components/ArticleCard';
import { Button } from '../components/Button';
import { FEATURED_STORY, RECENT_STORIES, EVENTS } from '../data';
import { ArrowRight, Mic, Play, Calendar, Users, Briefcase, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Home: React.FC = () => {
  return (
    <div className="animate-in fade-in duration-700">
      
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Feature */}
          <div className="lg:col-span-8">
            <ArticleCard story={FEATURED_STORY} featured />
          </div>
          
          {/* Sidebar / Top Picks */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-brand-yellow p-6 border-2 border-black shadow-hard relative overflow-hidden">
               <div className="absolute -right-4 -top-4 w-20 h-20 bg-white rounded-full opacity-50 blur-xl"></div>
              <h3 className="font-heavy text-2xl mb-4 uppercase">Community Pulse</h3>
              <div className="flex flex-col divide-y-2 divide-black/10">
                {RECENT_STORIES.slice(0, 3).map(story => (
                  <ArticleCard key={story.id} story={story} minimal />
                ))}
              </div>
            </div>
            
            {/* Newsletter Mini */}
            <div className="bg-brand-purple text-white p-6 border-2 border-black shadow-hard">
               <h3 className="font-bold text-xl mb-2">Join the Diaspora Network</h3>
               <p className="text-sm mb-4 opacity-90">Get the latest on community events, businesses, and stories.</p>
               <div className="flex gap-2">
                 <input className="w-full p-2 text-black font-bold outline-none border-2 border-transparent focus:border-brand-yellow" placeholder="Email address" />
                 <button className="bg-brand-coral border-2 border-white p-2 hover:bg-white hover:text-brand-coral transition-colors font-bold">→</button>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pillars Section */}
      <section className="bg-white border-y-2 border-black py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="bg-brand-coral text-white px-3 py-1 font-bold text-sm uppercase tracking-widest mb-2 inline-block shadow-hard-sm">Browse by Pillar</span>
              <h2 className="font-heavy text-4xl md:text-5xl">Our Focus Areas</h2>
            </div>
            <Link to="/section/news" className="hidden md:flex items-center gap-2 font-bold hover:underline">View All Categories <ArrowRight size={20}/></Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {['Community Voices', 'Youth & Leadership', 'Business', 'Culture'].map((cat, idx) => (
               <Link to={`/section/${cat.split(' ')[0].toLowerCase()}`} key={idx} className="group cursor-pointer relative block">
                  <div className={`h-48 border-2 border-black shadow-hard p-6 flex flex-col justify-between transition-all group-hover:-translate-y-2 group-hover:shadow-hard-lg
                    ${idx === 0 ? 'bg-brand-purple text-white' : ''}
                    ${idx === 1 ? 'bg-brand-teal' : ''}
                    ${idx === 2 ? 'bg-brand-blue text-white' : ''}
                    ${idx === 3 ? 'bg-brand-yellow' : ''}
                  `}>
                    <div className="flex justify-between items-start">
                      {idx === 0 && <Users size={32} />}
                      {idx === 1 && <ArrowRight size={32} className="-rotate-45" />}
                      {idx === 2 && <Briefcase size={32} />}
                      {idx === 3 && <Mic size={32} />}
                    </div>
                    <h3 className="font-display font-bold text-2xl leading-none">{cat}</h3>
                  </div>
               </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Stories Section */}
      <section className="container mx-auto px-4 py-16">
          <div className="mb-10">
            <h2 className="font-heavy text-4xl md:text-5xl mb-3">Latest Stories</h2>
            <p className="text-xl text-gray-600 font-medium">Voices from across the Canadian-Somali diaspora</p>
            <div className="h-1.5 bg-black mt-6 w-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
            {RECENT_STORIES.map(story => (
              <ArticleCard key={story.id} story={story} />
            ))}
          </div>
      </section>

      {/* Youth Hub Section */}
      <section id="youth" className="py-20 bg-[#1a1a1a] text-white relative overflow-hidden">
        {/* Abstract shapes */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-teal rounded-full blur-[100px] opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-purple rounded-full blur-[100px] opacity-30"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row gap-12 items-center mb-16">
            <div className="md:w-1/2">
              <h2 className="font-heavy text-6xl mb-6 leading-tight">YOUTH <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-yellow to-brand-coral">HUB</span></h2>
              <p className="text-xl text-gray-300 mb-8 border-l-4 border-brand-teal pl-6">
                Celebrating the achievements of Somali-Canadian youth, from tech innovators to spoken word artists.
              </p>
              <div className="flex gap-4">
                <Button variant="accent" size="lg">Submit a Story</Button>
                <Link to="/section/youth"><Button variant="outline" className="text-white border-white hover:bg-white hover:text-black">View All Youth Stories</Button></Link>
              </div>
            </div>
            <div className="md:w-1/2 grid grid-cols-2 gap-4">
               <img src="https://picsum.photos/400/500?random=20" className="rounded-xl border-4 border-brand-yellow -rotate-3 hover:rotate-0 transition-transform duration-300 w-full h-64 object-cover" alt="Youth" />
               <img src="https://picsum.photos/400/500?random=21" className="rounded-xl border-4 border-brand-teal rotate-6 hover:rotate-0 transition-transform duration-300 w-full h-64 object-cover translate-y-8" alt="Youth" />
            </div>
          </div>
        </div>
      </section>

      {/* Multimedia & Events Grid */}
      <section className="py-16 container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Multimedia */}
          <div className="lg:col-span-2">
            <div className="flex justify-between items-end mb-8">
               <h2 className="font-heavy text-4xl">Multimedia Stories</h2>
               <Link to="/section/multimedia" className="font-bold text-brand-purple hover:underline">Watch & Listen</Link>
            </div>
            <Link to="/section/multimedia" className="block relative group cursor-pointer">
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors z-10 flex items-center justify-center">
                 <div className="bg-brand-coral text-white p-4 rounded-full shadow-hard transition-transform group-hover:scale-110">
                    <Play size={32} fill="currentColor" />
                 </div>
              </div>
              <img src="https://picsum.photos/800/450?random=107" className="w-full h-[400px] object-cover border-2 border-black shadow-hard" alt="Video cover" />
              <div className="absolute bottom-0 left-0 bg-white border-t-2 border-r-2 border-black p-4 max-w-md z-20">
                <span className="text-brand-coral font-bold uppercase text-xs mb-1 block">Documentary</span>
                <h3 className="font-bold text-xl">The Somalis of Yellowknife</h3>
              </div>
            </Link>
          </div>

          {/* Events Sidebar */}
          <div className="lg:col-span-1">
             <div className="bg-brand-light border-2 border-black p-0 shadow-hard">
               <div className="bg-black text-white p-4 flex justify-between items-center">
                 <h3 className="font-heavy text-xl uppercase">Events Calendar</h3>
                 <Calendar size={20} />
               </div>
               <div className="divide-y-2 divide-black">
                 {EVENTS.map(event => (
                   <div key={event.id} className="p-4 hover:bg-brand-yellow/10 transition-colors group cursor-pointer">
                     <div className="flex items-start gap-4">
                        <div className="bg-brand-light border-2 border-black p-2 text-center min-w-[60px] shadow-hard-sm group-hover:bg-white">
                          <span className="block text-xs font-bold uppercase text-gray-500">{event.date.split(' ')[0]}</span>
                          <span className="block text-xl font-heavy">{event.date.split(' ')[1].replace(',','')}</span>
                        </div>
                        <div>
                          <h4 className="font-bold text-lg leading-tight mb-1 group-hover:text-brand-purple">{event.title}</h4>
                          <p className="text-sm text-gray-600">{event.location} • {event.type}</p>
                        </div>
                     </div>
                   </div>
                 ))}
               </div>
               <div className="p-4 bg-gray-50 text-center">
                 <Link to="/section/community">
                    <Button variant="ghost" size="sm" fullWidth>View Full Calendar</Button>
                 </Link>
               </div>
             </div>
          </div>
        </div>
      </section>

      {/* Support Banner */}
      <section className="bg-brand-purple text-white py-16 border-t-2 border-black">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <Heart size={48} fill="currentColor" className="mx-auto mb-6 text-brand-coral animate-pulse" />
          <h2 className="font-heavy text-4xl md:text-5xl mb-6">Support Independent Somali Media</h2>
          <p className="text-xl mb-8 opacity-90">
            IMPACT POST relies on the generosity of our readers. Help us keep our stories free and accessible to our community across Canada.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
             <Button variant="accent" size="lg">Become a Member</Button>
             <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-black">Donate Once</Button>
          </div>
        </div>
      </section>

    </div>
  );
};