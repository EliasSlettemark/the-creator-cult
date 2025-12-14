import { cookies } from "next/headers";
import HomeClient from "@/app/dashboard/HomeClient";

const HomePage = async () => {
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

  return <HomeClient user={user} />;
};

export default HomePage;