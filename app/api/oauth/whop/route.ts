import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
  const { code } = await req.json();

  if (!code) {
    return NextResponse.json({ error: "No code" }, { status: 400 });
  }

  const client_id = process.env.NEXT_PUBLIC_WHOP_CLIENT_ID!;
  const client_secret = process.env.WHOP_CLIENT_SECRET!;
  const redirect_uri = process.env.NEXT_PUBLIC_WHOP_REDIRECT_URI!;
  const product_id = process.env.NEXT_PUBLIC_WHOP_PRODUCT_ID!;
  // Exchange code for token (OAuth 2.0 standard uses form-encoded)
  const params = new URLSearchParams();
  params.append("grant_type", "authorization_code");
  params.append("code", code);
  params.append("client_id", client_id);
  params.append("client_secret", client_secret);
  params.append("redirect_uri", redirect_uri);

  let tokenData;
  try {
    const response = await axios.post(
      "https://api.whop.com/v5/oauth/token",
      params.toString(),
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );
    tokenData = response.data;
  } catch (error: any) {
    console.error("OAuth token exchange error:", {
      status: error.response?.status,
      error: error.response?.data?.error,
      error_description: error.response?.data?.error_description,
      client_id: client_id?.substring(0, 20),
      client_secret_length: client_secret?.length,
      client_secret_starts_with: client_secret?.substring(0, 15),
      redirect_uri,
      message: "Check: 1) Client ID/Secret match, 2) Redirect URI matches exactly in Whop dashboard",
    });
    throw error;
  }
  
  const accessToken = tokenData.access_token;

  // Get user info and memberships
  const [{ data: user }, { data: membershipsResp }] = await Promise.all([
    axios.get("https://api.whop.com/v5/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    }),
    axios.get("https://api.whop.com/v5/me/memberships", {
      headers: { Authorization: `Bearer ${accessToken}` },
    }),
  ]);

  // Check for valid membership
  const memberships = membershipsResp.data ?? [];
  const isMember = memberships.some(
    (m: any) => m.valid && m.product_id === product_id
  );

  const res = NextResponse.json({ user, isMember });

  // Set cookies if member
  if (isMember) {
    res.cookies.set("whop_user", JSON.stringify(user), {
      path: "/",
      maxAge: 86400,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
    res.cookies.set("whop_member", "true", {
      path: "/",
      maxAge: 86400,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
  }

  return res;
}
