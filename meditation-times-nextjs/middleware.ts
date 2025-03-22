import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get the Firebase token from the request cookies
  const token = request.cookies.get('firebaseToken')?.value;

  // Protect dashboard routes
  if (pathname.startsWith('/dashboard')) {
    if (!token) {
      // Redirect to sign-in page if no token is found
      return NextResponse.redirect(new URL('/auth/signin', request.url));
    }

    try {
      // Verify the Firebase token using the Admin SDK
      const decodedToken = await adminAuth.verifyIdToken(token);
      if (!decodedToken) {
        // Redirect to sign-in page if the token is invalid
        return NextResponse.redirect(new URL('/auth/signin', request.url));
      }
    } catch (error) {
      // Redirect to sign-in page if token verification fails
      return NextResponse.redirect(new URL('/auth/signin', request.url));
    }
  }

  return NextResponse.next();
}