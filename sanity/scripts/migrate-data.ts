/**
 * Sanity Data Migration Script
 * Migrates static data from src/lib/data.ts to Sanity CMS
 * 
 * Prerequisites:
 * 1. Set SANITY_WRITE_TOKEN in sanity/.env.local or project root .env.local
 * 2. Set SANITY_STUDIO_PROJECT_ID (or NEXT_PUBLIC_SANITY_PROJECT_ID)
 * 
 * Run with:
 *   npm run sanity:migrate     (from project root)
 *   npm run migrate            (from sanity folder)
 */

import { createClient } from '@sanity/client';
import { createReadStream } from 'fs';
import path from 'path';

// Load environment variables from .env.local in parent directory
import { config } from 'dotenv';
import { resolve } from 'path';

// Try multiple .env locations
config({ path: resolve(__dirname, '../../.env.local') }); // sanity/.env.local
config({ path: resolve(__dirname, '../../../.env.local') }); // project root .env.local

// Configuration
const projectId = process.env.SANITY_STUDIO_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.SANITY_STUDIO_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const token = process.env.SANITY_WRITE_TOKEN || process.env.SANITY_API_TOKEN || process.env.SANITY_AUTH_TOKEN;

if (!projectId) {
  console.error('❌ Missing SANITY_STUDIO_PROJECT_ID or NEXT_PUBLIC_SANITY_PROJECT_ID');
  console.error('   Add to sanity/.env.local or project root .env.local');
  process.exit(1);
}

if (!token) {
  console.error('❌ Missing SANITY_WRITE_TOKEN');
  console.error('   Get a token from: https://sanity.io/manage → Your Project → API → Tokens');
  console.error('   Add to sanity/.env.local: SANITY_WRITE_TOKEN=sk...');
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  token,
  useCdn: false,
});

// Image paths (relative to sanity/scripts folder)
const PUBLIC_IMAGES_PATH = path.join(__dirname, '../..', 'public/images');

// =============================================================================
// DATA DEFINITIONS
// =============================================================================

const AUTHORS = [
  { id: 'author-hodan-ali', name: 'Hodan Ali', role: 'Senior Political Correspondent', slug: 'hodan-ali', image: 'avatar-1.jpg', bio: 'Senior Political Correspondent covering equity, housing, and community leadership. Based in Toronto.' },
  { id: 'author-liban-farah', name: 'Liban Farah', role: 'Youth Reporter', slug: 'liban-farah', image: 'avatar-2.jpg', bio: 'Youth Reporter. Senior Reporter covering equity, housing, and food justice. Previously wrote for The City Chronicle.' },
  { id: 'author-sahra-mohamed', name: 'Sahra Mohamed', role: 'Culture Editor', slug: 'sahra-mohamed', image: 'avatar-3.jpg', bio: 'Culture Editor focusing on business, food, and community stories across the diaspora.' },
  { id: 'author-abdi-warsame', name: 'Abdi Warsame', role: 'Contributor', slug: 'abdi-warsame', image: 'avatar-4.jpg', bio: 'Community contributor and cultural advocate passionate about preserving Somali heritage.' },
  { id: 'author-yasmin-elmi', name: 'Dr. Yasmin Elmi', role: 'Health Specialist', slug: 'yasmin-elmi', image: 'avatar-5.jpg', bio: 'Health Specialist and mental health advocate. PhD in Community Psychology.' },
  { id: 'author-khadija-omar', name: 'Khadija Omar', role: 'Visual Journalist', slug: 'khadija-omar', image: 'avatar-6.jpg', bio: 'Visual Journalist and documentary filmmaker capturing diaspora stories across Canada.' },
];

