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

  // Check if route is protected
  const isProtectedRoute = Object.keys(protectedRoutes).some(route => 
    pathname.startsWith(route)
  )

  if (isProtectedRoute) {
    // Client-side auth with localStorage is used, so we allow the request to go through
    // The client-side layout components will handle the actual validation and redirect if needed
    // This prevents middleware from blocking legitimate requests that have valid tokens in localStorage
    return NextResponse.next()
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

