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
  // Skip middleware for auth-related routes
  if (req.nextUrl.pathname.startsWith("/api/auth") || req.nextUrl.pathname === "/auth") {
    return NextResponse.next();
  }

  // Check if user is authenticated via NextAuth
  if (!req.nextauth?.token) {
    return NextResponse.redirect(new URL("/auth", req.nextUrl.origin));
  }

  // If user is authenticated, check membership for protected routes
  if (req.nextUrl.pathname.startsWith("/dashboard") || req.nextUrl.pathname === "/") {
    try {
      const { sdk } = getSdk(req);
      if (!sdk) {
        // If SDK fails, redirect to auth (user needs to re-authenticate)
        return NextResponse.redirect(new URL("/auth", req.nextUrl.origin));
      }

      const user = await sdk?.retrieveUsersProfile({});
      if (!user) {
        // If user profile fails, redirect to auth
        return NextResponse.redirect(new URL("/auth", req.nextUrl.origin));
      }

      const membership = await findProduct(sdk, ALLOWED_PRODUCTS);
      
      if (!membership) {
        // No valid membership, redirect to purchase
        return NextResponse.redirect(
          getPurchaseLink(RECOMMENDED_PLAN, req.nextUrl.pathname, req.nextUrl)
        );
      }

      // User has valid membership, allow access
      if (req.nextUrl.pathname === "/") {
        return NextResponse.redirect(new URL("/dashboard", req.nextUrl.origin));
      }
      
      return NextResponse.next();
    } catch (error) {
      console.error("Middleware error:", error);
      // If there's an error, redirect to auth
      return NextResponse.redirect(new URL("/auth", req.nextUrl.origin));
    }
  }

  return NextResponse.next();
}

export default withAuth(middleware, {
  pages: {
    signIn: "/auth",
  },
});

export const config = {
  matcher: ["/", "/dashboard/:path*"],
};
