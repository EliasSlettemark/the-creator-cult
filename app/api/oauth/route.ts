import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const csrfState = Math.random().toString(36).substring(2);

  cookies().set("csrfState", csrfState, { 
    maxAge: 60000,
  });

  let url = "https://www.tiktok.com/v2/auth/authorize/";
  url += `?client_key=${process.env.TIKTOK_CLIENT_KEY}`;
  url += "&scope=user.info.basic,user.info.profile,user.info.stats,video.list";
  url += "&response_type=code";
  url += `&redirect_uri=${process.env.TIKTOK_REDIRECT_URI}`;
  url += `&state=${csrfState}`;

  console.log("generated url", url);

  return NextResponse.json({ url });
}