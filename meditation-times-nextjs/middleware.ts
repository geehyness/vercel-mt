import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Define public routes that don't require authentication
const publicRoutes = ['/', '/auth/signin', '/auth/signup'];

// Define the base path for protected routes
const protectedBasePath = '/dashboard';

export function middleware(request: NextRequest) {
  const token = cookies().get('firebaseToken')?.value;
  const pathname = request.nextUrl.pathname;

  // Check if the requested route is public
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Check if the user is trying to access a protected route
  if (pathname.startsWith(protectedBasePath)) {
    if (!token) {
      // Redirect to sign-in page with the current path as callback URL
      const signInUrl = new URL('/auth/signin', request.url);
      signInUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(signInUrl);
    }
  }

  // If none of the above conditions are met, allow the request to proceed
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};