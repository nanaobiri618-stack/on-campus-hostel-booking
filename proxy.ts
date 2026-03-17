import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyJwt } from './lib/auth';

export function proxy(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  const { pathname } = request.nextUrl;

  // Public routes (Auth only)
  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/register');
  const isStaticFile = pathname.startsWith('/_next') || pathname.includes('.');

  // guests can only see Auth pages and static files
  if (!token && !isAuthPage && !isStaticFile) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // Check authentication if token exists
  const payload = token ? (verifyJwt(token) as any) : null;

  if (token && !payload && !isAuthPage) {
    // Bad token and not already on an auth page
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    const response = NextResponse.redirect(url);
    // Optional: Clear the bad cookie
    response.cookies.delete('auth_token');
    return response;
  }

  // Logged in users
  if (payload) {
    // Redirect away from login/register if already logged in
    if (isAuthPage) {
      const url = request.nextUrl.clone();
      if (payload.role === 'ADMIN') {
        url.pathname = '/admin/dashboard';
      } else if (payload.role === 'OWNER') {
        url.pathname = '/owner/dashboard';
      } else {
        url.pathname = '/hostels';
      }
      return NextResponse.redirect(url);
    }

    // Redirect logged-in users away from root
    if (pathname === '/') {
      const url = request.nextUrl.clone();
      if (payload.role === 'ADMIN') {
        url.pathname = '/admin/dashboard';
      } else if (payload.role === 'OWNER') {
        url.pathname = '/owner/dashboard';
      } else if (payload.role === 'TENANT') {
        url.pathname = payload.isVerified ? '/hostels' : '/pending-verification';
      }
      
      // ONLY redirect if the pathname actually changed to prevent loops
      if (url.pathname !== '/') {
        return NextResponse.redirect(url);
      }
    }

    // Role-based access control
    if (pathname.startsWith('/admin') && payload.role !== 'ADMIN') {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }

    if (pathname.startsWith('/owner') && payload.role !== 'OWNER' && payload.role !== 'ADMIN') {
      const url = request.nextUrl.clone();
      url.pathname = '/login'; 
      return NextResponse.redirect(url);
    }
    
    // Handle verification status for tenants
    // ALLOW BROWSING (hostels/search) even if not verified
    const isBrowsingRoute = pathname.startsWith('/hostels') || pathname.startsWith('/search');
    
    if (payload.role === 'TENANT' && !payload.isVerified && !isBrowsingRoute && pathname !== '/pending-verification') {
      const url = request.nextUrl.clone();
      url.pathname = '/pending-verification';
      return NextResponse.redirect(url);
    }

    // Redirect verified tenants away from pending-verification
    if (payload.role === 'TENANT' && payload.isVerified && pathname === '/pending-verification') {
      const url = request.nextUrl.clone();
      url.pathname = '/hostels';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

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
