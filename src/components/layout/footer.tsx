import Link from 'next/link';
import { SITE_CONFIG } from '@/lib/constants';
import { NewsletterForm } from '@/components/newsletter-form';

export function Footer() {
  return (
    <footer className="bg-black text-white pt-16 pb-8 border-t-4 border-brand-purple">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-12">

          <div className="md:col-span-4">
            <h2 className="font-heavy text-4xl mb-6 italic">
              IMPACT<span className="text-brand-coral">POST</span>
            </h2>
            <p className="text-gray-400 mb-6 text-lg">
              {SITE_CONFIG.tagline}
              <br />
              Amplifying the narratives of equity-deserving communities through independent, equity-focused journalism.
            </p>
            <div className="flex gap-4">
              {['twitter', 'facebook', 'instagram', 'youtube'].map((social) => (
                <a
                  key={social}
                  href={`https://${social}.com/impactpost`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-brand-coral cursor-pointer transition-colors"
                  aria-label={`Follow us on ${social}`}
                >
                  <span className="sr-only">{social}</span>
                </a>
              ))}
            </div>
          </div>

          <div className="md:col-span-2">
            <h4 className="font-bold text-brand-yellow mb-4 uppercase tracking-widest text-sm">
              Sections
            </h4>
            <ul className="space-y-3 text-gray-300">
              <li><Link href="/news" className="hover:text-white transition-colors">News</Link></li>
              <li><Link href="/section/community-voices" className="hover:text-white transition-colors">Community Voices</Link></li>
              <li><Link href="/section/youth" className="hover:text-white transition-colors">Youth Hub</Link></li>
              <li><Link href="/section/multimedia" className="hover:text-white transition-colors">Multimedia</Link></li>
              <li><Link href="/section/community" className="hover:text-white transition-colors">Events</Link></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="font-bold text-brand-teal mb-4 uppercase tracking-widest text-sm">
              About
            </h4>
            <ul className="space-y-3 text-gray-300">
              <li><Link href="/about" className="hover:text-white transition-colors">Our Mission</Link></li>
              <li><Link href="/about#team" className="hover:text-white transition-colors">Our Team</Link></li>
              <li><Link href="/careers" className="hover:text-white transition-colors">Careers</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              <li><Link href="/advertise" className="hover:text-white transition-colors">Advertise</Link></li>
            </ul>
          </div>

          <div className="md:col-span-4">
            <NewsletterForm />
          </div>

        </div>

        <div className="border-t border-white/20 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Impact Post. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
