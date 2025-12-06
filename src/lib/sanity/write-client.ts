import { createClient } from '@sanity/client';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const token = process.env.SANITY_WRITE_TOKEN;

if (!projectId) {
  console.warn('Missing NEXT_PUBLIC_SANITY_PROJECT_ID');
}

if (!token) {
  console.warn('Missing SANITY_WRITE_TOKEN - write operations will fail');
}

export const writeClient = createClient({
  projectId: projectId || '',
  dataset,
  apiVersion: '2024-01-01',
  useCdn: false,
  token,
});

export async function uploadImageToSanity(file: File): Promise<string | null> {
  try {
    const asset = await writeClient.assets.upload('image', file, {
      filename: file.name,
    });
    return asset._id;
  } catch (error) {
    console.error('Error uploading image to Sanity:', error);
    return null;
  }
}
