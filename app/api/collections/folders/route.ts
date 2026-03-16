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

export async function GET() {
  const userId = getUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
  );

  const { data, error } = await supabase
    .from("folders")
    .select("id, name, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const foldersWithCount = await Promise.all(
    (data || []).map(async (folder) => {
      const { count } = await supabase
        .from("videos")
        .select("*", { count: "exact", head: true })
        .eq("folder_id", folder.id);
      return { ...folder, video_count: count ?? 0 };
    })
  );

  return NextResponse.json(foldersWithCount);
}

export async function POST(request: Request) {
  const userId = getUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { name?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  if (!name) {
    return NextResponse.json(
      { error: "Folder name is required" },
      { status: 400 }
    );
  }

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
  );

  const { data, error } = await supabase
    .from("folders")
    .insert({ user_id: userId, name })
    .select("id, name, created_at")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ...data, video_count: 0 });
}
