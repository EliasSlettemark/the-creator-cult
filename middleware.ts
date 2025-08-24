import getSdk from "@/lib/get-user-sdk/middleware";
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import getPurchaseLink from "@/lib/get-purchase-link";
import findProduct from "@/lib/has-product";
import { NextRequestWithAuth } from "next-auth/middleware";

const ALLOWED_PRODUCTS: string[] =
  process.env.NEXT_PUBLIC_REQUIRED_PRODUCT?.split(",") || [];
const RECOMMENDED_PLAN = process.env.NEXT_PUBLIC_RECOMMENDED_PLAN_ID || "";

async function middleware(req: NextRequestWithAuth) {
  console.log(`🔍 [MIDDLEWARE] Processing request to: ${req.nextUrl.pathname}`);
  console.log(`🔍 [MIDDLEWARE] Request method: ${req.method}`);
  console.log(`🔍 [MIDDLEWARE] NextAuth token:`, {
    hasToken: !!req.nextauth.token,
    hasAccessToken: !!req.nextauth.token?.accessToken,
    userId: req.nextauth.token?.id
  });

  // Skip middleware for auth page and OAuth callback routes to prevent redirect loops
  if (req.nextUrl.pathname === "/auth" || 
      req.nextUrl.pathname.startsWith("/api/auth/callback") ||
      req.nextUrl.pathname.startsWith("/api/auth/session") ||
      req.nextUrl.pathname.startsWith("/api/auth/signin") ||
      req.nextUrl.pathname.startsWith("/api/auth/signout") ||
      req.nextUrl.pathname === "/api/oauth") {
    console.log(`✅ [MIDDLEWARE] Skipping middleware for: ${req.nextUrl.pathname}`);
    return NextResponse.next();
  }

  console.log(`🔍 [MIDDLEWARE] Checking authentication for: ${req.nextUrl.pathname}`);

  // First check if user has a NextAuth session
  if (!req.nextauth.token) {
    console.log(`❌ [MIDDLEWARE] No NextAuth token found, redirecting to auth`);
    return NextResponse.redirect(new URL("/auth", req.nextUrl.origin));
  }

  // Check if user has access token for Whop SDK
  if (!req.nextauth.token.accessToken) {
    console.log(`❌ [MIDDLEWARE] No access token found, redirecting to auth`);
    return NextResponse.redirect(new URL("/auth", req.nextUrl.origin));
  }

  try {
    const { sdk } = getSdk(req);
    console.log(`🔍 [MIDDLEWARE] SDK result:`, !!sdk);
    
    if (!sdk) {
      console.log(`❌ [MIDDLEWARE] No SDK found, redirecting to auth`);
      return NextResponse.redirect(new URL("/auth", req.nextUrl.origin));
    }

    console.log(`🔍 [MIDDLEWARE] Retrieving user profile...`);
    const user = await sdk?.retrieveUsersProfile({});
    console.log(`🔍 [MIDDLEWARE] User profile result:`, !!user);
    
    if (!user) {
      console.log(`❌ [MIDDLEWARE] No user found, redirecting to auth`);
      return NextResponse.redirect(new URL("/auth", req.nextUrl.origin));
    }

    console.log(`🔍 [MIDDLEWARE] User authenticated:`, user.id);
    console.log(`🔍 [MIDDLEWARE] Checking product membership...`);
    
    const membership = await findProduct(sdk, ALLOWED_PRODUCTS);
    console.log(`🔍 [MIDDLEWARE] Membership result:`, !!membership);

    if (membership && req.nextUrl.pathname === "/") {
      console.log(`🔄 [MIDDLEWARE] Redirecting root to dashboard`);
      return NextResponse.redirect(new URL("/dashboard", req.nextUrl.origin));
    }

    if (membership) {
      console.log(`✅ [MIDDLEWARE] Access granted to: ${req.nextUrl.pathname}`);
      return NextResponse.next();
    }

    console.log(`❌ [MIDDLEWARE] No membership, redirecting to purchase`);
    return NextResponse.redirect(
      getPurchaseLink(RECOMMENDED_PLAN, req.nextUrl.pathname, req.nextUrl)
    );
  } catch (error) {
    console.error(`💥 [MIDDLEWARE] Error occurred:`, error);
    // On error, redirect to auth instead of causing infinite loops
    return NextResponse.redirect(new URL("/auth", req.nextUrl.origin));
  }
}

export default withAuth(middleware, {
  pages: {
    signIn: "/auth",
  },
});

export const config = {
  // Remove /auth from matcher to prevent middleware from running on auth page
  // Also exclude OAuth callback routes
  matcher: [
    "/", 
    "/dashboard/:path*",
    // Exclude auth-related API routes
    "/((?!api/auth|auth).*)"
  ],
};
