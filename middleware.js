import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Protect all /admin routes except /admin/login
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    // Fail closed: if JWT_SECRET is missing, deny access instead of
    // falling back to a guessable hardcoded default.
    if (!process.env.JWT_SECRET) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);

    const token = request.cookies.get('rp_admin_token')?.value;

    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    try {
      await jwtVerify(token, secret);
      return NextResponse.next();
    } catch {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
