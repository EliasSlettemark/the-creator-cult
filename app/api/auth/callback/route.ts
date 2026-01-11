import { NextResponse } from "next/server";
import axios from "axios";
import querystring from "querystring";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

async function handleTikTokOAuthCode(code: string, state: string) {
  // Verify state matches CSRF token
  const cookieStore = cookies();
  const csrfStateCookie = cookieStore.get("csrfState");
  
  if (!csrfStateCookie || csrfStateCookie.value !== state) {
    throw new Error("Invalid state - CSRF token mismatch");
  }

  // Verify user is authenticated
  const userCookie = cookieStore.get("whop_user");
  
  if (!userCookie) {
    throw new Error("Not authenticated");
  }

  let user;
  try {
    user = JSON.parse(userCookie.value);
  } catch {
    throw new Error("Invalid user data");
  }

  const userId = user.id;

  const clientKey = process.env.TIKTOK_CLIENT_KEY!;
  const clientSecret = process.env.TIKTOK_CLIENT_SECRET!;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const redirectUri = process.env.TIKTOK_REDIRECT_URI || `${baseUrl}/api/auth/callback`;

  // Exchange code for tokens
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

  // Check if account already exists for this user
  const { data: existingAccount } = await supabase
    .from("accounts")
    .select("id")
    .eq("user_id", userId)
    .eq("open_id", open_id)
    .single();

  const accountData = {
    user_id: userId,
    open_id: open_id,
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
      throw new Error("Failed to update account");
    }
  } else {
    // Create new account
    const { error } = await supabase.from("accounts").insert(accountData);

    if (error) {
      console.error("Error creating account:", error);
      throw new Error("Failed to create account");
    }
  }

  return { success: true };
}

export async function GET(req: Request) {
  // Handle OAuth callback redirect from TikTok
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  if (!code || !state) {
    return NextResponse.redirect(new URL("/dashboard?error=tiktok_auth_failed&reason=missing_params", req.url));
  }

  try {
    await handleTikTokOAuthCode(code, state);
    return NextResponse.redirect(new URL("/dashboard?success=account_connected", req.url));
  } catch (error: any) {
    console.error("TikTok OAuth error:", error.message || error);
    return NextResponse.redirect(new URL(`/dashboard?error=tiktok_auth_failed&reason=${encodeURIComponent(error.message)}`, req.url));
  }
}
