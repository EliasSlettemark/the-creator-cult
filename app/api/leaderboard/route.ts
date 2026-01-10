import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const period = searchParams.get("period") || "week";
  const limit = parseInt(searchParams.get("limit") || "100", 10);

  const supabase = createClient(
    process.env.SUPABASE_URL as string,
    process.env.SUPABASE_ANON_KEY as string
  );

  let orderBy = "rank_this_week";
  if (period === "month") {
    orderBy = "rank_this_month";
  }

  const { data, error } = await supabase
    .from("leaderboard")
    .select("*")
    .order(orderBy, { ascending: true })
    .limit(limit);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Filter out demo/test users
  const filteredData = data?.filter(
    (entry) => 
      entry.username && 
      !entry.username.toLowerCase().includes('demo') && 
      !entry.user_id?.toLowerCase().includes('demo')
  ) || [];

  return NextResponse.json({ data: filteredData });
} 