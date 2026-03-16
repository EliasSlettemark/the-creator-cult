import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import path from "path";
import os from "os";
import fs from "fs/promises";
import download from "@/services/download";
import convert from "@/services/convert";
import transcribe from "@/services/transcribe";

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

export async function POST(request: Request) {
  const userId = getUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { videoId?: string; originalUrl?: string };
  try {
    body = await request.json();
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const videoId = typeof body.videoId === "string" ? body.videoId.trim() : "";
  const originalUrl =
    typeof body.originalUrl === "string" ? body.originalUrl.trim() : "";

  if (!videoId || !originalUrl) {
    return NextResponse.json(
      { error: "videoId and originalUrl are required" },
      { status: 400 }
    );
  }

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
  );

  const { data: videoRow, error: videoError } = await supabase
    .from("videos")
    .select("id, folder_id")
    .eq("video_id", videoId)
    .limit(1)
    .maybeSingle();

  if (videoError || !videoRow) {
    return NextResponse.json(
      { error: "Video not found in your collections" },
      { status: 404 }
    );
  }

  const { data: folder } = await supabase
    .from("folders")
    .select("user_id")
    .eq("id", videoRow.folder_id)
    .single();

  if (!folder || folder.user_id !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const tempDir = path.join(os.tmpdir(), `transcribe-${videoId}-${Date.now()}`);

  try {
    await fs.mkdir(tempDir, { recursive: true });

    const { videoPath } = await download(
      originalUrl,
      videoId,
      tempDir
    );

    const mp3Path = await convert(videoPath);
    const transcript = await transcribe(mp3Path);

    const { error: updateError } = await supabase
      .from("videos")
      .update({ transcript })
      .eq("id", videoRow.id);

    if (updateError) {
      throw new Error(updateError.message);
    }

    return NextResponse.json({ transcript });
  } catch (error) {
    console.log(error);
    const message = error instanceof Error ? error.message : "Transcription failed";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  } finally {
    try {
      await fs.rm(tempDir, { recursive: true, force: true });
    } catch (e) {
      console.log(e);
    }
  }
}
