import { NextRequest, NextResponse } from 'next/server';

const isAuthRoute = ['/auth/login', '/auth/signup', '/auth/signup/email', '/auth/signup/ngo'];
const pureAuthRoutes = ['/auth/login', '/auth/signup', '/auth/signup/email'];

const PUBLIC_FILE = /\.(.*)$/;

export default function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;
    const token = req.cookies.get('token');

    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/api') ||
        pathname.startsWith('/static') ||
        pathname.startsWith('/icons') ||
        pathname.startsWith('/favicon.ico') ||
        PUBLIC_FILE.test(pathname)
    ) {
        return NextResponse.next();
    }

    if (pureAuthRoutes.includes(pathname) && token) {
        console.log('redirecting to home');
        return NextResponse.redirect(new URL('/', req.url));
    }

    if (!token && !isAuthRoute.includes(pathname)) {
        console.log('redirecting to login');
        return NextResponse.redirect(new URL('/auth/login', req.url));
    }

    return NextResponse.next();
}