const CATEGORIES = [
  { id: 'category-community-voices', title: 'Community Voices', slug: 'community-voices', description: 'Stories that amplify the diverse experiences of our people.', color: 'bg-brand-purple', textColor: 'text-white' },
  { id: 'category-youth', title: 'Youth', slug: 'youth', description: 'Spotlighting the next generation of leaders and creators.', color: 'bg-brand-teal', textColor: 'text-black' },
  { id: 'category-business', title: 'Business', slug: 'business', description: 'Spotlighting community entrepreneurs and economic growth.', color: 'bg-brand-blue', textColor: 'text-white' },
  { id: 'category-culture', title: 'Culture', slug: 'culture', description: 'Celebrating our heritage, traditions, and artistic expression.', color: 'bg-brand-yellow', textColor: 'text-black' },
  { id: 'category-wellness', title: 'Wellness', slug: 'wellness', description: 'Resources for mental health, education, and family life.', color: 'bg-brand-yellow', textColor: 'text-black' },
  { id: 'category-issues', title: 'Issues', slug: 'issues', description: 'Examining systemic challenges with actionable solutions.', color: 'bg-black', textColor: 'text-white' },
  { id: 'category-multimedia', title: 'Multimedia', slug: 'multimedia', description: 'Visual storytelling, documentaries, and photo essays.', color: 'bg-brand-coral', textColor: 'text-white' },
];

