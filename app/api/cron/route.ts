import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import axios from "axios";
import querystring from "querystring";

export const dynamic = "force-dynamic";

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

const calculatePostingStreak = (videos: any[]) => {
  if (!videos || videos.length === 0) return 0;

  const sortedVideos = videos.sort(
    (a, b) =>
      new Date(b.create_time).getTime() - new Date(a.create_time).getTime()
  );

  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayVideo = sortedVideos.find((video) => {
    const videoDate = new Date(video.create_time);
    videoDate.setHours(0, 0, 0, 0);
    return videoDate.getTime() === today.getTime();
  });

  if (todayVideo) {
    streak = 1;

    for (let i = 1; i < sortedVideos.length; i++) {
      const currentVideoDate = new Date(sortedVideos[i].create_time);
      currentVideoDate.setHours(0, 0, 0, 0);

      const previousVideoDate = new Date(sortedVideos[i - 1].create_time);
      previousVideoDate.setHours(0, 0, 0, 0);

      const daysDifference = Math.floor(
        (previousVideoDate.getTime() - currentVideoDate.getTime()) /
          (1000 * 60 * 60 * 24)
      );

      if (daysDifference === 1) {
        streak++;
      } else {
        break;
      }
    }
  }

  return streak;
};

export async function GET() {
  const supabase = createClient(
    process.env.SUPABASE_URL as string,
    process.env.SUPABASE_ANON_KEY as string
  );

  const { data: accounts, error } = (await supabase
    .from("accounts")
    .select("*")
    .order("created_at", { ascending: false })) as {
    data: UserAccount[] | null;
    error: any;
  };

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

  type UserAccount = {
    id: string;
    user_id: string;
    username?: string;
    name?: string;
    display_name?: string;
    profile_pic_url?: string;
    avatar_url?: string;
    access_token: string;
    refresh_token?: string;
    access_token_expires_at?: string;
    refresh_token_expires_at?: string;
    created_at: string;
  };

  const usersByAccount = accounts.reduce(
    (acc, account) => {
      if (!acc[account.user_id]) {
        acc[account.user_id] = { accounts: [] };
      }
      acc[account.user_id].accounts.push(account);
      return acc;
    },
    {} as Record<string, { accounts: UserAccount[] }>
  );

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
      streak: number;
      videos: any[];
      profile_pic_url: string;
    }
  > = {};

  for (const [userId, userAccount] of Object.entries(usersByAccount)) {
    users[userId] = {
      name: "",
      views_this_week: 0,
      views_this_month: 0,
      videos_this_month: 0,
      likes_this_month: 0,
      followers: 0,
      streak: 0,
      videos: [],
      profile_pic_url: "",
    };

    for (const account of userAccount.accounts) {
      let accessToken = account.access_token;
      if (!accessToken) continue;

      // Check if token is expired or about to expire (within 5 minutes)
      const expiresAt = account.access_token_expires_at 
        ? new Date(account.access_token_expires_at).getTime() 
        : null;
      const now = Date.now();
      const fiveMinutes = 5 * 60 * 1000;
      
      // Try to refresh token if expired or about to expire
      if (!expiresAt || (expiresAt - now) < fiveMinutes) {
        if (account.refresh_token) {
          try {
            const params = {
              client_key: process.env.TIKTOK_CLIENT_KEY!,
              client_secret: process.env.TIKTOK_CLIENT_SECRET!,
              grant_type: "refresh_token",
              refresh_token: account.refresh_token,
            };

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

            // Update account with new tokens
            await supabase
              .from("accounts")
              .update({
                access_token,
                refresh_token,
                access_token_expires_at: new Date(Date.now() + expires_in * 1000).toISOString(),
                refresh_token_expires_at: new Date(
                  Date.now() + refresh_expires_in * 1000
                ).toISOString(),
              })
              .eq("id", account.id);

            accessToken = access_token;
          } catch (refreshError: any) {
            console.log(`Error refreshing token for account ${account.id}:`, refreshError.response?.status || refreshError.message);
            // If refresh fails, skip this account
            continue;
          }
        } else {
          // No refresh token available, skip this account
          console.log(`No refresh token available for account ${account.id}, skipping`);
          continue;
        }
      }

      try {
        if (!users[userId].profile_pic_url) {
          users[userId].name = account.username || account.name || account.display_name || "";
          users[userId].profile_pic_url = account.profile_pic_url || account.avatar_url || "";
        }

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
          try {
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

            const fetchedVideos = response.data?.data?.videos || [];
            videos = [...videos, ...fetchedVideos];

            hasMore = response.data?.data?.has_more || false;
            cursor = response.data?.data?.cursor || 0;

            if (cursor > 0 && cursor < startOfMonth * 1000) {
              break;
            }
          } catch (videoError: any) {
            console.log(`Error fetching videos for account ${account.id}:`, videoError.response?.data || videoError.message);
            hasMore = false; // Stop trying to fetch more videos
          }
        }
        
        console.log(`Fetched ${videos.length} videos for account ${account.id} (user: ${account.username})`);

        users[userId].videos = [...users[userId].videos, ...videos];
        users[userId].followers += followerCount;

        for (const video of videos) {
          const created = video.create_time;
          const views = video.view_count || 0;
          const likes = video.like_count || 0;

          if (created >= startOfMonth) {
            users[userId].views_this_month += views;
            users[userId].likes_this_month += likes;
            users[userId].videos_this_month += 1;
            if (created >= startOfWeek) {
              users[userId].views_this_week += views;
            }
          }
        }
      } catch (error: any) {
        console.log(`Error processing account ${account.id}:`, error.response?.data || error.message);
      }
    }

    users[userId].streak = calculatePostingStreak(users[userId].videos);
  }

  for (const [userId, userData] of Object.entries(users)) {
    // Skip demo/test users
    if (userData.name?.toLowerCase().includes('demo') || userId?.toLowerCase().includes('demo')) continue;

    // Get latest video if available
    const latestVideo = userData.videos.length > 0 
      ? userData.videos.reduce((a: any, b: any) =>
          a.create_time > b.create_time ? a : b
        )
      : null;
    
    const sortedByViews = userData.videos.length > 0
      ? [...userData.videos].sort((a, b) => b.view_count - a.view_count)
      : [];
    const latestVideoRank = latestVideo && sortedByViews.length > 0
      ? sortedByViews.findIndex((v) => v.id === latestVideo.id) + 1
      : null;

    const upsertData = {
      user_id: userId,
      streak: userData.streak,
      username: userData.name,
      profile_pic_url: userData.profile_pic_url,
      views_this_week: userData.views_this_week,
      views_this_month: userData.views_this_month,
      videos_this_month: userData.videos_this_month,
      likes_this_month: userData.likes_this_month,
      followers: userData.followers,
      latest_video_id: latestVideo?.id || null,
      latest_video_views: latestVideo?.view_count || 0,
      latest_video_rank: latestVideoRank || null,
      latest_video_cover: latestVideo?.cover_image_url || null,
      latest_video_title: latestVideo?.title || null,
    };

    const { data, error } = await supabase
      .from("leaderboard")
      .upsert(upsertData, { onConflict: "user_id" });
  }

  // Clean up demo/test users from leaderboard
  const { data: allLeaderboardEntries } = await supabase.from("leaderboard").select("*");
  if (allLeaderboardEntries) {
    const demoUserIds = allLeaderboardEntries
      .filter(entry => 
        entry.username?.toLowerCase().includes('demo') || 
        entry.user_id?.toLowerCase().includes('demo')
      )
      .map(entry => entry.user_id);
    
    if (demoUserIds.length > 0) {
      await supabase
        .from("leaderboard")
        .delete()
        .in("user_id", demoUserIds);
    }
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