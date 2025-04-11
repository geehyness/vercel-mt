import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { client } from '@/sanity/client'

export async function GET() {
  try {
    const cookieStore = await cookies() // Add 'await' here
    const sessionId = cookieStore.get('session')?.value

    if (!sessionId) {
      return NextResponse.json({ authenticated: false, user: null })
    }

    const user = await client.fetch(
      `*[_type == "user" && _id == $id][0]{
        _id,
        name,
        email,
        avatar,
        bibleVersion,
        testimony,
        prayerRequests,
        role
      }`,
      { id: sessionId }
    )

    return NextResponse.json({
      authenticated: !!user,
      user: user || null
    })
  } catch (error) {
    console.error('Session check error:', error)
    return NextResponse.json(
      { authenticated: false, user: null },
      { status: 500 }
    )
  }
}