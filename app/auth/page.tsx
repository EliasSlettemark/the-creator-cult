import getSdk from "@/lib/get-user-sdk/app";
import { redirect } from "next/navigation";
import AuthClient from "@/app/auth/AuthClient";

const AuthPage = async () => {
  const { sdk, user } = await getSdk();

  if (user) {
    redirect("/dashboard");
  }

  return <AuthClient />;
};

export default AuthPage;