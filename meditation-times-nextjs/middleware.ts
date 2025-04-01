import { NextRequest, NextResponse } from 'next/server';
// middleware.ts (client-side alternative)
import { cookies } from 'next/headers'

export function middleware(request: NextRequest) {
  const token = cookies().get('firebaseToken')
  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/auth/signin', request.url))
  }
  return NextResponse.next()
}