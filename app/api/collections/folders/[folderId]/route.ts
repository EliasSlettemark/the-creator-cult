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

  const { data: folder, error: folderError } = await supabase
    .from("folders")
    .select("id, name, created_at, user_id")
    .eq("id", folderId)
    .single();

  if (folderError || !folder) {
    return NextResponse.json({ error: "Folder not found" }, { status: 404 });
  }

  if (folder.user_id !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json(folder);
}

export async function DELETE(
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

  const { data: folder, error: folderError } = await supabase
    .from("folders")
    .select("id, user_id")
    .eq("id", folderId)
    .single();

  if (folderError || !folder) {
    return NextResponse.json({ error: "Folder not found" }, { status: 404 });
  }

  if (folder.user_id !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { error: deleteError } = await supabase
    .from("folders")
    .delete()
    .eq("id", folderId);

  if (deleteError) {
    return NextResponse.json(
      { error: deleteError.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
