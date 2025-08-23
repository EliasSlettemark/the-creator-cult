"use client";

import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ChevronRightIcon,
} from "@radix-ui/react-icons";
import {
  Avatar,
  Button,
  Card,
  Heading,
  IconButton,
  Inset,
  Separator,
  Tabs,
  Text,
  Theme,
  ThemePanel,
  Tooltip,
} from "frosted-ui";
import localFont from "next/font/local";
import WhopLogo from "./WhopLogo";
import { signIn, signOut } from "next-auth/react";
import { redirect } from "next/navigation";
import getSdk from "@/lib/get-user-sdk/app";

const interVariable = localFont({
  src: "../../fonts/InterVariable.woff2",
  variable: "--inter-variable",
});

const AuthClient = () => {
  return (
    <html lang="en" suppressHydrationWarning className={interVariable.variable}>
      <body>
        {/* TODO: NextThemeProvider creates some infinite loop and app crashes */}
        {/* <NextThemeProvider> */}
        <Theme asChild appearance="dark" grayColor="gray" accentColor="blue">
          <div id="root" className="w-full bg-gray-1">
            <header className="sticky top-0 backdrop-blur-lg z-10 backdrop-saturate-150">
              <div
                className="absolute inset-0 bg-panel-translucent -z-[1]"
                style={{ filter: "url(#myFilter" }}
              />
              <div
                style={{
                  maxWidth: "1136px",
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  flexShrink: 0,
                  flexGrow: 1,
                }}
              >
                <div>
                  <div className="py-4 flex items-center">
                    <WhopLogo className="w-[137px] h-auto" />
                  </div>
                </div>
              </div>
              <Separator
                color="gray"
                orientation="horizontal"
                size="4"
                className="relative z-[1]"
              />
            </header>
            <div
              style={{
                maxWidth: "1136px",
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                flexShrink: 0,
                flexGrow: 1,
              }}
            >
              <div className="pt-[120px] flex flex-nowrap">
                <div className="w-full">
                  <Heading size="9" trim="start">
                    A marketplace for really cool internet products.
                  </Heading>
                  <Text as="p" color="gray" size="5" style={{ marginTop: 16 }}>
                    Entrepreneurial communities and software to help you earn
                    online.
                  </Text>
                  <Tooltip content="This is a tooltip">
                    <Button
                      variant="classic"
                      size="4"
                      style={{ marginTop: 16 }}
                      onClick={() => signIn("whop")}
                    >
                      Sign in with <WhopLogo className="w-[137px] h-auto" />
                    </Button>
                  </Tooltip>
                </div>
                <div className="w-[500px] shrink-0 pl-12">
                  <div className="flex gap-2 items-center">
                    <Heading size="5">Recent activity</Heading>
                    <Text size="2" color="blue" trim="both">
                      LIVE
                    </Text>
                  </div>

                  <div
                    className="flex flex-col gap-3 mt-4"
                    style={{
                      WebkitMaskImage:
                        "linear-gradient(175deg, black, transparent)",
                    }}
                  >
                    <ActivityCard title="Goat Sports Club" />
                    <ActivityCard title="Parlay Kings" />
                    <ActivityCard title="SneakerBot 2.0" />
                    <ActivityCard title="UI Design Course" />
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-12 bg-gray-3">
              <div
                style={{
                  maxWidth: "1136px",
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  flexShrink: 0,
                  flexGrow: 1,
                }}
              >
                <div className="flex justify-center gap-12 py-12">
                  <div className="text-center">
                    <Heading size="7">#172,264,047</Heading>
                    <Text size="2" color="gray">
                      Purchased on Whop
                    </Text>
                  </div>
                  <div className="text-center">
                    <Heading size="7" color="magenta">
                      #172,264,047
                    </Heading>
                    <Text size="2" color="gray">
                      Purchased on Whop
                    </Text>
                  </div>
                  <div className="text-center">
                    <Heading size="7" color="pink">
                      #172,264,047
                    </Heading>
                    <Text size="2" color="gray">
                      Purchased on Whop
                    </Text>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Theme>
        {/* </NextThemeProvider> */}
        <svg>
          <defs>
            <filter id="myFilter">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.55"
                numOctaves="2"
              />
              <feComponentTransfer>
                <feFuncA type="linear" slope="89" intercept="-15" />
              </feComponentTransfer>
              <feComposite in="SourceGraphic" operator="in" />
            </filter>
          </defs>
        </svg>
      </body>
    </html>
  );
};

export default AuthClient;

const ActivityCard = ({ title }: { title: string }) => {
  return (
    <Card variant="surface">
      <div className="flex items-center gap-4">
        <Avatar size="3" fallback="AB" />
        <div>
          <Heading size="3">{title}</Heading>
          <Text size="2" color="gray">
            Someone just paid 99$
          </Text>
        </div>
      </div>
    </Card>
  );
};
