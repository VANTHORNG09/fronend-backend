import { NextRequest, NextResponse } from "next/server";
import type { Role } from "@/types";

const roleRoutes: Record<string, Role> = {
  "/admin": "ADMIN",
  "/teacher": "TEACHER",
  "/student": "STUDENT"
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("accessToken")?.value;
  const role = request.cookies.get("role")?.value as Role | undefined;
  const isAuthRoute = pathname.startsWith("/login") || pathname.startsWith("/register");

  if (!token && !isAuthRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (token && isAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  for (const [prefix, requiredRole] of Object.entries(roleRoutes)) {
    if (pathname.startsWith(prefix) && role !== requiredRole) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*", "/admin/:path*", "/teacher/:path*", "/student/:path*", "/login", "/register"]
};

