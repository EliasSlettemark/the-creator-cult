import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import getSdk from "@/lib/get-user-sdk/app";
import DashboardLayout from "./DashboardLayoutClient";
import { Spinner } from "frosted-ui";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return null;
  }

  const { sdk } = await getSdk();
  const userProfile = await sdk?.retrieveUsersProfile({});

  if (!userProfile) {
    return (
      <div className="w-full h-[100vh] bg-gray-1 flex items-center justify-center">
        <Spinner size="3" />
      </div>
    );
  }

  return (
    <DashboardLayout userProfile={userProfile}>{children}</DashboardLayout>
  );
}
