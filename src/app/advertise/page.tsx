import Link from 'next/link';
import { Metadata } from 'next';
import { ArrowRight, Megaphone, Target, HandCoins } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BackButton } from '@/components/navigation/back-button';
import { SITE_CONFIG } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Advertise with IMPACT POST',
  description: 'Partner with IMPACT POST to reach engaged readers across the Canadian-Somali diaspora.',
};

const benefits = [
  {
    title: 'Engaged Community',
    description: 'Reach a loyal audience invested in local businesses, events, and community milestones.',
    icon: Megaphone,
  },
  {
    title: 'Premium Placement',
    description: 'Homepage takeovers, in-article placements, newsletter features, and event sponsorships.',
    icon: Target,
  },
  {
    title: 'Custom Campaigns',
    description: 'Storytelling, multimedia, and co-branded content crafted with our editorial team.',
    icon: HandCoins,
  },
];

const packages = [
  {
    name: 'Brand Spotlight',
    details: 'Homepage leaderboard + in-feed banner for 2 weeks, social shout-out, and link tracking.',
  },
  {
    name: 'Community Partner',
    details: 'Sponsored feature story, newsletter placement, and sidebar banner for 1 month.',
  },
  {
    name: 'Event Boost',
    details: 'Event calendar highlight, homepage sidebar banner, and Instagram reel promo.',
  },
];

export default function AdvertisePage() {
  const contactEmail = 'advertise@impactpost.ca';

  return (
    <div className="bg-brand-light min-h-screen border-t-2 border-black">
      <section className="container mx-auto px-4 py-16">
        <div className="bg-white border-2 border-black shadow-hard p-8 md:p-12 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-coral rounded-full blur-3xl opacity-40" />
          <div className="absolute -bottom-10 -left-10 w-56 h-56 bg-brand-yellow rounded-full blur-3xl opacity-40" />
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-5 gap-10 items-center">
            <div className="md:col-span-3 space-y-4">
              <div className="flex items-center gap-4">
                <span className="px-4 py-1.5 font-bold text-sm uppercase border-2 border-black bg-brand-purple text-white shadow-hard-sm">
                  HOME
                </span>
                <BackButton />
              </div>
              <h1 className="font-heavy text-4xl md:text-5xl leading-tight">
                Amplify your message with {SITE_CONFIG.name}
              </h1>
              <p className="text-lg text-gray-700 max-w-2xl">
                We collaborate with mission-aligned brands to connect them with an engaged diaspora audience across Canada.
              </p>
              <div className="flex flex-wrap gap-3">
                <a href={`mailto:${contactEmail}?subject=Advertise with ${encodeURIComponent(SITE_CONFIG.name)}`}>
                  <Button variant="accent" size="lg" className="gap-2">
                    Start a campaign <ArrowRight size={18} />
                  </Button>
                </a>
                <Link href="/about#sponsors">
                  <Button variant="outline" size="lg" className="gap-2">
                    See our mission
                  </Button>
                </Link>
              </div>
            </div>
            <div className="md:col-span-2 bg-black text-white border-2 border-white p-6 shadow-hard">
              <h2 className="font-heavy text-2xl mb-3">Audience Snapshot</h2>
              <ul className="space-y-2 text-sm">
                <li>• 45K monthly readers across web + newsletter</li>
                <li>• 62% aged 18-44; community-first decision makers</li>
                <li>• Strong engagement on youth, business, and events coverage</li>
                <li>• Canada-wide reach with Somali diaspora focus</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-16">
        <div className="grid gap-8 md:grid-cols-3">
          {benefits.map(benefit => (
            <div
              key={benefit.title}
              className="bg-white border-2 border-black shadow-hard p-6 flex flex-col gap-3"
            >
              <benefit.icon className="text-brand-purple" size={28} />
              <h3 className="font-heavy text-xl">{benefit.title}</h3>
              <p className="text-sm text-gray-700">{benefit.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 pb-20">
        <div className="bg-brand-yellow border-2 border-black shadow-hard p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <p className="font-bold uppercase text-xs tracking-[0.25em] text-gray-800 mb-2">Sample Packages</p>
              <h2 className="font-heavy text-3xl md:text-4xl">Built for brand impact</h2>
            </div>
            <a href={`mailto:${contactEmail}?subject=IMPACT POST advertising inquiry`}>
              <Button variant="accent" className="gap-2">
                Book a call <ArrowRight size={16} />
              </Button>
            </a>
          </div>
          <div className="grid gap-4 md:grid-cols-3 mt-8">
            {packages.map(pkg => (
              <div key={pkg.name} className="bg-white border-2 border-black p-4 shadow-hard-sm">
                <h3 className="font-heavy text-lg mb-2">{pkg.name}</h3>
                <p className="text-sm text-gray-700">{pkg.details}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
