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
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;

        // Admin routes - require admin role
        if (path.startsWith('/admin')) {
          return token?.role === 'ROLE_ADMIN';
        }

        // Staff routes - require staff roles
        if (path.startsWith('/staff')) {
          return !!token && (token?.role === 'ROLE_ADMIN' || 
                 token?.role === 'ROLE_WAREHOUSE_STAFF' ||
                 token?.role === 'ROLE_DELIVERY_STAFF');
        }

        // Protected routes - require authentication
        // Only checkout and user-specific routes require authentication
        const protectedRoutes = ['/checkout', '/orders', '/profile', '/support'];
        
        if (protectedRoutes.some(route => path.startsWith(route))) {
          return !!token;
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
