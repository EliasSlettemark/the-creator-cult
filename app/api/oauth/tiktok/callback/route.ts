import { NextResponse } from "next/server";
import axios from "axios";
import querystring from "querystring";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const { code, state } = await req.json();

  if (!code || !state) {
    return NextResponse.json({ error: "Missing code or state" }, { status: 400 });
  }

  // Verify state matches CSRF token
  const cookieStore = cookies();
  const csrfStateCookie = cookieStore.get("csrfState");
  
  if (!csrfStateCookie || csrfStateCookie.value !== state) {
    return NextResponse.json({ error: "Invalid state - CSRF token mismatch" }, { status: 400 });
  }

  // Verify user is authenticated
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

  const userId = user.id;

  const clientKey = process.env.TIKTOK_CLIENT_KEY!;
  const clientSecret = process.env.TIKTOK_CLIENT_SECRET!;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const redirectUri = process.env.TIKTOK_REDIRECT_URI || `${baseUrl}/oauth/tiktok/callback`;

  // Exchange code for tokens
  try {
    const params = {
      client_key: clientKey,
      client_secret: clientSecret,
      code: code,
      grant_type: "authorization_code",
      redirect_uri: redirectUri,
    };

    const {
      data: { access_token, expires_in, refresh_token, refresh_expires_in, open_id },
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

    // Get user info from TikTok
    const { data: userInfo } = await axios.get(
      "https://open.tiktokapis.com/v2/user/info/",
      {
        params: {
          fields: "open_id,union_id,avatar_url,display_name,username",
        },
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    const tiktokUser = userInfo.data.user;

    // Save account to database
    const supabase = createClient(
      process.env.SUPABASE_URL as string,
      process.env.SUPABASE_ANON_KEY as string
    );

    // Check if account already exists for this user and username
    // Note: The accounts table doesn't have an open_id column, so we use user_id + username to identify accounts
    const { data: existingAccount } = await supabase
      .from("accounts")
      .select("id")
      .eq("user_id", userId)
      .eq("username", tiktokUser.username)
      .single();

    const accountData = {
      user_id: userId,
      access_token,
      refresh_token,
      access_token_expires_at: new Date(Date.now() + expires_in * 1000).toISOString(),
      refresh_token_expires_at: new Date(Date.now() + refresh_expires_in * 1000).toISOString(),
      display_name: tiktokUser.display_name || tiktokUser.username,
      username: tiktokUser.username,
      avatar_url: tiktokUser.avatar_url,
    };

    if (existingAccount) {
      // Update existing account
      const { error } = await supabase
        .from("accounts")
        .update(accountData)
        .eq("id", existingAccount.id);

      if (error) {
        console.error("Error updating account:", error);
        return NextResponse.json({ error: "Failed to update account" }, { status: 500 });
      }
    } else {
      // Create new account
      const { error } = await supabase.from("accounts").insert(accountData);

      if (error) {
        console.error("Error creating account:", error);
        return NextResponse.json({ error: "Failed to create account" }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("TikTok OAuth error:", error.response?.data || error.message);
    return NextResponse.json(
      { error: error.response?.data?.error_description || "Failed to authenticate with TikTok" },
      { status: 500 }
    );
  }
}

