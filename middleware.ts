import { NextRequest, NextResponse } from "next/server";



export default function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl

    const isAuthRoute = ["/auth/login", "/auth/signup", "/auth/signup/email"]
    const token = req.cookies.get("token")

    if (isAuthRoute.includes(pathname) && token) {
        return NextResponse.redirect(new URL("/", req.url))
    }   
}