import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import axios from "axios";

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
      const accessToken = account.access_token;
      if (!accessToken) continue;

      try {
        if (!users[userId].profile_pic_url) {
          users[userId].name = account.username || account.name || account.display_name || "";
          users[userId].profile_pic_url = account.profile_pic_url || account.avatar_url || "";
        }

        console.log(`Processing account ${account.id} for user ${userId}`);

        const followerResponse = await axios.get(
          "https://open.tiktokapis.com/v2/user/info/?fields=follower_count",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        console.log(`Successfully fetched follower data for account ${account.id}`);

        const followerCount = followerResponse.data?.data?.follower_count || 0;

        await supabase
          .from("accounts")
          .update({ followers: followerCount })
          .eq("id", account.id);

        let cursor = 0;
        let hasMore = true;
        let videos: any[] = [];

        console.log(`Fetching videos for account ${account.id}...`);

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

        console.log(`Fetched ${videos.length} videos for account ${account.id}`);

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
        console.error(`Error processing account ${account.id}:`, {
          accountId: account.id,
          userId: userId,
          errorMessage: error.message,
          errorCode: error.code,
          status: error.response?.status,
          statusText: error.response?.statusText,
          responseData: error.response?.data,
          accessTokenExpiry: (account as any).access_token_expires_at,
          refreshTokenExpiry: (account as any).refresh_token_expires_at,
        });
        
        // If 401, token is likely expired - skip this account
        if (error.response?.status === 401) {
          console.warn(`Account ${account.id} has expired token. Skipping. Consider refreshing tokens.`);
        }
      }
    }

    users[userId].streak = calculatePostingStreak(users[userId].videos);
  }

  console.log('Processing users for leaderboard:', Object.keys(users).map(uid => ({
    userId: uid,
    videoCount: users[uid].videos.length,
    viewsThisMonth: users[uid].views_this_month,
    followers: users[uid].followers,
  })));

  for (const [userId, userData] of Object.entries(users)) {
    console.log(`Processing leaderboard entry for user ${userId}, videos: ${userData.videos.length}`);
    
    let upsertData: any = {
      user_id: userId,
      streak: userData.streak,
      username: userData.name,
      profile_pic_url: userData.profile_pic_url,
      views_this_week: userData.views_this_week,
      views_this_month: userData.views_this_month,
      videos_this_month: userData.videos_this_month,
      likes_this_month: userData.likes_this_month,
      followers: userData.followers,
    };

    if (userData.videos.length === 0) {
      console.warn(`User ${userId} has no videos - adding to leaderboard with null video data`);
      // Add null values for video fields
      upsertData.latest_video_id = null;
      upsertData.latest_video_views = null;
      upsertData.latest_video_rank = null;
      upsertData.latest_video_cover = null;
      upsertData.latest_video_title = null;
    } else {
      const latestVideo = userData.videos.reduce((a: any, b: any) =>
        a.create_time > b.create_time ? a : b
      );
      
      const sortedByViews = [...userData.videos].sort(
        (a, b) => b.view_count - a.view_count
      );
      const latestVideoRank =
        sortedByViews.findIndex((v) => v.id === latestVideo.id) + 1;

      upsertData.latest_video_id = latestVideo.id;
      upsertData.latest_video_views = latestVideo.view_count;
      upsertData.latest_video_rank = latestVideoRank;
      upsertData.latest_video_cover = latestVideo.cover_image_url;
      upsertData.latest_video_title = latestVideo.title;
    }

    console.log(`Upserting leaderboard data for user ${userId}:`, upsertData);

    const { data, error } = await supabase
      .from("leaderboard")
      .upsert(upsertData, { onConflict: "user_id" });

    if (error) {
      console.error(`Failed to upsert leaderboard for user ${userId}:`, error);
    } else {
      console.log(`Successfully upserted leaderboard for user ${userId}`);
    }
  }

  console.log('Updating ranks...');
  
  const { data: leaderboard } = await supabase.from("leaderboard").select("*");
  
  console.log(`Found ${leaderboard?.length || 0} leaderboard entries`);
  
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
    console.log('Ranks updated successfully');
  }

  console.log('Cron job completed successfully');
  return NextResponse.json({ success: true, processedUsers: Object.keys(users).length });
}