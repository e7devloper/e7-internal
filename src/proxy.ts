import { NextResponse, type NextRequest } from 'next/server';

// Cheap gate before rendering: no session cookie, straight to sign-in. The API still checks every token.
export function proxy(req: NextRequest) {
  if (!req.cookies.has('e7_session')) {
    const url = new URL('/login', req.url);
    const next = req.nextUrl.pathname + req.nextUrl.search;
    if (next !== '/') url.searchParams.set('next', next);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!login|_next/|icon\\.png|logo|favicon).*)'],
};
