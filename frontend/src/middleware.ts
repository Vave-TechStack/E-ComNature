import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Admin routes - require ADMIN role
    if (path.startsWith('/admin') && token?.role !== 'ROLE_ADMIN') {
      return NextResponse.redirect(new URL('/auth/login', req.url));
    }

    // Staff routes - require staff roles
    if (path.startsWith('/staff') && !token?.role?.includes('STAFF')) {
      return NextResponse.redirect(new URL('/auth/login', req.url));
    }

    return NextResponse.next();
  },
  {
    secret: process.env.NEXTAUTH_SECRET || 'e-com-nature-super-secret-key-2026-production',
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;

        // Admin routes - require admin role if token present
        if (path.startsWith('/admin')) {
          if (token) {
            return token?.role === 'ROLE_ADMIN';
          }
          return true;
        }

        // Staff routes - require staff roles if token present
        if (path.startsWith('/staff')) {
          if (token) {
            return token?.role === 'ROLE_ADMIN' || 
                   token?.role === 'ROLE_WAREHOUSE_STAFF' ||
                   token?.role === 'ROLE_DELIVERY_STAFF';
          }
          return true;
        }

        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    '/checkout/:path*',
    '/orders/:path*',
    '/profile/:path*',
    '/admin/:path*',
    '/staff/:path*',
    '/support/:path*',
  ],
};
