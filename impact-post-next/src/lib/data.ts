import { Story, Event } from '@/types';

export const FEATURED_STORY: Story = {
  id: '1',
  slug: 'from-dixon-to-parliament-somali-canadian-leadership',
  title: "From Dixon to Parliament: The Rising Tide of Somali-Canadian Leadership",
  excerpt: "As a new generation enters the political arena, we explore how grassroots organizing in Toronto and Ottawa is reshaping the national conversation on immigration and housing.",
  category: 'Community Voices',
  imageUrl: 'https://picsum.photos/1200/800?random=101',
  author: {
    id: 'a1',
    name: 'Hodan Ali',
    role: 'Senior Political Correspondent',
    avatarUrl: 'https://picsum.photos/100/100?random=201'
  },
  date: '2024-10-24',
  readTime: '12 min read',
  isFeatured: true,
  tags: ['Politics', 'Leadership', 'Community'],
};

export const RECENT_STORIES: Story[] = [
  {
    id: '2',
    slug: 'innovators-of-edmonton-youth-tech-collective',
    title: "Innovators of Edmonton: The Youth Tech Collective",
    excerpt: "Three high school students from the north side have developed an app to help newcomers navigate the healthcare system.",
    category: 'Youth',
    imageUrl: 'https://picsum.photos/800/600?random=102',
    author: { id: 'a2', name: 'Liban Farah', role: 'Youth Reporter', avatarUrl: 'https://picsum.photos/100/100?random=202' },
    date: '2024-10-22',
    readTime: '5 min read',
    tags: ['Technology', 'Youth', 'Innovation'],
  },
  {
    id: '3',
    slug: 'taste-of-mogadishu-east-end-culinary-scene',
    title: "Taste of Mogadishu: Revitalizing the East End Culinary Scene",
    excerpt: "How traditional Xalwo and Suqaar are finding new fans among diverse foodies in downtown Toronto.",
    category: 'Business',
    imageUrl: 'https://picsum.photos/800/600?random=103',
    author: { id: 'a3', name: 'Sahra Mohamed', role: 'Culture Editor', avatarUrl: 'https://picsum.photos/100/100?random=203' },
    date: '2024-10-20',
    readTime: '6 min read',
    tags: ['Food', 'Business', 'Culture'],
  },
  {
    id: '4',
    slug: 'reviving-the-gabay-poetry-heritage',
    title: "Reviving the Gabay: A Night of Poetry and Heritage",
    excerpt: "Elders and youth gathered this weekend to bridge the generational gap through the ancient art of Somali oral storytelling.",
    category: 'Culture',
    imageUrl: 'https://picsum.photos/800/600?random=104',
    author: { id: 'a4', name: 'Abdi Warsame', role: 'Contributor', avatarUrl: 'https://picsum.photos/100/100?random=204' },
    date: '2024-10-18',
    readTime: '8 min read',
    tags: ['Poetry', 'Heritage', 'Culture'],
  },
  {
    id: '5',
    slug: 'mental-health-diaspora-breaking-silence',
    title: "Mental Health in the Diaspora: Breaking the Silence",
    excerpt: "Community leaders are launching a new series of workshops to address trauma and resilience in a culturally responsive way.",
    category: 'Wellness',
    imageUrl: 'https://picsum.photos/800/600?random=105',
    author: { id: 'a5', name: 'Dr. Yasmin Elmi', role: 'Health Specialist', avatarUrl: 'https://picsum.photos/100/100?random=205' },
    date: '2024-10-15',
    readTime: '10 min read',
    tags: ['Mental Health', 'Wellness', 'Community'],
  },
  {
    id: '6',
    slug: 'global-remittances-lifeline-development',
    title: "Global Remittances: The Lifeline of Development",
    excerpt: "A deep dive into how the diaspora in Canada contributes to infrastructure projects back home.",
    category: 'Issues',
    imageUrl: 'https://picsum.photos/800/600?random=106',
    author: { id: 'a1', name: 'Hodan Ali', role: 'Senior Correspondent', avatarUrl: 'https://picsum.photos/100/100?random=201' },
    date: '2024-10-12',
    readTime: '9 min read',
    tags: ['Economics', 'Diaspora', 'Development'],
  },
  {
    id: '7',
    slug: 'documentary-somalis-of-yellowknife',
    title: "Documentary: The Somalis of Yellowknife",
    excerpt: "Braving the cold: stories of resilience from one of Canada's most northern communities.",
    category: 'Multimedia',
    imageUrl: 'https://picsum.photos/800/600?random=107',
    author: { id: 'a6', name: 'Khadija Omar', role: 'Visual Journalist', avatarUrl: 'https://picsum.photos/100/100?random=206' },
    date: '2024-10-10',
    readTime: '15 min watch',
    tags: ['Documentary', 'Community', 'Resilience'],
  },
  {
    id: '8',
    slug: 'halal-investing-101-generational-wealth',
    title: "Halal Investing 101: Building Generational Wealth",
    excerpt: "Financial experts share tips on ethical investing strategies for young families.",
    category: 'Business',
    imageUrl: 'https://picsum.photos/800/600?random=108',
    author: { id: 'a3', name: 'Sahra Mohamed', role: 'Culture Editor', avatarUrl: 'https://picsum.photos/100/100?random=203' },
    date: '2024-10-08',
    readTime: '7 min read',
    tags: ['Finance', 'Investing', 'Family'],
  },
];

