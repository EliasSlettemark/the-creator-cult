import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import getPurchaseLink from "@/lib/get-purchase-link";
import findProduct from "@/lib/has-product";

const ALLOWED_PRODUCTS: string[] =
  process.env.NEXT_PUBLIC_REQUIRED_PRODUCT?.split(",") || [];
const RECOMMENDED_PLAN = process.env.NEXT_PUBLIC_RECOMMENDED_PLAN_ID || "";

export default withAuth(
  async function middleware(req) {
    // Skip middleware for auth page to prevent redirect loops
    if (req.nextUrl.pathname === "/auth") {
      return NextResponse.next();
    }

    // Get the session from NextAuth
    const session = req.nextauth.token;
    
    if (!session) {
      return NextResponse.redirect(new URL("/auth", req.nextUrl.origin));
    }

    // For now, allow access to dashboard if authenticated
    // You can add product checking logic here later
    if (req.nextUrl.pathname === "/") {
      return NextResponse.redirect(new URL("/dashboard", req.nextUrl.origin));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/auth",
    },
  }
);

export const config = {
  matcher: ["/", "/dashboard/:path*"],
};
