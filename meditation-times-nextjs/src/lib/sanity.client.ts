import { createClient } from '@sanity/client';

// General Sanity client for fetching data
export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2023-05-03', // Use the latest API version
  useCdn: false, // Always fetch fresh data
  token: process.env.SANITY_API_TOKEN, // Required for write operations
});

// Sanity client for real-time updates
export const sanityLiveClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2023-05-03', // Use the latest API version
  useCdn: false, // Always fetch fresh data
  token: process.env.SANITY_API_TOKEN, // Required for write operations
});