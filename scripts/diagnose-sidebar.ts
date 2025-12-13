
import { createClient } from 'next-sanity';
import fs from 'fs';
import path from 'path';

// Manual env var loading
const envPath = path.resolve(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const envVars = Object.fromEntries(
    envContent.split('\n').filter(Boolean).map(line => {
        const [key, ...values] = line.split('=');
        let value = values.join('=');
        if (value.startsWith('"') && value.endsWith('"')) {
            value = value.slice(1, -1);
        }
        return [key, value];
    })
);

const projectId = envVars.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = envVars.NEXT_PUBLIC_SANITY_DATASET;
const apiVersion = envVars.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01';

console.log('Project ID:', projectId);
console.log('Dataset:', dataset);

const client = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false, // We want fresh data
});

async function checkSidebar() {
    console.log('Fetching all sidebar particles...');
    const query = `*[_type == "article" && placement == "sidebar"] | order(displayOrder asc, publishedAt desc) {
    _id,
    title,
    placement,
    displayOrder,
    publishedAt
  }`;

    const articles = await client.fetch(query);
    console.table(articles);

    console.log('\n--- Simulation of current Home Page Query [0...3] ---');
    const homeQuery = `*[_type == "article" && placement == "sidebar" && defined(slug.current)] | order(displayOrder asc, publishedAt desc)[0...3] {
     _id, title
  }`;
    const homeArticles = await client.fetch(homeQuery);
    console.log('Articles that SHOULD appear on homepage:');
    console.table(homeArticles);
}

checkSidebar().catch(console.error);
