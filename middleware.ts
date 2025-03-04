import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  // 🔹 Define protected routes (pages that require authentication)
  const protectedRoutes = ["/dashboard", "/profile", "/settings"];

  // 🔹 Allow public routes (pages accessible without login)
  const publicRoutes = ["/", "/login", "/signup"];

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // 🔹 If the user is NOT logged in and tries to access a protected route, redirect to login
  if (!token && protectedRoutes.includes(req.nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // 🔹 If the user is logged in and tries to access login/signup, redirect to dashboard
  if (token && publicRoutes.includes(req.nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

// 🔹 Configure middleware to match all routes
export const config = {
  matcher: ["/((?!_next|static|favicon.ico).*)"], // Exclude Next.js static files
};