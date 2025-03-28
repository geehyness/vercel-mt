import { NextResponse } from 'next/server'
import { readClient } from '@/lib/sanity/client'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const authors = await readClient.fetch(`
      *[_type == "author"] {
        _id,
        name,
        "slug": slug.current
      } | order(name asc)
    `)

    return NextResponse.json(authors)
  } catch (error: any) {
    console.error('Sanity error:', error.message)
    return NextResponse.json(
      { error: 'Failed to fetch authors' },
      { status: 500 }
    )
  }
}