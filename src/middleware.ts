import { NextRequest, NextResponse } from 'next/server';
import { verifySessionToken, SESSION_COOKIE } from '@/lib/auth';

const PUBLIC_PATHS = ['/login', '/setup', '/api/auth/login', '/api/auth/setup', '/api/cron'];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow public paths through
  if (PUBLIC_PATHS.some(p => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const secret = process.env.APP_SECRET;
  if (!secret) {
    // Misconfiguration — show a plain error rather than an infinite loop
    return new NextResponse('APP_SECRET environment variable is not set.', { status: 503 });
  }

  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (token && await verifySessionToken(token, secret)) {
    return NextResponse.next();
  }

  // Allow internal server-to-server calls authenticated with APP_SECRET
  const internalAuth = req.headers.get('x-internal-secret');
  if (internalAuth === secret) {
    return NextResponse.next();
  }

  // Not authenticated — redirect to login
  const loginUrl = req.nextUrl.clone();
  loginUrl.pathname = '/login';
  loginUrl.search = '';
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
