import React from 'react';
import { Button } from '../components/Button';

export const AboutPage: React.FC = () => {
  return (
    <div className="animate-in fade-in duration-500">
      
      <div className="bg-brand-light py-20 border-b-2 border-black">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <span className="bg-brand-yellow text-black px-4 py-1 font-bold text-sm uppercase tracking-widest shadow-hard-sm mb-6 inline-block">
            Who We Are
          </span>
          <h1 className="font-heavy text-5xl md:text-7xl mb-8 leading-tight">
            Amplifying the Voices of the <span className="text-brand-purple">Somali Diaspora</span>
          </h1>
          <p className="text-xl text-gray-700 leading-relaxed font-medium">
            IMPACT POST is a digital-first community media platform dedicated to serving the Somali community in Canada. We bridge the gap between generations, celebrating our heritage while tackling the pressing issues of today.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <div className="relative">
              <div className="absolute top-4 left-4 w-full h-full bg-brand-coral border-2 border-black rounded-lg"></div>
              <img src="https://picsum.photos/600/400?random=about1" alt="Community meeting" className="relative z-10 w-full rounded-lg border-2 border-black" />
            </div>
          </div>
          <div>
            <h2 className="font-heavy text-4xl mb-6">Our Mission</h2>
            <p className="text-lg text-gray-700 mb-6">
              Founded in 2023, Impact Post emerged from a simple need: to see ourselves reflected in the media we consume. From the bustling businesses of Toronto to the tight-knit communities in Edmonton, Somalis have been an integral part of Canada's fabric for decades.
            </p>
            <p className="text-lg text-gray-700 mb-6">
              Our mission is to provide a platform for storytelling that empowers, informs, and connects. We focus on:
            </p>
            <ul className="space-y-4 font-bold text-gray-800">
              <li className="flex items-center gap-3">
                <span className="w-3 h-3 bg-brand-teal rounded-full border border-black"></span>
                Promoting Youth Leadership & Excellence
              </li>
              <li className="flex items-center gap-3">
                <span className="w-3 h-3 bg-brand-purple rounded-full border border-black"></span>
                Preserving Cultural Heritage & Language
              </li>
              <li className="flex items-center gap-3">
                <span className="w-3 h-3 bg-brand-yellow rounded-full border border-black"></span>
                Advocating for Social Equity & Justice
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-black text-white p-12 text-center rounded-2xl shadow-hard-lg border-2 border-white relative overflow-hidden">
           <div className="relative z-10">
             <h2 className="font-heavy text-4xl mb-6 text-brand-yellow">Join Our Movement</h2>
             <p className="text-xl mb-8 max-w-2xl mx-auto text-gray-300">
               Whether you are a writer, photographer, or just a passionate community member, there is a place for you at Impact Post.
             </p>
             <div className="flex flex-col sm:flex-row gap-4 justify-center">
               <Button variant="secondary">Partner With Us</Button>
               <Button variant="outline" className="text-white border-white hover:bg-white hover:text-black">Contact Editorial Team</Button>
             </div>
           </div>
        </div>

      </div>
    </div>
  );
};