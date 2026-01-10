import {
  CookieIcon,
  DiscordLogoIcon,
  EnvelopeOpenIcon,
  GitHubLogoIcon,
  LinkedInLogoIcon,
  MixerVerticalIcon,
  // App icons
  NotionLogoIcon,
} from "@radix-ui/react-icons";
import {
  Button,
  Card,
  Heading,
  IconButton,
  Inset,
  Separator,
  Strong,
  Text,
  TextField,
  Tooltip,
  Table,
  Avatar,
  Badge,
  Progress,
} from "frosted-ui";
import {
  BreadcrumbHome,
  BreadcrumbSeparator,
  Breadcrumb,
} from "@/components/breadcrumbs";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { createClient } from "@supabase/supabase-js";
import React, { useEffect, useState } from "react";
import Countdown from "@/components/countdown";
import Image from "next/image";
import { PageSection } from "@/components/page-section";
import { getModules } from "@/data/lessons";
import { cookies } from "next/headers";

const rank = (views: number): string => {
  if (views >= 3000000) return "ALGO HACKER";
  if (views >= 1000000) return "SCROLLSTOPPA";
  if (views >= 250000) return "HUSTLER";
  if (views >= 50000) return "NOOB";
  return "UNRANKED";
};

const image = (rank: string): string => {
  switch (rank) {
    case "ALGO HACKER":
      return "/algo_hacker.png";
    case "SCROLLSTOPPA":
      return "/scrollstoppa.png";
    case "HUSTLER":
      return "/hustler.png";
    case "NOOB":
      return "/noob.png";
    default:
      return "/unranked.png";
  }
};

