import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Get the auth token from cookies
  const authToken = request.cookies.get('auth-token')?.value

  // Define public paths that don't require authentication
  const publicPaths = ['/login', '/signup', '/forgot-password', '/reset-password']
  
  // Check if the current path is a public path
  const isPublicPath = publicPaths.some(path => request.nextUrl.pathname.startsWith(path))
  
  // If the path is public, allow access
  if (isPublicPath) {
    // If user is already logged in and trying to access login/signup pages, redirect to dashboard
    if (authToken) {
      return NextResponse.redirect(new URL('/', request.url))
    }
    return NextResponse.next()
  }
  
  // If the path is not public and there's no auth token, redirect to login
  if (!authToken) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  // Allow access to protected routes if auth token exists
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|images).*)',
  ],
}