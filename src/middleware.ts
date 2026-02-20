import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const hasRefreshToken = request.cookies.has('refresh_token');
  const pathname = request.nextUrl.pathname;
  const isDashboardPage = pathname.startsWith('/dashboard');

  if (isDashboardPage && !hasRefreshToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};