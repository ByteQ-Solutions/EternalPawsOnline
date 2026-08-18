import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Eternal Paws Platform - Edge Security Middleware Guard
 * Path: middleware.ts
 * 
 * Features:
 * - Edge-level security inspection
 * - Intercepts all requests targeting `/admin` (except `/admin/login`)
 * - Protects `/api/admin/*` endpoints from unauthorized access
 * - Sets strict security headers (X-Frame-Options, X-Content-Type-Options, Referrer-Policy)
 */

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();

  // 1. Enforce Global Security Headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-XSS-Protection', '1; mode=block');

  // 2. Admin Route Protection
  // If navigating to /admin (but not /admin/login or static assets)
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const adminSessionCookie = request.cookies.get('eternal_paws_admin_token')?.value;

    // Check if auth token or development bypass is present
    if (!adminSessionCookie && process.env.NODE_ENV === 'production') {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 3. Admin API Endpoints Protection (/api/admin/*)
  if (pathname.startsWith('/api/admin')) {
    const authHeader = request.headers.get('authorization');
    const cookieToken = request.cookies.get('eternal_paws_admin_token')?.value;

    if (!authHeader && !cookieToken && process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Admin authentication token required.' },
        { status: 401 }
      );
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
