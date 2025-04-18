// app/api/authors/route.ts
import { NextResponse } from 'next/server'
import { createClient } from 'next-sanity'

export const dynamic = 'force-dynamic'
export const revalidate = 0 // Disable cache

// Initialize Sanity client (reuse this config across routes)
function getSanityClient() {
  return createClient({
    projectId: 
      process.env.SANITY_PROJECT_ID ||
      process.env.VERCEL_SANITY_PROJECT_ID ||
      '', // Fallback to empty string to trigger clear error
    
    dataset: 
      process.env.NEXT_PUBLIC_SANITY_DATASET || 
      'production', // Default dataset
    
    apiVersion: '2023-05-03', // Match your studio config
    token: 
      process.env.SANITY_READ_TOKEN||
      process.env.SANITY_READ_TOKEN,
    useCdn: false // API routes always bypass CDN
  })
}

export async function GET() {
  // Validate environment
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID && !process.env.VERCEL_SANITY_PROJECT_ID) {
    console.error('Missing Sanity project ID')
    return NextResponse.json(
      { error: 'Server configuration error' },
      { status: 500 }
    )
  }

  const client = getSanityClient()

  try {
    const authors = await client.fetch(`
      *[_type == "author"] {
        _id,
        name,
        "slug": slug.current,
        bio,
        image
      } | order(name asc)
    `)

    if (!authors) {
      return NextResponse.json(
        { error: 'No authors found' },
        { status: 404 }
      )
    }

    return NextResponse.json(authors, {
      headers: {
        'Cache-Control': 'no-store, max-age=0'
      }
    })

  } catch (error: unknown) {
    let errorMessage = 'An unexpected error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'object' && error !== null && 'message' in error) {
      errorMessage = String(error.message);
    }
    console.error('Sanity query failed:', errorMessage);
    return NextResponse.json(
      {
        error: 'Failed to fetch authors'+ errorMessage, // You might want to adjust this message
      },
      { status: 500 }
    );
  }
}