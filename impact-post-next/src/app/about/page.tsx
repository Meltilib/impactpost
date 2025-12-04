import { Metadata } from 'next';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Heart, Users, Target, Shield, Sparkles, Handshake, Lightbulb } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'IMPACT POST is a digital-first media platform dedicated to amplifying the voices, stories, and achievements of equity-deserving communities.',
  openGraph: {
    title: 'About Us | IMPACT POST',
    description: 'Learn about our mission to amplify community voices through independent journalism.',
  },
};

const coreValues = [
  {
    icon: Heart,
    title: 'Community Impact',
    description: 'We put the needs, voices, and stories of equity-deserving communities at the heart of our work.',
    color: 'bg-brand-coral',
  },
  {
    icon: Shield,
    title: 'Authenticity',
    description: 'We tell stories with honesty, depth, and respect — avoiding stereotypes and prioritizing real lived experiences.',
    color: 'bg-brand-purple',
  },
  {
    icon: Users,
    title: 'Equity & Empowerment',
    description: 'We champion representation, opportunity, and fairness in everything we do.',
    color: 'bg-brand-teal',
  },
  {
    icon: Target,
    title: 'Integrity',
    description: 'Our journalism follows ethical, transparent, and accurate reporting practices.',
    color: 'bg-brand-blue',
  },
  {
    icon: Sparkles,
    title: 'Inclusion & Respect',
    description: 'We honour the diverse identities, cultures, and experiences within the communities we serve.',
    color: 'bg-brand-yellow',
  },
  {
    icon: Handshake,
    title: 'Collaboration',
    description: 'We work closely with creators, leaders, organizations, and readers to build collective impact.',
    color: 'bg-brand-coral',
  },
  {
    icon: Lightbulb,
    title: 'Innovation',
    description: 'We embrace modern digital storytelling, multimedia formats, and forward-thinking ideas.',
    color: 'bg-brand-purple',
  },
];

export default function AboutPage() {
  return (
    <div className="animate-in">
      {/* Hero Section */}
      <section className="bg-brand-purple text-white py-20 border-b-2 border-black relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-coral rounded-full blur-[150px] opacity-30" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl">
            <span className="bg-white text-brand-purple px-4 py-2 font-bold text-sm uppercase tracking-widest mb-6 inline-block shadow-hard-sm">
              About Us
            </span>
            <h1 className="font-heavy text-5xl md:text-7xl mb-6 leading-tight">
              Voices of Strength.<br />
              Stories of Impact.
            </h1>
            <p className="text-xl md:text-2xl opacity-90 leading-relaxed">
              IMPACT POST is a digital-first media platform dedicated to amplifying the voices, stories, and achievements of equity-deserving communities.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white border-b-2 border-black">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-heavy text-4xl md:text-5xl mb-8">Our Mission</h2>
              <div className="space-y-6 text-lg text-gray-700">
                <p>
                  IMPACT POST creates meaningful journalism and multimedia content that elevates the voices and experiences of equity-deserving communities.
                </p>
                <p>
                  We provide reliable information, resources, and opportunities for growth. We showcase youth leadership and emerging creators.
                </p>
                <p>
                  We connect families, businesses, organizations, and changemakers. We highlight perspectives often overlooked by mainstream media and build pride in the diverse identities that shape our society.
                </p>
                <p className="font-bold text-brand-purple text-xl">
                  We exist to inform, inspire, and empower — with authenticity, respect, and purpose.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="relative h-[500px] border-2 border-black shadow-hard-lg overflow-hidden">
                <Image
                  src="https://picsum.photos/600/800?random=50"
                  alt="Community gathering"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-brand-yellow p-6 border-2 border-black shadow-hard max-w-xs">
                <p className="font-bold text-lg">
                  &quot;Because all communities deserve representation.&quot;
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-20 bg-brand-light border-b-2 border-black">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <h2 className="font-heavy text-4xl md:text-5xl mb-8">Our Vision</h2>
          <p className="text-2xl md:text-3xl text-gray-700 leading-relaxed">
            To become a leading media platform that amplifies and celebrates the voices, achievements, and stories of equity-deserving communities, inspiring positive change and strengthening community connection.
          </p>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-white border-b-2 border-black">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-heavy text-4xl md:text-5xl mb-4">Our Core Values</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              These principles guide everything we do at IMPACT POST.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coreValues.map((value) => (
              <div 
                key={value.title}
                className="p-6 border-2 border-black shadow-hard hover:shadow-hard-lg hover:-translate-y-1 transition-all bg-white"
              >
                <div className={`w-12 h-12 ${value.color} text-white flex items-center justify-center mb-4 border-2 border-black shadow-hard-sm`}>
                  <value.icon size={24} />
                </div>
                <h3 className="font-bold text-xl mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="py-20 bg-black text-white">
        <div className="container mx-auto px-4">
          <h2 className="font-heavy text-4xl md:text-5xl mb-12 text-center">What We Do</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              'Publish news, profiles, and features centered on equity-deserving communities',
              'Elevate youth creators and emerging leaders',
              'Provide resources for families, newcomers, and entrepreneurs',
              'Produce interviews, short videos, and multimedia content',
              'Support local and community-based businesses through advertising and collaboration',
              'Host events, workshops, and conversations that promote connection and empowerment',
            ].map((item, idx) => (
              <div 
                key={idx}
                className="flex items-start gap-4 p-6 border border-white/20 hover:border-brand-coral transition-colors"
              >
                <span className="text-brand-coral font-heavy text-2xl">{String(idx + 1).padStart(2, '0')}</span>
                <p className="text-lg">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-brand-coral text-white border-t-2 border-black">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-heavy text-4xl md:text-5xl mb-6">
            Join Our Community
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Whether you want to share your story, support our journalism, or partner with us — we&apos;d love to hear from you.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/support">
              <Button variant="primary" size="lg" className="bg-white text-brand-coral hover:bg-black hover:text-white">
                Support Us
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-brand-coral">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
