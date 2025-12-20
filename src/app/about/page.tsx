import { Metadata } from 'next';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Mail, Twitter, Linkedin, ArrowRight } from 'lucide-react';
import { BackButton } from '@/components/navigation/back-button';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'IMPACT POST is a digital-first community media platform. We bridge the gap between generations, celebrating our heritage while tackling the pressing issues of today.',
  openGraph: {
    title: 'About Us | IMPACT POST',
    description: 'Learn about our mission to amplify Somali voices through independent journalism.',
  },
};

const teamMembers = [
  { name: 'Said Dirie', role: 'Editor-in-Chief', img: '/images/1-Said.jpeg', email: 'SDirie@impactpost.ca' },
  { name: 'Mohamed Eltilib', role: 'Technical Director', img: '/images/2-tilib.jpg', email: 'MEltilib@impactpost.ca' },
  { name: 'Simon Shirley', role: 'Director of Photography', img: '/images/3-Simon.jpg', email: 'SShirley@impactpost.ca', imagePos: 'object-top' },
  { name: 'Zakarie Dirie', role: 'Head of Marketing', img: '/images/avatar-2.jpg', email: 'ZDirie@impactpost.ca' },
];

const missionPoints = [
  { label: 'Youth Leadership & Excellence', color: 'bg-brand-purple' },
  { label: 'Preserving Cultural Heritage', color: 'bg-brand-yellow' },
  { label: 'Social Equity & Justice', color: 'bg-brand-coral' },
];

export default function AboutPage() {
  return (
    <div className="animate-in">

      {/* Hero Header */}
      <div className="bg-brand-light py-20 border-b-2 border-black relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-yellow rounded-full blur-[80px] opacity-20 pointer-events-none" />

        <div className="container mx-auto px-4 max-w-4xl text-center relative z-10">
          <div className="flex items-center justify-center gap-4 mb-6">
            <span className="bg-brand-purple text-white px-4 py-1.5 font-bold text-sm uppercase tracking-widest shadow-hard-sm inline-block transform -rotate-2">
              HOME
            </span>
            <BackButton />
          </div>
          <h1 className="font-heavy text-5xl md:text-7xl mb-8 leading-tight text-brand-dark">
            AMPLIFYING <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-purple to-brand-coral">
              SOMALI VOICES
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 leading-relaxed font-display font-medium max-w-3xl mx-auto">
            IMPACT POST is a digital-first community media platform. We bridge the gap between generations, celebrating our heritage while tackling the pressing issues of today.
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1">
            <div className="relative">
              <div className="absolute top-4 left-4 w-full h-full bg-brand-teal border-2 border-black" />
              <div className="relative z-10 w-full aspect-[4/3] border-2 border-black shadow-hard-sm overflow-hidden">
                <Image
                  src="/images/about-community.jpg"
                  alt="Community gathering"
                  fill
                  className="object-cover grayscale hover:grayscale-0 transition-all duration-500"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <h2 className="font-heavy text-4xl mb-6 uppercase">Our Mission</h2>
            <div className="w-20 h-2 bg-brand-coral mb-8" />

            <p className="text-lg text-gray-800 mb-6 font-medium">
              Founded in 2023, Impact Post emerged from a simple need: to see ourselves reflected in the media we consume. From the bustling businesses of Toronto to the tight-knit communities in Edmonton, Somalis have been an integral part of Canada&apos;s fabric for decades.
            </p>
            <p className="text-lg text-gray-600 mb-8">
              We provide a platform for storytelling that empowers, informs, and connects.
            </p>

            <ul className="space-y-4">
              {missionPoints.map((item, i) => (
                <li
                  key={i}
                  className="flex items-center gap-4 bg-white border-2 border-black p-4 shadow-hard-sm hover:-translate-y-1 transition-transform"
                >
                  <span className={`w-4 h-4 ${item.color} border border-black rounded-full`} />
                  <span className="font-bold font-display text-lg">{item.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="bg-brand-dark text-white py-20 border-y-2 border-black">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-heavy text-4xl md:text-5xl mb-4">MEET THE TEAM</h2>
            <p className="text-gray-400 font-display text-xl">The storytellers behind the headlines.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, i) => (
              <div
                key={i}
                className="group bg-brand-light text-black p-6 border-2 border-white/20 hover:border-brand-yellow transition-colors relative overflow-hidden"
              >
                <div className="mb-6 relative">
                  <div className="absolute inset-0 bg-brand-yellow translate-x-2 translate-y-2 rounded-full border-2 border-black hidden group-hover:block transition-all" />
                  <div className="relative z-10 w-24 h-24 rounded-full border-2 border-black overflow-hidden">
                    <Image
                      src={member.img}
                      alt={member.name}
                      fill
                      className={`object-cover ${member.imagePos || ''}`}
                      sizes="96px"
                    />
                  </div>
                </div>
                <h3 className="font-heavy text-xl mb-1 group-hover:text-brand-purple transition-colors">
                  {member.name}
                </h3>
                <p className="font-bold text-sm text-gray-500 uppercase tracking-widest mb-4">
                  {member.role}
                </p>
                <div className="flex gap-3 opacity-50 group-hover:opacity-100 transition-opacity">
                  <Twitter size={16} className="cursor-pointer hover:text-brand-blue" />
                  <Linkedin size={16} className="cursor-pointer hover:text-brand-blue" />
                  <a href={`mailto:${member.email}`} aria-label={`Email ${member.name}`}>
                    <Mail size={16} className="cursor-pointer hover:text-brand-coral" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="bg-brand-purple text-white p-8 md:p-12 border-2 border-black shadow-hard-lg relative overflow-hidden text-center max-w-5xl mx-auto">

          <div className="relative z-10">
            <h2 className="font-heavy text-4xl md:text-6xl mb-6 text-brand-yellow uppercase transform -rotate-1">
              Join Our Movement
            </h2>
            <p className="text-xl mb-10 max-w-2xl mx-auto font-display">
              Whether you are a writer, photographer, or just a passionate community member, there is a place for you at Impact Post.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="secondary" size="lg" className="border-white">
                Partner With Us <ArrowRight className="ml-2" size={20} />
              </Button>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-black">
                Contact Editorial Team
              </Button>
            </div>
          </div>

          {/* Abstract Background Shapes */}
          <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-brand-teal rounded-full opacity-50 border-2 border-black" />
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-brand-coral rounded-full opacity-50 border-2 border-black" />
        </div>
      </div>
    </div>
  );
}
