import DashboardLayout from "./DashboardLayoutClient";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userProfile = {
    id: "demo-user",
    username: "User",
    profile_pic_url: null,
  } as any;

  return (
    <DashboardLayout userProfile={userProfile}>{children}</DashboardLayout>
  );
}