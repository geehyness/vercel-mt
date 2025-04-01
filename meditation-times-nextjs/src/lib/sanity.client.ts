import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

const config = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-03-30',
  useCdn: process.env.NODE_ENV === 'production',
  token: process.env.NEXT_PUBLIC_SANITY_WRITE_TOKEN,
};

export const readClient = createClient({
  ...config,
  token: process.env.SANITY_READ_TOKEN,
  perspective: 'published'
});

export const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-03-30',
  token: process.env.NEXT_PUBLIC_SANITY_WRITE_TOKEN,
  useCdn: false,
  perspective: 'raw'
});

export const client = writeClient;

export const urlFor = (source: SanityImageSource) => 
  imageUrlBuilder(readClient).image(source);

export async function sanityFetch<T>(
  query: string,
  params: Record<string, unknown> = {}
): Promise<T> {
  try {
    return await readClient.fetch<T>(query, params);
  } catch (error) {
    console.error('Sanity fetch error:', error);
    throw error;
  }
}

// Type helpers
export interface SanityDocument {
  _id: string;
  _type: string;
  _createdAt: string;
  _updatedAt?: string;
  _rev?: string;
}

export interface SanityReference {
  _type: 'reference';
  _ref: string;
}