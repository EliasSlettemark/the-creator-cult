import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const OAUTH_SCOPES = [
  "user.info.basic",
  "user.info.profile",
  "user.info.stats",
];

export async function GET() {
  const clientKey = process.env.TIKTOK_CLIENT_KEY;
  const redirectUri = process.env.TIKTOK_REDIRECT_URI;

  if (!clientKey || !redirectUri) {
    return NextResponse.json(
      {
        error:
          "TikTok OAuth is not configured. Please set TIKTOK_CLIENT_KEY and TIKTOK_REDIRECT_URI.",
      },
      { status: 500 }
    );
  }

  const csrfState = crypto.randomUUID();

  cookies().set("csrfState", csrfState, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 300,
  });

  const url = new URL("https://www.tiktok.com/v2/auth/authorize/");
  url.searchParams.set("client_key", clientKey);
  url.searchParams.set("scope", OAUTH_SCOPES.join(","));
  url.searchParams.set("response_type", "code");
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("state", csrfState);

  return NextResponse.json({ url: url.toString() });
}