import { NextRequest, NextResponse } from 'next/server';

const isAuthRoute = ['/auth/login', '/auth/signup', '/auth/signup/email'];

export default function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;
    const token = req.cookies.get('token');

    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/api') ||
        pathname.startsWith('/static') ||
        pathname.startsWith('/favicon.ico')
    ) {
        return NextResponse.next();
    }

    if (isAuthRoute.includes(pathname) && token) {
        console.log('redirecting to home');
        return NextResponse.redirect(new URL('/', req.url));
    }

    if (!token && !isAuthRoute.includes(pathname)) {
        console.log('redirecting to login');
        return NextResponse.redirect(new URL('/auth/login', req.url));
    }

    return NextResponse.next();
}