export const EVENTS: Event[] = [
  { 
    id: 'e1', 
    title: 'Somali Independence Day Festival', 
    date: 'Jul 01, 2:00 PM', 
    location: 'Centennial Park, Etobicoke', 
    type: 'Culture',
    description: 'Annual celebration of Somali independence with food, music, and cultural performances.'
  },
  { 
    id: 'e2', 
    title: 'Diaspora Business Mixer', 
    date: 'Nov 15, 6:00 PM', 
    location: 'Metro Convention Centre', 
    type: 'Networking',
    description: 'Connect with fellow entrepreneurs and business leaders from the community.'
  },
  { 
    id: 'e3', 
    title: 'Youth Mentorship Gala', 
    date: 'Dec 10, 7:00 PM', 
    location: 'Ottawa City Hall', 
    type: 'Community',
    description: 'Celebrating youth achievement and connecting mentors with emerging leaders.'
  },
  { 
    id: 'e4', 
    title: 'Book Launch: "Nomad Chronicles"', 
    date: 'Oct 30, 5:00 PM', 
    location: 'Toronto Public Library', 
    type: 'Literature',
    description: 'Join us for the launch of the new memoir exploring diaspora experiences.'
  },
];

export function getAllStories(): Story[] {
  return [FEATURED_STORY, ...RECENT_STORIES];
}

export function getStoryBySlug(slug: string): Story | undefined {
  return getAllStories().find(story => story.slug === slug);
}

export function getStoryById(id: string): Story | undefined {
  return getAllStories().find(story => story.id === id);
}

export function getStoriesByCategory(category: string): Story[] {
  const allStories = getAllStories();
  
  if (!category || category === 'news') return allStories;
  
  if (category === 'community-voices') {
    return allStories.filter(s => s.category === 'Community Voices' || s.category === 'Issues');
  }
  if (category === 'community') {
    return allStories.filter(s => s.category === 'Culture' || s.category === 'Business' || s.category === 'Wellness');
  }
  if (category === 'youth') {
    return allStories.filter(s => s.category === 'Youth');
  }
  if (category === 'multimedia') {
    return allStories.filter(s => s.category === 'Multimedia');
  }
  if (category === 'business') {
    return allStories.filter(s => s.category === 'Business');
  }
  if (category === 'wellness') {
    return allStories.filter(s => s.category === 'Wellness');
  }
  
  return allStories;
}
