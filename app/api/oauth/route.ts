import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const clientKey = process.env.TIKTOK_CLIENT_KEY;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const redirectUri = process.env.TIKTOK_REDIRECT_URI || `${baseUrl}/api/auth/callback`;
  
  if (!clientKey) {
    return NextResponse.json({ error: "TikTok client key not configured" }, { status: 500 });
  }

  const cookieStore = cookies();
  const userCookie = cookieStore.get("whop_user");
  
  if (!userCookie) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  let user;
  try {
    user = JSON.parse(userCookie.value);
  } catch {
    return NextResponse.json({ error: "Invalid user data" }, { status: 400 });
  }

  // Generate state for CSRF protection (matching working version format)
  const csrfState = Math.random().toString(36).substring(2);
  cookieStore.set("csrfState", csrfState, { 
    maxAge: 60000,
  });

  // Build URL matching the working version exactly
  let url = "https://www.tiktok.com/v2/auth/authorize/";
  url += `?client_key=${clientKey}`;
  url += "&scope=user.info.basic,user.info.profile,user.info.stats,video.list";
  url += "&response_type=code";
  url += `&redirect_uri=${encodeURIComponent(redirectUri)}`;
  url += `&state=${csrfState}`;

  return NextResponse.json({ url });
}

