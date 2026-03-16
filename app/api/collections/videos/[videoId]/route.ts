import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

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

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ videoId: string }> }
) {
  const userId = getUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { videoId } = await params;
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
  );

  const { data: video, error: videoError } = await supabase
    .from("videos")
    .select("id, folder_id")
    .eq("id", videoId)
    .single();

  if (videoError || !video) {
    return NextResponse.json({ error: "Video not found" }, { status: 404 });
  }

  const { data: folder } = await supabase
    .from("folders")
    .select("user_id")
    .eq("id", video.folder_id)
    .single();

  if (!folder || folder.user_id !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { error: deleteError } = await supabase
    .from("videos")
    .delete()
    .eq("id", videoId);

  if (deleteError) {
    return NextResponse.json(
      { error: deleteError.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
