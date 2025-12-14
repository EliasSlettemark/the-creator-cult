import { cookies } from "next/headers";
import DashboardLayout from "./DashboardLayoutClient";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const userCookie = cookieStore.get("whop_user");
  const isMember = cookieStore.get("whop_member")?.value === "true";

  if (!isMember || !userCookie) {
    return null;
  }

  let userProfile;
  try {
    userProfile = JSON.parse(userCookie.value);
  } catch {
    return null;
  }

  return (
    <DashboardLayout userProfile={userProfile}>{children}</DashboardLayout>
  );
}
