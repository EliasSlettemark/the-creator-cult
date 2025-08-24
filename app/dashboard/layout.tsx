"use client";

import {
  AccessibilityIcon,
  CameraIcon,
  ChevronDownIcon,
  ClockIcon,
  CodeIcon,
  CookieIcon,
  EnvelopeOpenIcon,
  GearIcon,
  HomeIcon,
  MixerVerticalIcon,
  MobileIcon,
  ReloadIcon,
  HamburgerMenuIcon,
} from "@radix-ui/react-icons";
import {
  Avatar,
  Button,
  Card,
  Checkbox,
  DropdownMenu,
  IconButton,
  Link,
  Text,
  TextArea,
  Theme,
} from "frosted-ui";
import { Menu as MenuComponent } from "@/components/menu";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  MenuButton,
  MenuItem,
  MenuItems,
  TransitionChild,
} from "@headlessui/react";
import { CloseIcon } from "@/icons/close-icon";
import localFont from "next/font/local";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

// Prevent prerendering - this layout uses client-side hooks
export const dynamic = 'force-dynamic';

const interVariable = localFont({
  src: "../../fonts/InterVariable.woff2",
  variable: "--inter-variable",
});

const SidebarButton = ({
  children,
  href,
}: {
  children: React.ReactNode;
  href: string;
}) => {
  return (
    <Link href={href}>
      <button
        className={
          "fui-reset flex items-center text-gray-a10 gap-4 w-full h-[42px] pl-4 rounded-md hover:bg-gray-a3 hover:text-gray-a12 dark:hover:shadow-[0px 0px 0px 1px_var(--gray-a4)_inset] dark:hover:bg-[linear-gradient(_95deg,transparent,transparent,transparent,var(--accent-a4)_)]"
        }
      >
        {children}
      </button>
    </Link>
  );
};

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [windowWidth, setWindowWidth] = useState(0);
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth");
    }
  }, [status, router]);

  useEffect(() => {
    const getWindowWidth = () => {
      setWindowWidth(window.innerWidth);
    };

    getWindowWidth();

    window.addEventListener("resize", getWindowWidth);

    return () => window.removeEventListener("resize", getWindowWidth);
  }, []);

  if (status === "loading") {
    return (
      <html
        lang="en"
        suppressHydrationWarning
        className={"frosted-ui " + interVariable.variable}
      >
        <body>
          <Theme asChild appearance="dark" grayColor="gray" accentColor="blue">
            <div className="w-full h-[100vh] bg-gray-1 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
          </Theme>
        </body>
      </html>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  const user = session?.user;

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={"frosted-ui " + interVariable.variable}
    >
      <body>
        <Theme asChild appearance="dark" grayColor="gray" accentColor="blue">
          <div
            id="root"
            className="w-full h-[100vh] bg-gray-1 flex flex-no-wrap p-2"
          >
            <div>
              <Dialog
                open={sidebarOpen}
                onClose={setSidebarOpen}
                className="relative z-50 lg:hidden"
              >
                <DialogBackdrop
                  transition
                  className="fixed inset-0 transition-opacity duration-300 ease-linear data-closed:opacity-0"
                />

                <div className="fixed inset-0 flex">
                  <DialogPanel
                    transition
                    className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-closed:-translate-x-full"
                  >
                    <TransitionChild>
                      <div className="absolute top-0 left-full flex w-16 justify-center pt-5 duration-300 ease-in-out data-closed:opacity-0">
                        <button
                          type="button"
                          onClick={() => setSidebarOpen(false)}
                          className="-m-2.5 p-2.5"
                        >
                          <span className="sr-only">Close sidebar</span>
                          <CloseIcon
                            aria-hidden="true"
                            className="size-6 text-white"
                          />
                        </button>
                      </div>
                    </TransitionChild>

                    <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-[#111111] pb-4 ring-1 ring-white/10">
                      <aside className="h-full w-[300px] py-2 px-6">
                        <div className="flex flex-col justify-between h-full">
                          <div>
                            <div className="flex px-4 py-2">
                              <Card variant="ghost" style={{ flex: 1 }} asChild>
                                <button className="fui-reset">
                                  <div className="flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-3">
                                      <Avatar
                                        src="/icon.png"
                                        fallback={user?.name?.charAt(0) || "U"}
                                      />
                                      <Text>{user?.name || "User"}</Text>
                                    </div>
                                    <ChevronDownIcon />
                                  </div>
                                </button>
                              </Card>
                            </div>
                            <div className="flex flex-col gap-1 pt-6">
                              <SidebarButton href="/dashboard">
                                <HomeIcon width="24" height="24" />
                                Dashboard
                              </SidebarButton>
                              <SidebarButton href="/dashboard/courses">
                                <AccessibilityIcon width="24" height="24" />
                                Courses
                              </SidebarButton>
                              <SidebarButton href="/dashboard/leaderboard">
                                <MixerVerticalIcon width="24" height="24" />
                                Leaderboard
                              </SidebarButton>
                              <SidebarButton href="/dashboard/calendar">
                                <EnvelopeOpenIcon width="24" height="24" />
                                Calendar
                              </SidebarButton>
                              <SidebarButton href="/dashboard/resources">
                                <CookieIcon width="24" height="24" />
                                Resources
                              </SidebarButton>
                            </div>
                          </div>
                          <MenuComponent />
                        </div>
                      </aside>
                    </div>
                  </DialogPanel>
                </div>
              </Dialog>

              <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
                <aside className="h-full w-[300px] py-2 px-6">
                  <div className="flex flex-col justify-between h-full">
                    <div>
                      <div className="flex px-4 py-2">
                        <Card variant="ghost" style={{ flex: 1 }} asChild>
                          <button className="fui-reset">
                            <div className="flex items-center justify-between gap-3">
                              <div className="flex items-center gap-3">
                                <Avatar
                                  src="/icon.png"
                                  fallback={user?.name?.charAt(0) || "U"}
                                />
                                <Text>{user?.name || "User"}</Text>
                              </div>
                              <ChevronDownIcon />
                            </div>
                          </button>
                        </Card>
                      </div>
                      <div className="flex flex-col gap-1 pt-6">
                        <SidebarButton href="/dashboard">
                          <HomeIcon width="24" height="24" />
                          Dashboard
                        </SidebarButton>
                        <SidebarButton href="/dashboard/courses">
                          <AccessibilityIcon width="24" height="24" />
                          Courses
                        </SidebarButton>
                        <SidebarButton href="/dashboard/leaderboard">
                          <MixerVerticalIcon width="24" height="24" />
                          Leaderboard
                        </SidebarButton>
                        <SidebarButton href="/dashboard/calendar">
                          <EnvelopeOpenIcon width="24" height="24" />
                          Calendar
                        </SidebarButton>
                        <SidebarButton href="/dashboard/resources">
                          <CookieIcon width="24" height="24" />
                          Resources
                        </SidebarButton>
                      </div>
                    </div>
                    <MenuComponent />
                  </div>
                </aside>
              </div>

              <div className="lg:pl-72">
                <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 bg-[#030712e6] px-4 shadow-xs sm:gap-x-6 sm:px-6 lg:px-8">
                  <button
                    type="button"
                    onClick={() => setSidebarOpen(true)}
                    className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
                  >
                    <span className="sr-only">Open sidebar</span>
                    <HamburgerMenuIcon aria-hidden="true" className="size-6" />
                  </button>

                  <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
                    <div className="flex items-center gap-x-4 lg:gap-x-6">
                      <div>
                        <button className="relative flex items-center">
                          <span className="absolute -inset-1.5" />
                          <span className="sr-only">Open user menu</span>
                          <img
                            alt=""
                            src={
                              user?.image ||
                              "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                            }
                            className="size-8 rounded-full bg-gray-50"
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <main
                  className={
                    windowWidth >= 1024
                      ? "w-[calc(100vw-300px)]"
                      : "w-[calc(100vw-12px)]"
                  }
                >
                  {children}
                </main>
              </div>
            </div>
          </div>
        </Theme>
      </body>
    </html>
  );
};

export default DashboardLayout;
