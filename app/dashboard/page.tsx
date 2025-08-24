import getSdk from "@/lib/get-user-sdk/app";
import HomeClient from "@/app/dashboard/HomeClient";

const HomePage = async () => {
  const { sdk, user } = await getSdk();

  return <HomeClient user={user} />;
};

export default HomePage;