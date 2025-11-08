// http://localhost:3000/api/auth/callback/tiktok?code=tj9R91EhtezcGDEJ5_mrzDIE_XAIKDPdU3velowZJg55Vnn8O9CqFr-4EIJuy8v3ub1wVzPY1qRR6zW-o7K3fz6I9SsLB1-d3D6KL3AnPGP0tfb5OVGeqN7O6XGdDixuxMov2aOeP70DbI5ALlfW3YqziGz0RiynIxi5PXoaND5WmYUF83sI59rnhBskdNza*0%215691.e1&scopes=user.info.basic%2Cvideo.publish%2Cvideo.upload%2Cvideo.list
import axios from "axios";
import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import querystring from "querystring";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  const storedState = cookies().get("csrfState")?.value;
  cookies().delete("csrfState");

  if (!state || !storedState || state !== storedState) {
    return NextResponse.redirect(
      new URL("/auth?error=state_mismatch", request.url)
    );
  }

  if (!code) {
    return NextResponse.redirect(new URL("/auth?error=missing_code", request.url));
  }

  const session = await getServerSession(authOptions);

  const sessionUser = session?.user as
    | {
        id: string;
        name?: string | null;
        email?: string | null;
        image?: string | null;
      }
    | undefined;

  if (!sessionUser?.id) {
    return NextResponse.redirect(new URL("/auth?error=unauthenticated", request.url));
  }

  const clientKey = process.env.TIKTOK_CLIENT_KEY;
  const clientSecret = process.env.TIKTOK_CLIENT_SECRET;
  const redirectUri = process.env.TIKTOK_REDIRECT_URI;

  if (!clientKey || !clientSecret || !redirectUri) {
    return NextResponse.redirect(
      new URL("/auth?error=oauth_not_configured", request.url)
    );
  }

  const supabase = createClient(
    process.env.SUPABASE_URL as string,
    process.env.SUPABASE_ANON_KEY as string
  );

  try {
    const params = {
      client_key: clientKey,
      client_secret: clientSecret,
      code: decodeURIComponent(code),
      grant_type: "authorization_code",
      redirect_uri: redirectUri,
    };

    const {
      data: { access_token, expires_in, refresh_token, refresh_expires_in },
    } = await axios.post(
      "https://open.tiktokapis.com/v2/oauth/token/",
      querystring.stringify(params),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Cache-Control": "no-cache",
        },
      }
    );

    const {
      data: {
        data: {
          user: { display_name, avatar_url },
        },
      },
    } = await axios.get(
      "https://open.tiktokapis.com/v2/user/info/?fields=display_name,avatar_url",
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    const { error } = await supabase.from("accounts").insert({
      user_id: sessionUser.id,
      username: sessionUser.name ?? sessionUser.email ?? "Creator",
      profile_pic_url: sessionUser.image,
      display_name,
      avatar_url,
      access_token,
      refresh_token,
      access_token_expires_at: new Date(Date.now() + expires_in * 1000),
      refresh_token_expires_at: new Date(
        Date.now() + refresh_expires_in * 1000
      ),
    });

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.redirect(new URL("/dashboard", request.url));
  } catch (error: any) {
    console.error(error.response?.data?.error || error.message);
    return NextResponse.redirect(new URL("/auth?error=tiktok_oauth", request.url));
  }
}
