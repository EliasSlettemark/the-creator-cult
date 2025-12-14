import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow auth pages and API routes
  if (pathname === "/auth" || pathname.startsWith("/api/auth") || pathname.startsWith("/auth/callback")) {
    return NextResponse.next();
  }

  // Check for membership cookie
  const isMember = req.cookies.get("whop_member")?.value === "true";

  if (!isMember) {
    return NextResponse.redirect(new URL("/auth", req.nextUrl.origin));
  }

  // Redirect root to dashboard
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl.origin));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard/:path*", "/auth/:path*"],
};
