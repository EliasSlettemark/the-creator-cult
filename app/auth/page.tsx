import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import AuthClient from "@/app/auth/AuthClient";
import { authOptions } from "@/lib/auth";

const AuthPage = async () => {
  console.log("🔍 [AUTH_PAGE] Starting auth page check");
  
  try {
    console.log("🔍 [AUTH_PAGE] Getting server session...");
    const session = await getServerSession(authOptions);
    console.log("🔍 [AUTH_PAGE] Session result:", {
      hasSession: !!session,
      hasUser: !!session?.user,
      userId: session?.user?.id,
      userEmail: (session?.user as any)?.email
    });

    // If user is already authenticated, redirect to dashboard
    if (session?.user) {
      console.log("✅ [AUTH_PAGE] User authenticated, redirecting to dashboard");
      redirect("/dashboard");
    }

    console.log("ℹ️ [AUTH_PAGE] No session found, showing auth client");
    return <AuthClient />;
  } catch (error) {
    console.error("💥 [AUTH_PAGE] Error occurred:", error);
    // On error, still show auth client instead of crashing
    return <AuthClient />;
  }
};

export default AuthPage;