const WhopSVG = () => {
  return (
    <div className="absolute bottom-0 right-0 pointer-events-none">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="306"
        height="117"
        viewBox="0 0 306 117"
        fill="none"
        className="dark:hidden"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M363.247 29.3265L244.198 148.376C204.722 187.852 157.795 180.712 130.762 153.679L249.811 34.6295C291.308 -6.86682 338.166 4.24574 363.247 29.3265ZM119.948 142.865L233.487 29.3262C205.77 1.6095 163.385 -8.70491 122.639 32.041L65.8814 88.799L119.948 142.865ZM109.133 23.9202L55.0664 77.9864L1.10451 23.8159C27.4004 -2.48001 74.599 -10.6134 109.133 23.9202Z"
          fill="url(#paint0_linear_350_1383123)"
        />
        <path
          d="M363.247 29.3265L363.6 29.68L363.954 29.3265L363.6 28.9729L363.247 29.3265ZM130.762 153.679L130.409 153.325L130.055 153.679L130.409 154.032L130.762 153.679ZM249.811 34.6295L250.165 34.983L249.811 34.6295ZM233.487 29.3262L233.84 29.6798L234.194 29.3262L233.84 28.9727L233.487 29.3262ZM119.948 142.865L119.594 143.219L119.948 143.572L120.301 143.219L119.948 142.865ZM122.639 32.041L122.993 32.3945L122.639 32.041ZM65.8814 88.799L65.5278 88.4455L65.1743 88.799L65.5278 89.1526L65.8814 88.799ZM55.0664 77.9864L54.7122 78.3393L55.0657 78.6942L55.4199 78.34L55.0664 77.9864ZM109.133 23.9202L109.486 24.2738L109.84 23.9202L109.486 23.5667L109.133 23.9202ZM1.10451 23.8159L0.750954 23.4623L0.39808 23.8152L0.750271 24.1688L1.10451 23.8159ZM244.551 148.729L363.6 29.68L362.893 28.9729L243.844 148.022L244.551 148.729ZM130.409 154.032C144.011 167.634 162.623 176.237 182.808 176.468C203.001 176.699 224.728 168.552 244.551 148.729L243.844 148.022C224.191 167.675 202.717 175.696 182.82 175.468C162.915 175.24 144.547 166.756 131.116 153.325L130.409 154.032ZM249.458 34.2759L130.409 153.325L131.116 154.032L250.165 34.983L249.458 34.2759ZM363.6 28.9729C350.98 16.3527 332.879 7.24315 312.703 6.51191C292.515 5.78021 270.295 13.4392 249.458 34.2759L250.165 34.983C270.825 14.3235 292.782 6.79056 312.667 7.51125C332.565 8.23241 350.433 17.2195 362.893 29.68L363.6 28.9729ZM233.133 28.9727L119.594 142.512L120.301 143.219L233.84 29.6798L233.133 28.9727ZM122.993 32.3945C143.285 12.1022 163.936 4.56778 182.924 5.50951C201.925 6.45187 219.339 15.8858 233.133 29.6798L233.84 28.9727C219.917 15.0499 202.281 5.46829 182.974 4.51073C163.654 3.55254 142.74 11.2338 122.286 31.6874L122.993 32.3945ZM66.2349 89.1526L122.993 32.3945L122.286 31.6874L65.5278 88.4455L66.2349 89.1526ZM120.301 142.512L66.2349 88.4455L65.5278 89.1526L119.594 143.219L120.301 142.512ZM55.4199 78.34L109.486 24.2738L108.779 23.5667L54.7128 77.6329L55.4199 78.34ZM0.750271 24.1688L54.7122 78.3393L55.4206 77.6335L1.45874 23.463L0.750271 24.1688ZM109.486 23.5667C74.7238 -11.1957 27.2068 -2.99349 0.750954 23.4623L1.45806 24.1695C27.594 -1.96652 74.4743 -10.031 108.779 24.2738L109.486 23.5667Z"
          fill="url(#paint1_linear_350_13836231)"
        />
        <defs>
          <linearGradient
            id="paint0_linear_350_1383123"
            x1="182.027"
            y1="23.484"
            x2="182.158"
            y2="132.005"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#E5E9EE" stopOpacity="0.16" />
            <stop offset="1" stopColor="white" stopOpacity="0" />
          </linearGradient>
          <linearGradient
            id="paint1_linear_350_13836231"
            x1="182.027"
            y1="21.891"
            x2="182.158"
            y2="89.1537"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#E1E5EA" stopOpacity="0.35" />
            <stop offset="1" stopColor="#EAEDF0" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="306"
        height="117"
        viewBox="0 0 306 117"
        fill="none"
        className="hidden dark:block"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M363.247 29.3265L244.198 148.376C204.722 187.852 157.795 180.712 130.762 153.679L249.811 34.6295C291.308 -6.86682 338.166 4.24574 363.247 29.3265ZM119.948 142.865L233.487 29.3262C205.77 1.6095 163.385 -8.70491 122.639 32.041L65.8814 88.799L119.948 142.865ZM109.133 23.9202L55.0664 77.9864L1.10451 23.8159C27.4004 -2.48001 74.599 -10.6134 109.133 23.9202Z"
          fill="url(#paint0_linear_350_13836)"
        />
        <path
          d="M363.247 29.3265L363.6 29.68L363.954 29.3265L363.6 28.9729L363.247 29.3265ZM130.762 153.679L130.409 153.325L130.055 153.679L130.409 154.032L130.762 153.679ZM249.811 34.6295L250.165 34.983L249.811 34.6295ZM233.487 29.3262L233.84 29.6798L234.194 29.3262L233.84 28.9727L233.487 29.3262ZM119.948 142.865L119.594 143.219L119.948 143.572L120.301 143.219L119.948 142.865ZM122.639 32.041L122.993 32.3945L122.639 32.041ZM65.8814 88.799L65.5278 88.4455L65.1743 88.799L65.5278 89.1526L65.8814 88.799ZM55.0664 77.9864L54.7122 78.3393L55.0657 78.6942L55.4199 78.34L55.0664 77.9864ZM109.133 23.9202L109.486 24.2738L109.84 23.9202L109.486 23.5667L109.133 23.9202ZM1.10451 23.8159L0.750954 23.4623L0.39808 23.8152L0.750271 24.1688L1.10451 23.8159ZM244.551 148.729L363.6 29.68L362.893 28.9729L243.844 148.022L244.551 148.729ZM130.409 154.032C144.011 167.634 162.623 176.237 182.808 176.468C203.001 176.699 224.728 168.552 244.551 148.729L243.844 148.022C224.191 167.675 202.717 175.696 182.82 175.468C162.915 175.24 144.547 166.756 131.116 153.325L130.409 154.032ZM249.458 34.2759L130.409 153.325L131.116 154.032L250.165 34.983L249.458 34.2759ZM363.6 28.9729C350.98 16.3527 332.879 7.24315 312.703 6.51191C292.515 5.78021 270.295 13.4392 249.458 34.2759L250.165 34.983C270.825 14.3235 292.782 6.79056 312.667 7.51125C332.565 8.23241 350.433 17.2195 362.893 29.68L363.6 28.9729ZM233.133 28.9727L119.594 142.512L120.301 143.219L233.84 29.6798L233.133 28.9727ZM122.993 32.3945C143.285 12.1022 163.936 4.56778 182.924 5.50951C201.925 6.45187 219.339 15.8858 233.133 29.6798L233.84 28.9727C219.917 15.0499 202.281 5.46829 182.974 4.51073C163.654 3.55254 142.74 11.2338 122.286 31.6874L122.993 32.3945ZM66.2349 89.1526L122.993 32.3945L122.286 31.6874L65.5278 88.4455L66.2349 89.1526ZM120.301 142.512L66.2349 88.4455L65.5278 89.1526L119.594 143.219L120.301 142.512ZM55.4199 78.34L109.486 24.2738L108.779 23.5667L54.7128 77.6329L55.4199 78.34ZM0.750271 24.1688L54.7122 78.3393L55.4206 77.6335L1.45874 23.463L0.750271 24.1688ZM109.486 23.5667C74.7238 -11.1957 27.2068 -2.99349 0.750954 23.4623L1.45806 24.1695C27.594 -1.96652 74.4743 -10.031 108.779 24.2738L109.486 23.5667Z"
          fill="url(#paint1_linear_350_13836)"
        />
        <defs>
          <linearGradient
            id="paint0_linear_350_13836"
            x1="182.027"
            y1="23.484"
            x2="182.158"
            y2="132.005"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="white" stopOpacity="0.03" />
            <stop offset="1" stopColor="white" stopOpacity="0" />
          </linearGradient>
          <linearGradient
            id="paint1_linear_350_13836"
            x1="182.027"
            y1="21.891"
            x2="182.158"
            y2="89.1537"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="white" stopOpacity="0.07" />
            <stop offset="1" stopColor="white" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

const Leaderboard = async () => {
  // Function to determine user rank based on monthly views
  const getUserRank = (views: number): string => {
    if (views >= 3000000) return "ALGO HACKER";
    if (views >= 1000000) return "SCROLLSTOPPA";
    if (views >= 250000) return "HUSTLER";
    if (views >= 50000) return "NOOB";
    return "UNRANKED";
  };

  const supabase = createClient(
    process.env.SUPABASE_URL as string,
    process.env.SUPABASE_ANON_KEY as string
  );

  const { data: leaderboardData, error } = await supabase
    .from("leaderboard")
    .select("*")
    .order("views_this_month", { ascending: false });

  // Filter out demo/test users
  const filteredLeaderboardData = leaderboardData?.filter(
    (entry) => 
      entry.username && 
      !entry.username.toLowerCase().includes('demo') && 
      !entry.user_id?.toLowerCase().includes('demo')
  ) || [];

  if (error) {
    console.error("Error fetching leaderboard data:", error);
    return (
      <div className="px-[54px] pr-12 py-7">
        <Text color="red">Error loading leaderboard data</Text>
      </div>
    );
  }

  // Get user from cookie
  const cookieStore = cookies();
  const userCookie = cookieStore.get("whop_user");
  
  let user = null;
  if (userCookie) {
    try {
      user = JSON.parse(userCookie.value);
    } catch {
      user = null;
    }
  }

  const leaderboard = filteredLeaderboardData.find(
    (item) => item.user_id === user?.id
  );
  const leaderboardIndex = filteredLeaderboardData.findIndex(
    (item) => item.user_id === user?.id
  );

  return (
    <div className="space-y-16">
      <div className=" mx-auto max-w-7xl">
        <div className="px-[54px] pr-12 py-7 flex flex-col gap-8">
          <div className="flex flex-row items-center justify-between">
            <div>
              <div className="flex flex-col gap-2">
                <Heading
                  size="8"
                  style={{
                    fontFeatureSettings: `'liga' 1, 'calt' 1`,
                  }}
                >
                  Leaderboard
                </Heading>
                <Text color="gray">Top creators by monthly views</Text>
              </div>
            </div>
          </div>

          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-blue-200 dark:border-blue-800">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-2">
                  <Heading
                    size="5"
                    className="text-blue-600 dark:text-blue-400"
                  >
                    🏆 Season Rewards
                  </Heading>
                  <Text size="3" className="text-gray-700 dark:text-gray-300">
                    Top 3 creators win $100 + Custom LED
                  </Text>
                  <Text size="2" color="gray">
                    Compete for exclusive prizes every season
                  </Text>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-right">
                    <Text
                      size="4"
                      weight="bold"
                      className="text-green-600 dark:text-green-400"
                    >
                      $100
                    </Text>
                    <Text size="2" color="gray">
                      Cash Prize
                    </Text>
                  </div>
                  <div className="flex items-center gap-2 text-right">
                    <Text
                      size="4"
                      weight="bold"
                      className="text-purple-600 dark:text-purple-400"
                    >
                      LED
                    </Text>
                    <Text size="2" color="gray">
                      Custom Display
                    </Text>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {user && (
            <Card>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 p-4">
                  <Avatar
                    className="w-20 h-20"
                    src={user.profile_pic_url}
                    fallback={user.username?.charAt(0) || "U"}
                  />
                  <div className="flex flex-col">
                    <p className="text-gray-a11 text-lg">You are</p>
                    <div className="flex items-center gap-2">
                      <Text size="3" weight="medium">
                        {typeof leaderboardIndex === "number" &&
                        leaderboardIndex >= 0
                          ? `#${leaderboardIndex + 1}`
                          : "Unranked"}
                      </Text>
                      <Badge>{rank(leaderboard?.views_this_month || 0)}</Badge>
                    </div>
                  </div>
                </div>
                <div className="flex gap-4 p-4">
                  <Card>
                    <div
                      style={{
                        alignItems: "center",
                        display: "flex",
                        padding: "var(--space-4)",
                      }}
                    >
                      <div className="flex flex-col items-center justify-center">
                        <Text as="div" size="6" weight="bold">
                          {leaderboard?.views_this_month?.toLocaleString("en-US") || "0"}
                        </Text>
                        <Text as="div" color="gray">
                          Views
                        </Text>
                      </div>
                    </div>
                  </Card>
                  <Card>
                    <div
                      style={{
                        alignItems: "center",
                        display: "flex",
                        padding: "var(--space-4)",
                      }}
                    >
                      <div className="flex flex-col items-center justify-center">
                        <Text as="div" size="6" weight="bold">
                          {leaderboard?.videos_this_month || "0"}
                        </Text>
                        <Text as="div" color="gray">
                          Posts
                        </Text>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </Card>
          )}

          <Countdown />

          {typeof leaderboardIndex === "number" &&
            leaderboardIndex >= 0 &&
            filteredLeaderboardData && (
              <Card className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 border-green-200 dark:border-green-800">
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-2">
                      <Heading
                        size="5"
                        className="text-green-600 dark:text-green-400"
                      >
                        📈 Your Progress
                      </Heading>
                      <Text
                        size="3"
                        className="text-gray-700 dark:text-gray-300"
                      >
                        You're currently ranked{" "}
                        <span className="font-semibold text-green-600 dark:text-green-400">
                          #{leaderboardIndex + 1}
                        </span>
                        {leaderboardIndex > 0 ? (
                          <>
                            {" "}
                            and are{" "}
                            <span className="font-semibold text-blue-600 dark:text-blue-400">
                              {(
                                filteredLeaderboardData[leaderboardIndex - 1]
                                  .views_this_month -
                                (leaderboard?.views_this_month || 0)
                              ).toLocaleString("en-US")}
                            </span>{" "}
                            views from passing{" "}
                            <span className="font-semibold text-purple-600 dark:text-purple-400">
                              {filteredLeaderboardData[leaderboardIndex - 1].username ||
                                "the creator above you"}
                            </span>
                          </>
                        ) : (
                          <span className="font-semibold text-yellow-600 dark:text-yellow-400">
                            🥇 You're #1! Keep it up!
                          </span>
                        )}
                      </Text>
                      {leaderboardIndex > 0 && (
                        <Text size="2" color="gray">
                          Next milestone: Reach{" "}
                          <span className="font-medium">
                            {filteredLeaderboardData[
                              leaderboardIndex - 1
                            ].views_this_month?.toLocaleString("en-US") || "0"}
                          </span>{" "}
                          views to move up to #{leaderboardIndex}
                        </Text>
                      )}
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <div className="text-center">
                        <Text
                          size="6"
                          weight="bold"
                          className="text-green-600 dark:text-green-400"
                        >
                          #{leaderboardIndex + 1}
                        </Text>
                        <Text size="2" color="gray">
                          Current Rank
                        </Text>
                      </div>
                      {leaderboardIndex > 0 && (
                        <div className="text-center">
                          <Text
                            size="4"
                            weight="bold"
                            className="text-blue-600 dark:text-blue-400"
                          >
                            {(
                              filteredLeaderboardData[leaderboardIndex - 1]
                                .views_this_month -
                              (leaderboard?.views_this_month || 0)
                            ).toLocaleString()}
                          </Text>
                          <Text size="2" color="gray">
                            Views to Pass
                          </Text>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            )}

          <div className="grid grid-cols-2  lg:grid-cols-5 gap-4">
            {[
              {
                rank: "UNRANKED",
                image: "/unranked.png",
                name: "Unranked",
              },
              { rank: "NOOB", image: "/noob.png", name: "Noob" },
              { rank: "HUSTLER", image: "/hustler.png", name: "Hustler" },
              {
                rank: "SCROLLSTOPPA",
                image: "/scrollstoppa.png",
                name: "Scrollstoppa",
              },
              {
                rank: "ALGO HACKER",
                image: "/algo_hacker.png",
                name: "Algo Hacker",
              },
            ].map((tier) => {
              const userRank = getUserRank(leaderboard?.views_this_month || 0);
              const isCurrentRank = tier.rank === userRank;

              return (
                <div
                  key={tier.rank}
                  className={`flex flex-col items-center justify-center gap-2 ${
                    isCurrentRank ? "ring-2 ring-blue-500 rounded-lg p-2" : ""
                  }`}
                >
                  <Image
                    src={tier.image}
                    alt={tier.name}
                    width={1000}
                    height={1000}
                    className="w-full h-full object-cover"
                  />
                  <Text
                    size="3"
                    weight="bold"
                    className={isCurrentRank ? "text-blue-500" : ""}
                  >
                    {tier.name}
                  </Text>
                </div>
              );
            })}
          </div>

          <div className="flex flex-row items-center justify-between">
            <TextField.Root>
              <TextField.Input
                placeholder="Search creators..."
                type="search"
                size="3"
              />
            </TextField.Root>
          </div>

          <Separator size="4" />

          <div className="w-full">
            <div className="flex w-full border-b border-gray-700 pb-2 mb-4">
              <div className="w-20 font-semibold">Rank</div>
              <div className="flex-1 font-semibold">Creator</div>
              <div className="w-32 font-semibold text-right">Monthly Views</div>
            </div>
            <div className="space-y-2">
              {filteredLeaderboardData && filteredLeaderboardData.length > 0 ? (
                filteredLeaderboardData.map((entry, index) => (
                  <div
                    key={entry.user_id}
                    className="flex w-full items-center py-2"
                  >
                    <div className="w-20">
                      <Badge
                        variant="soft"
                        color={
                          index === 0
                            ? "amber"
                            : index === 1
                              ? "gray"
                              : index === 2
                                ? "orange"
                                : "gray"
                        }
                      >
                        #{index + 1}
                      </Badge>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <Avatar
                          src={entry.profile_pic_url}
                          fallback={entry.username?.charAt(0) || "U"}
                          size="2"
                        />
                        <div className="flex flex-col">
                          <Text weight="medium">
                            {entry.username || "Unknown"}
                          </Text>
                          <Text size="1" color="gray">
                            {entry.user_id}
                          </Text>
                        </div>
                      </div>
                    </div>
                    <div className="w-32 text-right">
                      <Text weight="medium">
                        {entry.views_this_month?.toLocaleString("en-US") || "0"}
                      </Text>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center py-8">
                  <Text color="gray">No leaderboard data available</Text>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;


