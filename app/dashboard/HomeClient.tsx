"use client";

import {
  CodeIcon,
  CookieIcon,
  DiscordLogoIcon,
  EnvelopeOpenIcon,
  GearIcon,
  GitHubLogoIcon,
  PlusIcon,
  HomeIcon,
  LinkedInLogoIcon,
  MixerVerticalIcon,
  MobileIcon,
  NotionLogoIcon,
  ReloadIcon,
  RocketIcon,
} from "@radix-ui/react-icons";
import {
  Avatar,
  Badge,
  Button,
  Card,
  Checkbox,
  DropdownMenu,
  Heading,
  IconButton,
  Inset,
  Popover,
  Separator,
  Strong,
  Text,
  TextArea,
  TextField,
  Theme,
  ThemePanel,
  Tooltip,
  WidgetStack,
} from "frosted-ui";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import Image from "next/image";
import { PageSection } from "@/components/page-section";
import {
  Breadcrumb,
  BreadcrumbHome,
  BreadcrumbSeparator,
  Breadcrumbs,
} from "@/components/breadcrumbs";
import { CenteredPageLayout } from "@/components/centered-layout";

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

const rank = (
  currentViews: number
): { rank: string; requiredViews: number } => {
  if (currentViews >= 3000000)
    return { rank: "ALGO HACKER", requiredViews: 3000000 };
  if (currentViews >= 1000000)
    return { rank: "SCROLLSTOPPA", requiredViews: 1000000 };
  if (currentViews >= 250000) return { rank: "HUSTLER", requiredViews: 250000 };
  if (currentViews >= 50000) return { rank: "NOOB", requiredViews: 50000 };
  return { rank: "NOOB", requiredViews: 50000 };
};

