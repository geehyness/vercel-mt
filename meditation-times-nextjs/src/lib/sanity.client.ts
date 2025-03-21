import { createClient } from "@sanity/client";

// Initialize and export the Sanity client
export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2023-05-03", // Use a recent API version
  useCdn: true, // Enable CDN for faster responses
});