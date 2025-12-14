import { NextResponse } from "next/server";
import axios from "axios";
import querystring from "querystring";

export async function POST(req: Request) {
  try {
    const { code } = await req.json();

    if (!code) {
      return NextResponse.json({ error: "No code" }, { status: 400 });
    }

    const client_id = process.env.NEXT_PUBLIC_WHOP_CLIENT_ID!;
    const client_secret = process.env.WHOP_CLIENT_SECRET!;
    const redirect_uri = process.env.NEXT_PUBLIC_WHOP_REDIRECT_URI;
    const product_id = process.env.NEXT_PUBLIC_REQUIRED_PRODUCT;

    // Debug logging
    const formData = querystring.stringify({
      grant_type: "authorization_code",
      code,
      client_id,
      client_secret,
      redirect_uri,
    });

    console.log("OAuth token request:", {
      client_id: client_id?.substring(0, 15) + "...",
      client_secret_length: client_secret?.length || 0,
      client_secret_starts_with: client_secret?.substring(0, 15) || "NOT SET",
      redirect_uri,
      form_data_length: formData.length,
      form_data_preview: formData.substring(0, 100) + "...",
    });

    // OAuth token endpoints typically expect form-encoded data
    const { data: tokenData } = await axios.post(
      "https://api.whop.com/v5/oauth/token",
      formData,
      {
        headers: { 
          "Content-Type": "application/x-www-form-urlencoded",
          "Accept": "application/json",
        },
      }
    );
    const accessToken = tokenData.access_token;

  const [{ data: user }, { data: membershipsResp }] = await Promise.all([
    axios.get("https://api.whop.com/v5/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    }),
    axios.get("https://api.whop.com/v5/me/memberships", {
      headers: { Authorization: `Bearer ${accessToken}` },
    }),
  ]);

  const memberships = membershipsResp.data ?? [];
  const isMember = memberships.some(
    (m: any) => m.valid && m.product_id === product_id
  );

  const res = NextResponse.json({ user, isMember });

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
  } catch (error: any) {
    console.error("OAuth error:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      client_secret_type: process.env.WHOP_CLIENT_SECRET?.startsWith("apik_") ? "API_KEY (WRONG!)" : "CLIENT_SECRET",
    });

    return NextResponse.json(
      { 
        error: "Authentication failed",
        details: error.response?.data?.error_description || error.message 
      },
      { status: error.response?.status || 500 }
    );
  }
}