export default function Dashboard({ user }: { user: any }) {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);

  const getDaysLeftInMonth = () => {
    const now = new Date();
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const daysLeft = endOfMonth.getDate() - now.getDate();
    return daysLeft;
  };

  useEffect(() => {
    const fetchAccounts = async () => {
      const res = await fetch(`/api/accounts?userId=${user?.id}`);
      const { accounts, leaderboard, video } = await res.json();

      setAccounts(accounts);
      setLeaderboard(leaderboard);
    };
    fetchAccounts();
  }, [user?.id]);

  const views =
    leaderboard && leaderboard.length > 0 ? leaderboard[0].views_this_month : 0;
  const requiredViews = rank(views).requiredViews;
  const nextRank = rank(views).rank;

  const progressPercentage = Math.min((views / requiredViews) * 100, 100);

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
                  Welcome, {user?.name}!
                </Heading>
                <Text color="gray">Overview of your activity this month</Text>
              </div>
            </div>
          </div>
          <div className="space-y-16">
            <Card className="w-full" style={{ padding: "0px" }}>
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  height: "100%",
                  width: `${progressPercentage}%`,
                  background: "linear-gradient(var(--blue-9), var(--blue-6))",
                  transition: "width 0.3s ease",
                  borderRadius: "var(--radius-3)",
                }}
              />

              <div
                style={{
                  position: "relative",
                  zIndex: 1,
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "var(--space-4)",
                  minHeight: "80px",
                }}
              >
                <Text
                  as="div"
                  style={{ fontWeight: "500", textAlign: "center" }}
                >
                  {views.toLocaleString()} / {requiredViews.toLocaleString()}{" "}
                  views → {nextRank} rank
                </Text>
                <Text
                  as="div"
                  style={{
                    fontSize: "0.875rem",
                    opacity: 0.8,
                    marginTop: "4px",
                    textAlign: "center",
                  }}
                >
                  {Math.round(progressPercentage)}% complete
                </Text>
              </div>
            </Card>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--space-8)",
              }}
            >
              <WidgetStack.Root orientation="vertical">
                <WidgetStack.Stack
                  style={{
                    height: 200,
                    width: "100%",
                  }}
                >
                  <WidgetStack.Item>
                    <div
                      style={{
                        background:
                          "linear-gradient(var(--blue-9), var(--blue-6))",
                        color: "var(--blue-9-contrast)",
                        display: "flex",
                        flexDirection: "row",
                        height: "100%",
                        justifyContent: "space-between",
                        gap: "var(--space-4)",
                        width: "100%",
                      }}
                    >
                      <div
                        className="w-1/2 p-8"
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "var(--space-4)",
                          justifyContent: "space-between",
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <Text size="3" weight="medium">
                            CURRENT RANK
                          </Text>
                          <Badge size="1" variant="surface">
                            {getDaysLeftInMonth()} days left
                          </Badge>
                        </div>
                        <Card className="h-full">
                          <div className="flex flex-col gap-2">
                            <Text>Total views</Text>
                            <Text size="8" weight="bold">
                              {leaderboard && leaderboard.length > 0
                                ? leaderboard[0].views_this_month
                                : 0}
                            </Text>
                          </div>
                        </Card>
                      </div>
                      <div
                        className="w-1/2 p-8"
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "var(--space-4)",
                          justifyContent: "space-between",
                        }}
                      >
                        <Text size="3" weight="medium">
                          CURRENT RANK
                        </Text>
                        <Card className="h-full">
                          <div className="flex flex-col gap-2">
                            <Text>Total views</Text>
                            <Text size="8" weight="bold">
                              {leaderboard && leaderboard.length > 0
                                ? leaderboard[0].views_this_month
                                : 0}
                            </Text>
                          </div>
                        </Card>
                      </div>
                    </div>
                  </WidgetStack.Item>
                </WidgetStack.Stack>
              </WidgetStack.Root>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <div
                  style={{
                    alignItems: "center",
                    display: "flex",
                    padding: "var(--space-4)",
                  }}
                >
                  <div>
                    <Text as="div" color="gray">
                      Total views
                    </Text>
                    <Text as="div" size="6" weight="bold">
                      {leaderboard &&
                        leaderboard.length > 0 &&
                        leaderboard[0].views_this_month}
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
                  <div>
                    <Text as="div" color="gray">
                      Total likes
                    </Text>
                    <Text as="div" size="6" weight="bold">
                      {leaderboard && leaderboard.length > 0
                        ? leaderboard[0].likes_this_month
                        : 0}
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
                  <div>
                    <Text as="div" color="gray">
                      Videos posted
                    </Text>
                    <Text as="div" size="6" weight="bold">
                      {leaderboard && leaderboard.length > 0
                        ? leaderboard[0].videos_this_month
                        : 0}
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
                  <div>
                    <Text as="div" color="gray">
                      Streak
                    </Text>
                    <Text as="div" size="6" weight="bold" className="flex items-center gap-2">
                      <span className="text-2xl">🔥</span>
                      {leaderboard && leaderboard.length > 0
                        ? leaderboard[0].videos_this_month
                        : 0}
                    </Text>
                  </div>
                </div>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="flex flex-col gap-4">
                <Text size="5" weight="medium">
                  Your Latest Video
                </Text>
                <div className="flex gap-4">
                  {leaderboard && leaderboard.length > 0 && (
                    <Image
                      src={leaderboard[0].latest_video_cover}
                      alt="Latest video cover"
                      width={1080}
                      height={1920}
                      className="w-full h-full object-cover"
                      style={{
                        borderRadius: "var(--radius-2)",
                        width: "200px",
                        objectFit: "cover",
                      }}
                    />
                  )}
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-col gap-2">
                      <Text size="7" weight="bold">
                        #
                        {leaderboard &&
                        leaderboard.length > 0 &&
                        leaderboard[0].latest_video_rank
                          ? leaderboard[0].latest_video_rank
                          : 0}{" "}
                        of{" "}
                        {leaderboard &&
                        leaderboard.length > 0 &&
                        leaderboard[0].videos_this_month
                          ? leaderboard[0].videos_this_month
                          : 0}
                      </Text>
                      <Text size="3" weight="medium" color="gray">
                        Ranking by views
                      </Text>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Text size="7" weight="bold">
                        {leaderboard &&
                        leaderboard.length > 0 &&
                        leaderboard[0].latest_video_views
                          ? leaderboard[0].latest_video_views
                          : 0}
                      </Text>
                      <Text size="3" weight="medium" color="gray">
                        Views
                      </Text>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <Text size="3" weight="medium">
                  Next coaching call in X days @ Y time
                </Text>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {accounts &&
                accounts.length > 0 &&
                accounts.map((account) => (
                  <Card key={account.id}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar src={account.avatar_url} fallback="PB" />
                        <Text>{account.display_name}</Text>
                      </div>
                      <Button
                        onClick={async () => {
                          await fetch(`/api/accounts?id=${account.id}`, {
                            method: "DELETE",
                          });
                          setAccounts(
                            accounts.filter(
                              (account) => account.id !== account.id
                            )
                          );
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  </Card>
                ))}
              <Button
                onClick={async () => {
                  const res = await fetch("/api/oauth");
                  const { url } = await res.json();
                  window.location.href = url;
                }}
                color="gray"
                className="p-8 cursor-pointer"
              >
                <PlusIcon width="20" height="20" />
                <Text>Add account</Text>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}