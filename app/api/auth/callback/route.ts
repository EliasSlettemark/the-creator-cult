// http://localhost:3000/api/auth/callback/tiktok?code=tj9R91EhtezcGDEJ5_mrzDIE_XAIKDPdU3velowZJg55Vnn8O9CqFr-4EIJuy8v3ub1wVzPY1qRR6zW-o7K3fz6I9SsLB1-d3D6KL3AnPGP0tfb5OVGeqN7O6XGdDixuxMov2aOeP70DbI5ALlfW3YqziGz0RiynIxi5PXoaND5WmYUF83sI59rnhBskdNza*0%215691.e1&scopes=user.info.basic%2Cvideo.publish%2Cvideo.upload%2Cvideo.list
import { NextResponse } from "next/server";
import axios from "axios";
import { createClient } from "@supabase/supabase-js";
import querystring from "querystring";
import getSdk from "@/lib/get-user-sdk/app";

export async function GET(request: Request) {
  const { sdk } = await getSdk();

  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.json({ error: "Code not found" }, { status: 404 });
  }

  const supabase = createClient(
    process.env.SUPABASE_URL as string,
    process.env.SUPABASE_ANON_KEY as string
  );

  if (!sdk) {
    return NextResponse.json({ error: "SDK not found" }, { status: 404 });
  }

  const user = await sdk?.retrieveUsersProfile({})

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  try {
    const decode = decodeURI(code);
    const params = {
      client_key: process.env.TIKTOK_CLIENT_KEY,
      client_secret: process.env.TIKTOK_CLIENT_SECRET,
      code: decode,
      grant_type: "authorization_code",
      redirect_uri: process.env.TIKTOK_REDIRECT_URI,
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

    const { data, error } = await supabase.from("accounts").insert({
      user_id: user.id,
      username: user.username, 
      profile_pic_url: user.profile_pic_url,
      display_name: display_name,
      avatar_url: avatar_url,
      access_token,
      refresh_token,
      access_token_expires_at: new Date(Date.now() + expires_in * 1000),
      refresh_token_expires_at: new Date(
        Date.now() + refresh_expires_in * 1000
      ),
    });

    return NextResponse.redirect(new URL("/dashboard", request.url));
  } catch (error: any) {
    console.log(error.response.data.error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