const ARTICLES = [
  {
    id: 'article-dixon-parliament',
    title: 'From Dixon to Parliament: The Rising Tide of Somali-Canadian Leadership',
    slug: 'from-dixon-to-parliament-somali-canadian-leadership',
    excerpt: 'As a new generation enters the political arena, we explore how grassroots organizing in Toronto and Ottawa is reshaping the national conversation on immigration and housing.',
    categorySlug: 'community-voices',
    authorSlug: 'hodan-ali',
    image: 'featured-story.jpg',
    date: '2024-10-24',
    isFeatured: true,
    placement: 'featured-hero',
    displayOrder: 1,
    tags: ['Politics', 'Leadership', 'Community'],
    body: [
      {
        _type: 'leadParagraph',
        _key: 'lead-1',
        text: 'Community resilience is not just a buzzword here; it\'s the foundation upon which this neighborhood was rebuilt. Walking down 4th street, you can feel the energy shift as the murals tell stories of triumph over adversity.',
      },
      {
        _type: 'block',
        _key: 'block-1',
        style: 'normal',
        markDefs: [],
        children: [{ _type: 'span', _key: 'span-1', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.', marks: [] }],
      },
      {
        _type: 'block',
        _key: 'block-2',
        style: 'h3',
        markDefs: [],
        children: [{ _type: 'span', _key: 'span-2', text: 'A New Approach to Local Leadership', marks: [] }],
      },
      {
        _type: 'block',
        _key: 'block-3',
        style: 'normal',
        markDefs: [],
        children: [{ _type: 'span', _key: 'span-3', text: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam.', marks: [] }],
      },
      {
        _type: 'styledQuote',
        _key: 'quote-1',
        quote: 'We aren\'t waiting for permission to change our reality. We are building the future we deserve, brick by brick.',
        attribution: 'Community Leader',
        style: 'teal',
      },
      {
        _type: 'block',
        _key: 'block-4',
        style: 'normal',
        markDefs: [],
        children: [{ _type: 'span', _key: 'span-4', text: 'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet.', marks: [] }],
      },
      {
        _type: 'keyTakeaways',
        _key: 'takeaways-1',
        items: [
          'Local funding has increased by 40% since the initiative started.',
          'Youth engagement programs are now mandatory in 3 district schools.',
          'The community garden provides 500lbs of produce monthly.',
        ],
      },
      {
        _type: 'block',
        _key: 'block-5',
        style: 'normal',
        markDefs: [],
        children: [{ _type: 'span', _key: 'span-5', text: 'Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur.', marks: [] }],
      },
    ],
  },
  {
    id: 'article-edmonton-youth-tech',
    title: 'Innovators of Edmonton: The Youth Tech Collective',
    slug: 'innovators-of-edmonton-youth-tech-collective',
    excerpt: 'Three high school students from the north side have developed an app to help newcomers navigate the healthcare system.',
    categorySlug: 'youth',
    authorSlug: 'liban-farah',
    image: 'story-tech-youth.jpg',
    date: '2024-10-22',
    isFeatured: false,
    placement: 'grid',
    displayOrder: 100,
    tags: ['Technology', 'Youth', 'Innovation'],
    body: [
      {
        _type: 'leadParagraph',
        _key: 'lead-1',
        text: 'In a small community center in north Edmonton, three teenagers are quietly revolutionizing how newcomers access healthcare information. Their app, HealthBridge, has already been downloaded over 5,000 times.',
      },
      {
        _type: 'block',
        _key: 'block-1',
        style: 'normal',
        markDefs: [],
        children: [{ _type: 'span', _key: 'span-1', text: 'The Youth Tech Collective started as a weekend coding club but has evolved into something much larger. These young innovators are proving that solutions to community challenges can come from the most unexpected places.', marks: [] }],
      },
    ],
  },
  {
    id: 'article-mogadishu-culinary',
    title: 'Taste of Mogadishu: Revitalizing the East End Culinary Scene',
    slug: 'taste-of-mogadishu-east-end-culinary-scene',
    excerpt: 'How traditional Xalwo and Suqaar are finding new fans among diverse foodies in downtown Toronto.',
    categorySlug: 'business',
    authorSlug: 'sahra-mohamed',
    image: 'story-culinary.jpg',
    date: '2024-10-20',
    isFeatured: false,
    placement: 'grid',
    displayOrder: 100,
    tags: ['Food', 'Business', 'Culture'],
    body: [
      {
        _type: 'leadParagraph',
        _key: 'lead-1',
        text: 'The aroma of cardamom and cumin fills the air as Amina Hassan prepares her grandmother\'s Suqaar recipe. In just two years, her small restaurant has become a culinary destination.',
      },
      {
        _type: 'block',
        _key: 'block-1',
        style: 'normal',
        markDefs: [],
        children: [{ _type: 'span', _key: 'span-1', text: 'The East End is experiencing a culinary renaissance, with Somali restaurants leading the charge. From traditional dishes to modern fusion, these entrepreneurs are introducing Canadian palates to flavors that have been perfected over generations.', marks: [] }],
      },
    ],
  },
  {
    id: 'article-gabay-poetry',
    title: 'Reviving the Gabay: A Night of Poetry and Heritage',
    slug: 'reviving-the-gabay-poetry-heritage',
    excerpt: 'Elders and youth gathered this weekend to bridge the generational gap through the ancient art of Somali oral storytelling.',
    categorySlug: 'culture',
    authorSlug: 'abdi-warsame',
    image: 'story-culture.jpg',
    date: '2024-10-18',
    isFeatured: false,
    placement: 'grid',
    displayOrder: 100,
    tags: ['Poetry', 'Heritage', 'Culture'],
    body: [
      {
        _type: 'leadParagraph',
        _key: 'lead-1',
        text: 'Under the soft glow of string lights, three generations gathered to hear words that have echoed across the Horn of Africa for centuries. The Gabay, Somalia\'s most revered form of poetry, found new voice in a Toronto community center.',
      },
      {
        _type: 'block',
        _key: 'block-1',
        style: 'normal',
        markDefs: [],
        children: [{ _type: 'span', _key: 'span-1', text: 'For elder poet Hassan Abdi, 78, the evening represented hope. "When I see young people learning our words, our rhythms, I know our culture will survive," he said, his voice thick with emotion.', marks: [] }],
      },
    ],
  },
  {
    id: 'article-mental-health-diaspora',
    title: 'Mental Health in the Diaspora: Breaking the Silence',
    slug: 'mental-health-diaspora-breaking-silence',
    excerpt: 'Community leaders are launching a new series of workshops to address trauma and resilience in a culturally responsive way.',
    categorySlug: 'wellness',
    authorSlug: 'yasmin-elmi',
    image: 'story-wellness.jpg',
    date: '2024-10-15',
    isFeatured: false,
    placement: 'grid',
    displayOrder: 100,
    tags: ['Mental Health', 'Wellness', 'Community'],
    body: [
      {
        _type: 'leadParagraph',
        _key: 'lead-1',
        text: 'In communities where strength is often measured by silence, a new generation of mental health advocates is changing the conversation. They\'re creating spaces where vulnerability is not weakness, but wisdom.',
      },
      {
        _type: 'block',
        _key: 'block-1',
        style: 'normal',
        markDefs: [],
        children: [{ _type: 'span', _key: 'span-1', text: 'The Healing Circles initiative, launched this month, combines traditional community support structures with evidence-based therapeutic approaches. It\'s a model that recognizes the unique experiences of diaspora communities.', marks: [] }],
      },
    ],
  },
  {
    id: 'article-global-remittances',
    title: 'Global Remittances: The Lifeline of Development',
    slug: 'global-remittances-lifeline-development',
    excerpt: 'A deep dive into how the diaspora in Canada contributes to infrastructure projects back home.',
    categorySlug: 'issues',
    authorSlug: 'hodan-ali',
    image: 'story-global.jpg',
    date: '2024-10-12',
    isFeatured: false,
    placement: 'grid',
    displayOrder: 100,
    tags: ['Economics', 'Diaspora', 'Development'],
    body: [
      {
        _type: 'leadParagraph',
        _key: 'lead-1',
        text: 'Every month, billions of dollars flow from diaspora communities around the world to their countries of origin. For many families, these remittances are the difference between survival and prosperity.',
      },
      {
        _type: 'block',
        _key: 'block-1',
        style: 'normal',
        markDefs: [],
        children: [{ _type: 'span', _key: 'span-1', text: 'Canadian-Somali remittances alone are estimated at over $500 million annually. This money funds schools, hospitals, and small businesses, creating ripple effects that transform entire communities.', marks: [] }],
      },
    ],
  },
  {
    id: 'article-yellowknife-documentary',
    title: 'Documentary: The Somalis of Yellowknife',
    slug: 'documentary-somalis-of-yellowknife',
    excerpt: 'Braving the cold: stories of resilience from one of Canada\'s most northern communities.',
    categorySlug: 'multimedia',
    authorSlug: 'khadija-omar',
    image: 'story-documentary.jpg',
    date: '2024-10-10',
    isFeatured: false,
    placement: 'grid',
    displayOrder: 100,
    tags: ['Documentary', 'Community', 'Resilience'],
    body: [
      {
        _type: 'leadParagraph',
        _key: 'lead-1',
        text: 'At -40°C, the cold is more than a sensation—it\'s a test of will. Yet in Yellowknife, a small but vibrant Somali community has not just survived but thrived, finding warmth in each other.',
      },
      {
        _type: 'block',
        _key: 'block-1',
        style: 'normal',
        markDefs: [],
        children: [{ _type: 'span', _key: 'span-1', text: 'This 15-minute documentary explores the lives of families who traded tropical heat for arctic cold, and in doing so, discovered new definitions of home and community.', marks: [] }],
      },
    ],
  },
  {
    id: 'article-halal-investing',
    title: 'Halal Investing 101: Building Generational Wealth',
    slug: 'halal-investing-101-generational-wealth',
    excerpt: 'Financial experts share tips on ethical investing strategies for young families.',
    categorySlug: 'business',
    authorSlug: 'sahra-mohamed',
    image: 'story-finance.jpg',
    date: '2024-10-08',
    isFeatured: false,
    placement: 'grid',
    displayOrder: 100,
    tags: ['Finance', 'Investing', 'Family'],
    body: [
      {
        _type: 'leadParagraph',
        _key: 'lead-1',
        text: 'For many Muslim families, investing presents a unique challenge: how to grow wealth while adhering to Islamic principles. The answer lies in a growing field known as halal investing.',
      },
      {
        _type: 'block',
        _key: 'block-1',
        style: 'normal',
        markDefs: [],
        children: [{ _type: 'span', _key: 'span-1', text: 'Financial advisor Yusuf Ahmed has helped hundreds of families navigate this space. "It\'s not about restriction," he explains. "It\'s about aligning your money with your values while still building generational wealth."', marks: [] }],
      },
    ],
  },
];

const EVENTS = [
  {
    id: 'event-independence-day',
    title: 'Somali Independence Day Festival',
    slug: 'somali-independence-day-festival-2025',
    eventDate: '2025-07-01T14:00:00.000Z',
    location: 'Centennial Park, Etobicoke',
    type: 'Culture',
    description: 'Annual celebration of Somali independence with food, music, and cultural performances. Join us for a day of community, celebration, and heritage.',
  },
  {
    id: 'event-business-mixer',
    title: 'Diaspora Business Mixer',
    slug: 'diaspora-business-mixer-2024',
    eventDate: '2024-11-15T18:00:00.000Z',
    location: 'Metro Convention Centre',
    type: 'Networking',
    description: 'Connect with fellow entrepreneurs and business leaders from the community. An evening of networking, inspiration, and opportunity.',
  },
  {
    id: 'event-youth-gala',
    title: 'Youth Mentorship Gala',
    slug: 'youth-mentorship-gala-2024',
    eventDate: '2024-12-10T19:00:00.000Z',
    location: 'Ottawa City Hall',
    type: 'Community',
    description: 'Celebrating youth achievement and connecting mentors with emerging leaders. Formal attire. Awards ceremony and dinner included.',
  },
  {
    id: 'event-book-launch',
    title: 'Book Launch: "Nomad Chronicles"',
    slug: 'book-launch-nomad-chronicles',
    eventDate: '2024-10-30T17:00:00.000Z',
    location: 'Toronto Public Library',
    type: 'Literature',
    description: 'Join us for the launch of the new memoir exploring diaspora experiences. Meet the author, enjoy readings, and get your copy signed.',
  },
];

// =============================================================================
// MIGRATION FUNCTIONS
// =============================================================================

async function uploadImage(filename: string): Promise<string | null> {
  const imagePath = path.join(PUBLIC_IMAGES_PATH, filename);
  
  try {
    const imageAsset = await client.assets.upload('image', createReadStream(imagePath), {
      filename,
    });
    console.log(`  ✓ Uploaded image: ${filename} → ${imageAsset._id}`);
    return imageAsset._id;
  } catch (error) {
    console.error(`  ✗ Failed to upload image: ${filename}`, error);
    return null;
  }
}

async function createAuthors(imageMap: Map<string, string>): Promise<Map<string, string>> {
  console.log('\n📝 Creating Authors...');
  const authorIdMap = new Map<string, string>();

  for (const author of AUTHORS) {
    const imageAssetId = imageMap.get(author.image);
    
    const doc = {
      _id: author.id,
      _type: 'author',
      name: author.name,
      slug: { _type: 'slug', current: author.slug },
      role: author.role,
      bio: author.bio,
      ...(imageAssetId && {
        image: {
          _type: 'image',
          asset: { _type: 'reference', _ref: imageAssetId },
        },
      }),
    };

    try {
      const result = await client.createOrReplace(doc);
      authorIdMap.set(author.slug, result._id);
      console.log(`  ✓ Created author: ${author.name}`);
    } catch (error) {
      console.error(`  ✗ Failed to create author: ${author.name}`, error);
    }
  }

  return authorIdMap;
}

async function createCategories(): Promise<Map<string, string>> {
  console.log('\n📁 Creating Categories...');
  const categoryIdMap = new Map<string, string>();

  for (const category of CATEGORIES) {
    const doc = {
      _id: category.id,
      _type: 'category',
      title: category.title,
      slug: { _type: 'slug', current: category.slug },
      description: category.description,
      color: category.color,
      textColor: category.textColor,
    };

    try {
      const result = await client.createOrReplace(doc);
      categoryIdMap.set(category.slug, result._id);
      console.log(`  ✓ Created category: ${category.title}`);
    } catch (error) {
      console.error(`  ✗ Failed to create category: ${category.title}`, error);
    }
  }

  return categoryIdMap;
}

async function createArticles(
  imageMap: Map<string, string>,
  authorIdMap: Map<string, string>,
  categoryIdMap: Map<string, string>
): Promise<void> {
  console.log('\n📰 Creating Articles...');

  for (const article of ARTICLES) {
    const imageAssetId = imageMap.get(article.image);
    const authorId = authorIdMap.get(article.authorSlug);
    const categoryId = categoryIdMap.get(article.categorySlug);

    if (!authorId) {
      console.error(`  ✗ Author not found for: ${article.title}`);
      continue;
    }
    if (!categoryId) {
      console.error(`  ✗ Category not found for: ${article.title}`);
      continue;
    }

    const doc = {
      _id: article.id,
      _type: 'article',
      title: article.title,
      slug: { _type: 'slug', current: article.slug },
      excerpt: article.excerpt,
      author: { _type: 'reference', _ref: authorId },
      category: { _type: 'reference', _ref: categoryId },
      publishedAt: new Date(article.date).toISOString(),
      isFeatured: article.isFeatured,
      placement: article.placement,
      displayOrder: article.displayOrder,
      tags: article.tags,
      body: article.body,
      ...(imageAssetId && {
        mainImage: {
          _type: 'image',
          asset: { _type: 'reference', _ref: imageAssetId },
          alt: article.title,
        },
      }),
    };

    try {
      await client.createOrReplace(doc);
      console.log(`  ✓ Created article: ${article.title}`);
    } catch (error) {
      console.error(`  ✗ Failed to create article: ${article.title}`, error);
    }
  }
}

async function createEvents(): Promise<void> {
  console.log('\n📅 Creating Events...');

  for (const event of EVENTS) {
    const doc = {
      _id: event.id,
      _type: 'event',
      title: event.title,
      slug: { _type: 'slug', current: event.slug },
      eventDate: event.eventDate,
      location: event.location,
      type: event.type,
      description: event.description,
    };

    try {
      await client.createOrReplace(doc);
      console.log(`  ✓ Created event: ${event.title}`);
    } catch (error) {
      console.error(`  ✗ Failed to create event: ${event.title}`, error);
    }
  }
}

// =============================================================================
// MAIN MIGRATION
// =============================================================================

async function migrate() {
  console.log('🚀 Starting Sanity Data Migration');
  console.log(`   Project: ${projectId}`);
  console.log(`   Dataset: ${dataset}`);
  console.log('');

  // Step 1: Upload all images
  console.log('🖼️  Uploading Images...');
  const imageMap = new Map<string, string>();
  
  const allImages = [
    ...AUTHORS.map(a => a.image),
    ...ARTICLES.map(a => a.image),
  ];
  
  for (const imageName of allImages) {
    if (!imageMap.has(imageName)) {
      const assetId = await uploadImage(imageName);
      if (assetId) {
        imageMap.set(imageName, assetId);
      }
    }
  }

  // Step 2: Create authors
  const authorIdMap = await createAuthors(imageMap);

  // Step 3: Create categories
  const categoryIdMap = await createCategories();

  // Step 4: Create articles
  await createArticles(imageMap, authorIdMap, categoryIdMap);

  // Step 5: Create events
  await createEvents();

  console.log('\n✅ Migration Complete!');
  console.log(`   Authors: ${AUTHORS.length}`);
  console.log(`   Categories: ${CATEGORIES.length}`);
  console.log(`   Articles: ${ARTICLES.length}`);
  console.log(`   Events: ${EVENTS.length}`);
  console.log('\n📌 Next steps:');
  console.log('   1. Check Sanity Studio to verify data');
  console.log('   2. Visit your site to confirm articles display');
  console.log('   3. Test individual article pages');
}

// Run migration
migrate().catch(console.error);
