// src/app/api/auth/session/route.ts
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { client } from '@/lib/sanity/client'

export async function GET() {
  try {
    const cookieStore = cookies()
    const sessionId = cookieStore.get('session')?.value

    // Always return JSON, even for errors
    if (!sessionId) {
      return NextResponse.json(
        { authenticated: false, user: null },
        { 
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    const user = await client.fetch(
      `*[_type == "user" && _id == $id][0]{
        _id,
        name,
        email,
        role
      }`,
      { id: sessionId }
    )

    return NextResponse.json(
      { authenticated: !!user, user: user || null },
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  } catch (error) {
    console.error('Session check error:', error)
    return NextResponse.json(
      { 
        authenticated: false,
        error: 'Internal server error',
        user: null 
      },
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}