import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import axios from "axios";
import querystring from "querystring";

export async function GET() {
  const supabase = createClient(
    process.env.SUPABASE_URL as string,
    process.env.SUPABASE_ANON_KEY as string
  );

  const { data: accounts, error } = await supabase.from("accounts").select("*");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!accounts || accounts.length === 0) {
    return NextResponse.json({ error: "No accounts found" }, { status: 404 });
  }

  let refreshed = 0;
  let failed = 0;
  let errors: any[] = [];

  for (const account of accounts) {
    if (!account.refresh_token) continue;
    try {
      const params = {
        client_key: process.env.TIKTOK_CLIENT_KEY,
        client_secret: process.env.TIKTOK_CLIENT_SECRET,
        grant_type: "refresh_token",
        refresh_token: account.refresh_token,
      };

      console.log("TikTok authenticate params");
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

      const { error } = await supabase
        .from("accounts")
        .update({
          access_token,
          refresh_token,
          access_token_expires_at: new Date(Date.now() + expires_in * 1000),
          refresh_token_expires_at: new Date(
            Date.now() + refresh_expires_in * 1000
          ),
        })
        .eq("id", account.id);

      if (error) {
        failed++;
        errors.push({ id: account.id, error: error.message });
      } else {
        refreshed++;
      }
    } catch (err: any) {
      failed++;
      errors.push({
        id: account.id,
        error: err?.response?.data || err.message,
      });
    }
  }

  return NextResponse.json({ refreshed, failed, errors });
}
