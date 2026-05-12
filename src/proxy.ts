import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Check if the user is trying to access the admin dashboard (but not the login page)
  const isProtectedAdminPath = path.startsWith('/admin') && path !== '/admin/login'
  
  // Check if they have the token that your teammate's API route sets
  const token = request.cookies.get('admin_token')?.value

  // If they are trying to access /admin without a token, kick them back to login
  if (isProtectedAdminPath && !token) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  // Otherwise, let them proceed
  return NextResponse.next()
}

// This config tells Next.js to only run this proxy on /admin routes to save performance
export const config = {
  matcher: '/admin/:path*',
}