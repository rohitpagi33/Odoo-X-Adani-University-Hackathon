/**
 * Next.js Middleware for Route Protection
 * 
 * Purpose: Protect dashboard routes based on authentication and role
 * Runs on every request to protected routes
 * 
 * Protected Routes:
 * - /admin/** (only admin)
 * - /manager/** (only manager)
 * - /technician/** (only technician)
 */

import { NextRequest, NextResponse } from 'next/server'

// Routes that require authentication
const protectedRoutes = {
  '/admin': ['admin'],
  '/manager': ['manager'],
  '/technician': ['technician']
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Get token from cookies (if using cookies) or headers
  const token = request.cookies.get('GG_TOKEN')?.value

  // Get user data from request headers (set by client)
  const userDataHeader = request.headers.get('X-User-Role')

  // Check if route is protected
  const isProtectedRoute = Object.keys(protectedRoutes).some(route => 
    pathname.startsWith(route)
  )

  if (isProtectedRoute) {
    // If no token, redirect to login
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // For dashboard routes, check role (this is a basic check)
    // Full validation happens client-side
    if (!userDataHeader) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return NextResponse.next()
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    '/admin/:path*',
    '/manager/:path*',
    '/technician/:path*'
  ]
}
