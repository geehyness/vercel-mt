// src/app/api/auth/signin/route.ts
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { client } from '@/lib/sanity.client'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    const user = await client.fetch(
      `*[_type == "user" && email == $email][0]`,
      { email }
    )

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    const response = NextResponse.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    })

    response.cookies.set({
      name: 'session',
      value: user._id,
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7
    })

    return response
  } catch (error) {
    console.error('Signin error:', error)
    console.log("cookies", cookies)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}