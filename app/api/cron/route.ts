import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import axios from "axios";

// Prevent prerendering - this route should only run at request time
export const dynamic = 'force-dynamic';

function getStartOfWeek() {
  const now = new Date();
  const day = now.getDay() || 7;
  now.setHours(0, 0, 0, 0);
  now.setDate(now.getDate() - day + 1);
  return Math.floor(now.getTime() / 1000);
}

function getStartOfMonth() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  startOfMonth.setHours(0, 0, 0, 0);
  return Math.floor(startOfMonth.getTime() / 1000);
}

export async function GET() {
  const supabase = createClient(
    process.env.SUPABASE_URL as string,
    process.env.SUPABASE_ANON_KEY as string
  );

  const { data: accounts, error } = await supabase
    .from("accounts")
    .select("*")
    .order("created_at", { ascending: false }) as { data: Account[] | null; error: any };

  if (error) {
    console.log("error", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }

  if (!accounts) {
    return NextResponse.json({ error: "No accounts found" }, { status: 404 });
  }

  // Define the account type
  type Account = {
    id: string;
    user_id: string;
    username?: string;
    name?: string;
    display_name?: string;
    profile_pic_url?: string;
    avatar_url?: string;
    access_token: string;
    created_at: string;
  };

  const latestAccounts = accounts.reduce(
    (acc, account) => {
      if (
        !acc[account.user_id] ||
        acc[account.user_id].created_at < account.created_at
      ) {
        acc[account.user_id] = account;
      }
      return acc;
    },
    {} as Record<string, Account>
  );

  const accountsArray = Object.values(latestAccounts);

  const startOfWeek = getStartOfWeek();
  const startOfMonth = getStartOfMonth();

  const users: Record<
    string,
    {
      name: string;
      views_this_week: number;
      views_this_month: number;
      videos_this_month: number;
      likes_this_month: number;
      followers: number;
    }
  > = {};

  for (const account of accountsArray) {
    const accessToken = account.access_token;
    if (!accessToken) continue;

    try {
      const followerResponse = await axios.get(
        "https://open.tiktokapis.com/v2/user/info/?fields=follower_count",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      const followerCount = followerResponse.data?.data?.follower_count || 0;

      await supabase
        .from("accounts")
        .update({ followers: followerCount })
        .eq("id", account.id);

      let cursor = 0;
      let hasMore = true;
      let videos: any[] = [];

      while (hasMore) {
        const response = await axios.post(
          "https://open.tiktokapis.com/v2/video/list/?fields=id,create_time,view_count,cover_image_url,title,like_count",
          {
            max_count: 20,
            ...(cursor > 0 && { cursor }),
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        videos = [...videos, ...(response.data?.data?.videos || [])];

        hasMore = response.data?.data?.has_more || false;
        cursor = response.data?.data?.cursor || 0;

        if (cursor > 0 && cursor < startOfMonth * 1000) {
          break;
        }
      }

      for (const video of videos) {
        const created = video.create_time;
        const views = video.view_count || 0;
        const likes = video.like_count || 0;
        const userId = account.user_id;

        if (!users[userId]) {
          users[userId] = {
            name: account.username || account.name || account.display_name || "Unknown User",
            views_this_week: 0,
            views_this_month: 0,
            videos_this_month: 0,
            likes_this_month: 0,
            followers: 0, 
          };
        }

        users[userId].followers += followerCount; 

        if (created >= startOfMonth) {
          users[userId].views_this_month += views;
          users[userId].likes_this_month += likes;
          users[userId].videos_this_month += 1;
          if (created >= startOfWeek) {
            users[userId].views_this_week += views;
          }
        }
      }

      if (videos.length > 0) {
        const latestVideo = videos.reduce((a: any, b: any) =>
          a.create_time > b.create_time ? a : b
        );
        const sortedByViews = [...videos].sort(
          (a, b) => b.view_count - a.view_count
        );
        const latestVideoRank =
          sortedByViews.findIndex((v) => v.id === latestVideo.id) + 1;

        const upsertData = {
          user_id: account.user_id,
          username: account.username || account.display_name || account.name || "Unknown User",
          profile_pic_url: account.profile_pic_url || account.avatar_url || "",
          views_this_week: users[account.user_id].views_this_week,
          views_this_month: users[account.user_id].views_this_month,
          videos_this_month: users[account.user_id].videos_this_month,
          likes_this_month: users[account.user_id].likes_this_month,
          followers: users[account.user_id].followers,
          latest_video_id: latestVideo.id,
          latest_video_views: latestVideo.view_count,
          latest_video_rank: latestVideoRank,
          latest_video_cover: latestVideo.cover_image_url,
          latest_video_title: latestVideo.title,
        };

        const { data, error } = await supabase
          .from("leaderboard")
          .upsert(upsertData, { onConflict: "user_id" });
      }
    } catch (error) {
      console.log(error);
    }
  }

  for (const [userId, userData] of Object.entries(users)) {
    const { data, error } = await supabase.from("leaderboard").upsert(
      {
        user_id: userId,
        username: userData.name,
        views_this_week: userData.views_this_week,
        views_this_month: userData.views_this_month,
        videos_this_month: userData.videos_this_month,
        likes_this_month: userData.likes_this_month,
        followers: userData.followers,
      },
      { onConflict: "user_id" }
    );
  }

  const { data: leaderboard } = await supabase.from("leaderboard").select("*");
  if (leaderboard) {
    leaderboard.sort((a, b) => b.views_this_week - a.views_this_week);
    for (let i = 0; i < leaderboard.length; i++) {
      await supabase
        .from("leaderboard")
        .update({ rank_this_week: i + 1 })
        .eq("user_id", leaderboard[i].user_id);
    }
    leaderboard.sort((a, b) => b.views_this_month - a.views_this_month);
    for (let i = 0; i < leaderboard.length; i++) {
      await supabase
        .from("leaderboard")
        .update({ rank_this_month: i + 1 })
        .eq("user_id", leaderboard[i].user_id);
    }
  }

  return NextResponse.json({ success: true });
}
