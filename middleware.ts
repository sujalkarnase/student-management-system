import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
    const token = await getToken({
        req,
        secret: process.env.AUTH_SECRET,
    });

    const { pathname } = req.nextUrl;

    if (!token) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    if (pathname.startsWith("/admin") && token.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/", req.url));
    }

    if (pathname.startsWith("/teacher") && token.role !== "TEACHER") {
        return NextResponse.redirect(new URL("/", req.url));
    }

    if (pathname.startsWith("/student") && token.role !== "STUDENT") {
        return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*", "/teacher/:path*", "/student/:path*"],
};