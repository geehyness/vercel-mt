import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

// Read client (public data)
export const readClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-03-30',
  useCdn: true,
  token: process.env.SANITY_READ_TOKEN,
  perspective: 'published'
});

// Write client (authenticated mutations)
export const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-03-30',
  useCdn: false,
  token: process.env.SANITY_WRITE_TOKEN,
  ignoreBrowserTokenWarning: true,
  perspective: 'raw'
});

// Image URL builder
const builder = imageUrlBuilder(readClient);
export const urlFor = (source: any) => builder.image(source);