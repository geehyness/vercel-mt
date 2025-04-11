import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import { SanityImageSource } from '@sanity/image-url/lib/types/types';

const config = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-03-30',
  token: process.env.NEXT_PUBLIC_SANITY_WRITE_TOKEN,
  ignoreBrowserTokenWarning: true,
};

export const readClient = createClient({
  ...config,
  useCdn: true,
  token: process.env.SANITY_READ_TOKEN,
  perspective: 'published'
});

export const writeClient = createClient({
  ...config,
  useCdn: false,
  perspective: 'raw'
});

export const client = writeClient;

export const urlFor = (source: SanityImageSource) => 
  imageUrlBuilder(readClient).image(source);

export const sanityFetch = async <T>(query: string, params = {}) => {
  try {
    return await readClient.fetch<T>(query, params);
  } catch (error) {
    console.error('Sanity fetch error:', error);
    throw error;
  }
};