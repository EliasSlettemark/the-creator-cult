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
  // Skip middleware for auth page to prevent redirect loops
  if (req.nextUrl.pathname === "/auth") {
    return NextResponse.next();
  }

  try {
    const { sdk } = getSdk(req);
    if (!sdk) {
      console.log("No SDK found, redirecting to auth");
      return NextResponse.redirect(new URL("/auth", req.nextUrl.origin));
    }

    const user = await sdk?.retrieveUsersProfile({});
    if (!user) {
      console.log("No user found, redirecting to auth");
      return NextResponse.redirect(new URL("/auth", req.nextUrl.origin));
    }

    const membership = await findProduct(sdk, ALLOWED_PRODUCTS);

    if (membership && req.nextUrl.pathname === "/") {
      return NextResponse.redirect(new URL("/dashboard", req.nextUrl.origin));
    }

    if (membership) return NextResponse.next();

    return NextResponse.redirect(
      getPurchaseLink(RECOMMENDED_PLAN, req.nextUrl.pathname, req.nextUrl)
    );
  } catch (error) {
    console.error("Middleware error:", error);
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
  matcher: ["/", "/dashboard/:path*"],
};
