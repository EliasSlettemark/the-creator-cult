"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function TikTokCallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const error = searchParams.get("error");

    if (error) {
      console.error("TikTok OAuth error:", error);
      router.push("/dashboard?error=tiktok_auth_failed");
      return;
    }

    if (code && state) {
      fetch("/api/oauth/tiktok/callback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, state }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            console.error("TikTok callback error:", data.error);
            router.push("/dashboard?error=tiktok_auth_failed");
          } else {
            router.push("/dashboard?success=account_connected");
          }
        })
        .catch((err: any) => {
          console.error("TikTok callback error:", err);
          router.push("/dashboard?error=tiktok_auth_failed");
        });
    }
  }, [searchParams, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <p>Completing TikTok authentication...</p>
      </div>
    </div>
  );
}

