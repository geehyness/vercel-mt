import { NextResponse } from 'next/server'
import { createClient } from 'next-sanity'

// Type definitions
interface Author {
  _id: string
  name: string
  slug: string
  bio?: string
  image?: {
    asset?: {
      _ref: string
      _type: 'reference'
    }
  }
}

// Configuration
export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'

const getSanityClient = () => {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 
                   process.env.VERCEL_SANITY_PROJECT_ID

  if (!projectId) {
    throw new Error('Missing Sanity project ID')
  }

  return createClient({
    projectId,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    apiVersion: '2023-05-03',
    token: process.env.SANITY_READ_TOKEN,
    useCdn: process.env.NODE_ENV === 'production' // Use CDN in production
  })
}

export async function GET(request: Request) {
  // Log the incoming request
  console.log(`[${new Date().toISOString()}] GET /api/authors`)

  try {
    // Validate configuration
    const client = getSanityClient()

    // Fetch authors with enhanced query
    const authors = await client.fetch<Author[]>(`
      *[_type == "author"] {
        _id,
        name,
        "slug": slug.current,
        bio,
        image {
          asset-> {
            _ref,
            _type,
            url
          }
        }
      } | order(name asc)
    `)

    console.log(`Found ${authors?.length || 0} authors`)

    if (!authors?.length) {
      return NextResponse.json(
        { 
          error: 'No authors found',
          suggestion: 'Please create author documents in Sanity Studio'
        },
        { 
          status: 404,
          headers: {
            'Cache-Control': 'no-store, max-age=0'
          }
        }
      )
    }

    return NextResponse.json(authors, {
      headers: { 
        'Cache-Control': 'no-store, max-age=0',
        'X-Authors-Count': authors.length.toString()
      }
    })

  } catch (error: unknown) {
    console.error('Error in /api/authors:', error)
    
    const status = error instanceof Error && 
                  error.message.includes('Missing Sanity project ID') 
                  ? 500 
                  : 400

    return NextResponse.json(
      { 
        error: 'Failed to fetch authors',
        details: process.env.NODE_ENV === 'development' 
          ? error instanceof Error 
            ? error.message 
            : 'Unknown error'
          : null,
        timestamp: new Date().toISOString()
      },
      { 
        status,
        headers: {
          'Cache-Control': 'no-store, max-age=0'
        }
      }
    )
  }
}