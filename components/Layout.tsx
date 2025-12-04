import React, { useState } from 'react';
import { Menu, X, Search, Heart, User, ChevronDown } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from './Button';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { label: 'News', href: '/section/news' },
    { label: 'Voices', href: '/section/voices' },
    { label: 'Youth Hub', href: '/section/youth' },
    { label: 'Multimedia', href: '/section/multimedia' },
    { label: 'Community', href: '/section/community' },
    { label: 'About Us', href: '/about' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-brand-light font-sans selection:bg-brand-purple selection:text-white">
      {/* Ticker */}
      <div className="ticker-wrap border-b-2 border-black z-50 relative">
        <div className="ticker font-mono font-bold text-sm tracking-widest uppercase py-2">
          +++ BREAKING: New Cultural Centre Approved in Etobicoke +++ Youth Scholarship Applications Open until Nov 30 +++ 
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-brand-light border-b-2 border-black">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            
            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 border-2 border-black shadow-hard-sm active:shadow-none active:translate-y-1 transition-all"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Logo */}
            <Link to="/" className="text-3xl md:text-4xl font-heavy italic tracking-tighter text-black hover:text-brand-purple transition-colors">
              IMPACT<span className="text-brand-coral">POST</span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-6 font-bold text-sm uppercase tracking-wide">
              {navItems.map((item) => (
                <Link 
                  key={item.label} 
                  to={item.href}
                  className={`hover:text-brand-purple hover:underline decoration-4 decoration-brand-yellow underline-offset-4 transition-all ${location.pathname === item.href ? 'text-brand-purple underline decoration-brand-yellow' : ''}`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors hidden sm:block">
                <Search size={20} />
              </button>
              <Link to="/about">
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
            <div className="flex flex-col gap-4">
              {navItems.map((item) => (
                <Link 
                  key={item.label} 
                  to={item.href}
                  className="text-xl font-bold uppercase border-b border-dashed border-gray-300 pb-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="grid grid-cols-2 gap-4 mt-4">
                 <Button variant="secondary" fullWidth>Subscribe</Button>
                 <Button variant="primary" fullWidth>Donate</Button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-black text-white pt-16 pb-8 border-t-4 border-brand-purple">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-12">
            
            <div className="md:col-span-4">
              <h2 className="font-heavy text-4xl mb-6 italic">IMPACT<span className="text-brand-coral">POST</span></h2>
              <p className="text-gray-400 mb-6 text-lg">
                Voices of the Diaspora. Stories of Resilience.
                Amplifying the narratives of the Somali-Canadian community through independent, equity-focused journalism.
              </p>
              <div className="flex gap-4">
                {/* Social Placeholders */}
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-brand-coral cursor-pointer transition-colors">
                    <span className="sr-only">Social Link</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="md:col-span-2">
              <h4 className="font-bold text-brand-yellow mb-4 uppercase tracking-widest text-sm">Sections</h4>
              <ul className="space-y-3 text-gray-300">
                <li><Link to="/section/news" className="hover:text-white">News</Link></li>
                <li><Link to="/section/voices" className="hover:text-white">Community Voices</Link></li>
                <li><Link to="/section/youth" className="hover:text-white">Youth Hub</Link></li>
                <li><Link to="/section/multimedia" className="hover:text-white">Multimedia</Link></li>
                <li><Link to="/section/community" className="hover:text-white">Events</Link></li>
              </ul>
            </div>

            <div className="md:col-span-2">
              <h4 className="font-bold text-brand-teal mb-4 uppercase tracking-widest text-sm">About</h4>
              <ul className="space-y-3 text-gray-300">
                <li><Link to="/about" className="hover:text-white">Our Mission</Link></li>
                <li><Link to="/about" className="hover:text-white">Our Team</Link></li>
                <li><Link to="#" className="hover:text-white">Careers</Link></li>
                <li><Link to="#" className="hover:text-white">Contact</Link></li>
                <li><Link to="#" className="hover:text-white">Advertise</Link></li>
              </ul>
            </div>

            <div className="md:col-span-4 bg-brand-purple p-6 border-2 border-white shadow-[8px_8px_0px_white]">
              <h4 className="font-heavy text-2xl mb-2">Subscribe to the Newsletter</h4>
              <p className="text-white/80 mb-4">Stay connected with your community. Weekly updates on events, news, and opportunities.</p>
              <div className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="Your email" 
                  className="flex-grow px-4 py-2 bg-white text-black font-bold outline-none border-2 border-transparent focus:border-brand-yellow"
                />
                <button className="bg-black text-white px-4 font-bold border-2 border-black hover:bg-brand-yellow hover:text-black transition-colors">
                  GO
                </button>
              </div>
            </div>

          </div>

          <div className="border-t border-white/20 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
            <p>&copy; 2024 Impact Post. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <Link to="#" className="hover:text-white">Privacy Policy</Link>
              <Link to="#" className="hover:text-white">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};