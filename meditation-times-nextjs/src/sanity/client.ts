import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

// Read-only client (uses CDN)
export const readClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-03-30',
  useCdn: true,  // Always use CDN for reads
  token: process.env.SANITY_READ_TOKEN,
  perspective: 'published'  // Only fetch published documents
})

// Write client (no CDN)
export const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-03-30',
  useCdn: false,  // Never use CDN for writes
  token: process.env.SANITY_WRITE_TOKEN,
  perspective: 'raw'  // Needed for draft operations
})

// Image URL builder (uses read client)
export const urlFor = (source: any) => 
  imageUrlBuilder(readClient).image(source)