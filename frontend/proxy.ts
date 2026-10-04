// proxy.ts
import { NextRequest, NextResponse } from "next/server";

const AUTH_ROUTES = ["/login", "/signup",'/forgot-password','/reset-password'];
const PROTECTED_ROUTES = ["/"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;

  const isAuthRoute = AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    route === "/" ? pathname === "/" : pathname.startsWith(route)
  );

  // Logged in -> keep them out of login/signup
  if (token && isAuthRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Not logged in -> keep them out of protected pages
  if (!token && isProtectedRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/signup","/forgot-password",'/reset-password/:path*'],
};