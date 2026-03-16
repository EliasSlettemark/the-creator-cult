import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

function extractTikTokId(url: string): string | null {
  const match = url.trim().match(/video\/(\d+)/);
  return match ? match[1] : null;
}

function getUserId(): string | null {
  const cookieStore = cookies();
  const userCookie = cookieStore.get("whop_user");
  if (!userCookie?.value) return null;
  try {
    const user = JSON.parse(userCookie.value);
    return user?.id ?? null;
  } catch {
    return null;
  }
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ folderId: string }> }
) {
  const userId = getUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { folderId } = await params;
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
  );

  const { data: folder } = await supabase
    .from("folders")
    .select("user_id")
    .eq("id", folderId)
    .single();

  if (!folder || folder.user_id !== userId) {
    return NextResponse.json({ error: "Folder not found" }, { status: 404 });
  }

  const { data, error } = await supabase
    .from("videos")
    .select("*")
    .eq("folder_id", folderId)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data ?? []);
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ folderId: string }> }
) {
  const userId = getUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { folderId } = await params;
  let body: { url?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const rawUrl = typeof body.url === "string" ? body.url.trim() : "";
  const videoId = extractTikTokId(rawUrl);
  if (!videoId) {
    return NextResponse.json(
      { error: "Invalid TikTok URL. Paste a link like https://www.tiktok.com/@user/video/123456789" },
      { status: 400 }
    );
  }

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
  );

  const { data: folder } = await supabase
    .from("folders")
    .select("user_id")
    .eq("id", folderId)
    .single();

  if (!folder || folder.user_id !== userId) {
    return NextResponse.json({ error: "Folder not found" }, { status: 404 });
  }

  const { data, error } = await supabase
    .from("videos")
    .insert({
      folder_id: folderId,
      original_url: rawUrl,
      video_id: videoId,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
