import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
  const { code } = await req.json();

  if (!code) {
    return NextResponse.json({ error: "No code" }, { status: 400 });
  }

  const client_id = process.env.NEXT_PUBLIC_WHOP_CLIENT_ID!;
  const client_secret = process.env.WHOP_SECRET!;
  const redirect_uri = process.env.NEXT_PUBLIC_WHOP_REDIRECT_URI!;
  const product_id = process.env.NEXT_PUBLIC_WHOP_PRODUCT_ID!;

  // Exchange code for token
  const { data: tokenData } = await axios.post(
    "https://api.whop.com/v5/oauth/token",
    {
      grant_type: "authorization_code",
      code,
      client_id,
      client_secret,
      redirect_uri,
    },
    {
      headers: { "Content-Type": "application/json" },
    }
  );
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